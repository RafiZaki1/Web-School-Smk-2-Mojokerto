'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { CAMPUS_BUILDINGS } from '../data/campus';
import {
  FLY_IN_START_CAMERA,
  getResponsiveDroneCamera,
  useCampusStore,
} from '../store/useCampusStore';
import {
  clampFirstPersonCamera,
  clampThirdPersonCamera,
  pushOutOfObstacles,
} from '../utils/collision';

const MODE_BLEND_DURATION = 0.6; // detik

export function CameraRig() {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera, gl, invalidate } = useThree();

  const selectedId = useCampusStore((s) => s.selectedId);
  const routeActive = useCampusStore((s) => s.routeActive);
  const routeFollowActive = useCampusStore((s) => s.routeFollowActive);
  const cameraMode = useCampusStore((s) => s.cameraMode);
  const cameraTarget = useCampusStore((s) => s.cameraTarget);
  const cameraMoveNonce = useCampusStore((s) => s.cameraMoveNonce);
  const zoomRequest = useCampusStore((s) => s.zoomRequest);
  const stopRouteFollow = useCampusStore((s) => s.stopRouteFollow);
  const setLiveCameraPosition = useCampusStore((s) => s.setLiveCameraPosition);
  const setPointerLocked = useCampusStore((s) => s.setPointerLocked);

  const selectedBuilding = useMemo(
    () => CAMPUS_BUILDINGS.find((b) => b.id === selectedId) ?? null,
    [selectedId],
  );

  const flyInRef = useRef({ active: false, elapsed: 0, initialized: false });
  const isAnimating = useRef(false);
  const goalPos = useRef(new THREE.Vector3());
  const goalLook = useRef(new THREE.Vector3());
  const routeProgressRef = useRef(0);
  const lastReportRef = useRef(0);

  // Transisi halus 0,6 detik saat berpindah mode kamera
  const modeBlendRef = useRef({
    active: false,
    elapsed: 0,
    startPos: new THREE.Vector3(),
    startLook: new THREE.Vector3(),
  });
  const prevModeRef = useRef(cameraMode);
  const lookTargetVec = useRef(new THREE.Vector3());

  // Inisialisasi fly-in awal (2 detik)
  useEffect(() => {
    if (flyInRef.current.initialized) return;
    flyInRef.current.initialized = true;

    const droneTarget = getResponsiveDroneCamera();
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      camera.position.set(...droneTarget.position);
      if (controlsRef.current) {
        controlsRef.current.target.set(...droneTarget.lookAt);
        controlsRef.current.update();
      }
      invalidate();
      return;
    }

    camera.position.set(...FLY_IN_START_CAMERA.position);
    if (controlsRef.current) {
      controlsRef.current.target.set(...FLY_IN_START_CAMERA.lookAt);
      controlsRef.current.update();
    }
    flyInRef.current = { active: true, elapsed: 0, initialized: true };
    invalidate();
  }, [camera, invalidate]);

  // Mulai transisi 0,6 detik saat berpindah mode (drone <-> third <-> first)
  useEffect(() => {
    if (prevModeRef.current === cameraMode) return;
    prevModeRef.current = cameraMode;

    flyInRef.current.active = false;
    isAnimating.current = false;

    const currentLook = new THREE.Vector3(0, 0, -1)
      .applyQuaternion(camera.quaternion)
      .multiplyScalar(10)
      .add(camera.position);

    modeBlendRef.current = {
      active: true,
      elapsed: 0,
      startPos: camera.position.clone(),
      startLook: controlsRef.current ? controlsRef.current.target.clone() : currentLook,
    };

    if (cameraMode === 'drone' && document.pointerLockElement) {
      document.exitPointerLock?.();
    } else if (cameraMode === 'first' || cameraMode === 'third') {
      // Pastikan avatar tidak berada di dalam bangunan saat pindah mode
      const store = useCampusStore.getState();
      const [safeX, safeZ] = pushOutOfObstacles(
        store.avatarPos[0],
        store.avatarPos[2],
        0.55,
        store.avatarPos[1],
      );
      if (safeX !== store.avatarPos[0] || safeZ !== store.avatarPos[2]) {
        store.setAvatarTransform([safeX, store.avatarPos[1], safeZ], store.avatarYaw);
      }
    }
    invalidate();
  }, [cameraMode, camera, invalidate]);

  // Pointer lock + mouse look untuk Third Person & First Person
  useEffect(() => {
    const dom = gl.domElement;

    const onCanvasClick = () => {
      const mode = useCampusStore.getState().cameraMode;
      if (mode === 'third' || mode === 'first') {
        if (document.pointerLockElement !== dom) {
          dom.requestPointerLock?.();
        }
      }
    };

    const onPointerLockChange = () => {
      setPointerLocked(document.pointerLockElement === dom);
    };

    const onMouseMove = (e: MouseEvent) => {
      const state = useCampusStore.getState();
      if (state.cameraMode === 'drone') return;
      if (document.pointerLockElement !== dom) return;

      const factor = 0.0022 * state.sensitivity;
      const ySign = state.invertY ? -1 : 1;
      const nextYaw = state.avatarYaw - e.movementX * factor;
      const nextPitch = THREE.MathUtils.clamp(
        state.avatarPitch - e.movementY * factor * ySign,
        -0.55,
        0.65,
      );
      state.setAvatarTransform(state.avatarPos, nextYaw, nextPitch);
    };

    dom.addEventListener('click', onCanvasClick);
    document.addEventListener('pointerlockchange', onPointerLockChange);
    document.addEventListener('mousemove', onMouseMove);

    return () => {
      dom.removeEventListener('click', onCanvasClick);
      document.removeEventListener('pointerlockchange', onPointerLockChange);
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, [gl, setPointerLocked]);

  // Animasi perpindahan kamera pada mode Drone
  useEffect(() => {
    if (cameraMode !== 'drone' || cameraMoveNonce === 0) return;
    flyInRef.current.active = false;
    goalPos.current.set(...cameraTarget.position);
    goalLook.current.set(...cameraTarget.lookAt);
    isAnimating.current = true;
    invalidate();
  }, [cameraTarget, cameraMoveNonce, cameraMode, invalidate]);

  useEffect(() => {
    if (routeFollowActive && routeActive) {
      flyInRef.current.active = false;
      isAnimating.current = false;
      routeProgressRef.current = 0;
      invalidate();
    }
  }, [routeFollowActive, routeActive, invalidate]);

  // Zoom In / Zoom Out dari tombol HUD kanan bawah pada Drone View
  useEffect(() => {
    if (zoomRequest.nonce === 0 || cameraMode !== 'drone' || !controlsRef.current) return;
    const controls = controlsRef.current;
    const offset = camera.position.clone().sub(controls.target);
    const currentLen = offset.length();
    const nextLen = THREE.MathUtils.clamp(currentLen + zoomRequest.delta, 20, 165);
    offset.setLength(nextLen);
    camera.position.copy(controls.target).add(offset);
    controls.update();
    invalidate();
  }, [zoomRequest, cameraMode, camera, invalidate]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const store = useCampusStore.getState();
    const controls = controlsRef.current;

    // Sinkronkan FOV (65 di First Person, 38 di Drone/Third Person) dan near plane 0.1
    const persp = state.camera as THREE.PerspectiveCamera;
    const targetFov = store.cameraMode === 'first' ? 65 : 38;
    if (persp.fov !== targetFov || persp.near !== 0.1) {
      persp.fov = targetFov;
      persp.near = 0.1;
      persp.updateProjectionMatrix();
    }

    // MODE THIRD PERSON & FIRST PERSON
    if (store.cameraMode === 'third' || store.cameraMode === 'first') {
      const [ax, ay, az] = store.avatarPos;
      const yaw = store.avatarYaw;
      const pitch = store.avatarPitch;

      const fwdX = Math.sin(yaw);
      const fwdZ = Math.cos(yaw);

      let desiredPos: THREE.Vector3;
      let desiredLook: THREE.Vector3;

      if (store.cameraMode === 'first') {
        const safeEye = clampFirstPersonCamera([ax, ay + 1.6, az], fwdX, fwdZ);
        desiredPos = new THREE.Vector3(...safeEye);
        const cosP = Math.cos(pitch);
        desiredLook = new THREE.Vector3(
          safeEye[0] + fwdX * cosP * 10,
          safeEye[1] + Math.sin(pitch) * 10,
          safeEye[2] + fwdZ * cosP * 10,
        );
      } else {
        // Third Person: 6 unit di belakang avatar, tinggi ~3 unit
        const headPos: [number, number, number] = [ax, ay + 1.55, az];
        const rawCam: [number, number, number] = [
          ax - fwdX * 6,
          ay + 3.0 - Math.sin(pitch) * 2.2,
          az - fwdZ * 6,
        ];
        const safeCam = clampThirdPersonCamera(headPos, rawCam);
        desiredPos = new THREE.Vector3(...safeCam);
        desiredLook = new THREE.Vector3(
          ax + fwdX * 1.5,
          ay + 1.55 + Math.sin(pitch) * 2.5,
          az + fwdZ * 1.5,
        );
      }

      if (modeBlendRef.current.active) {
        modeBlendRef.current.elapsed += dt;
        const t = Math.min(1, modeBlendRef.current.elapsed / MODE_BLEND_DURATION);
        const eased = 1 - Math.pow(1 - t, 3);
        camera.position.lerpVectors(modeBlendRef.current.startPos, desiredPos, eased);
        lookTargetVec.current.lerpVectors(modeBlendRef.current.startLook, desiredLook, eased);
        camera.lookAt(lookTargetVec.current);
        if (t >= 1) {
          modeBlendRef.current.active = false;
        }
      } else {
        camera.position.lerp(desiredPos, 1 - Math.exp(-16 * dt));
        camera.lookAt(desiredLook);
      }

      const now = state.clock.elapsedTime;
      if (now - lastReportRef.current > 0.12) {
        lastReportRef.current = now;
        setLiveCameraPosition([camera.position.x, camera.position.y, camera.position.z]);
      }
      return;
    }

    // MODE DRONE
    if (!controls) return;

    if (modeBlendRef.current.active) {
      const droneTarget = getResponsiveDroneCamera();
      modeBlendRef.current.elapsed += dt;
      const t = Math.min(1, modeBlendRef.current.elapsed / MODE_BLEND_DURATION);
      const eased = 1 - Math.pow(1 - t, 3);
      const targetPos = new THREE.Vector3(...droneTarget.position);
      const targetLook = new THREE.Vector3(...droneTarget.lookAt);

      camera.position.lerpVectors(modeBlendRef.current.startPos, targetPos, eased);
      controls.target.lerpVectors(modeBlendRef.current.startLook, targetLook, eased);
      controls.update();

      if (t >= 1) {
        modeBlendRef.current.active = false;
        isAnimating.current = false;
      } else {
        invalidate();
      }
    } else if (flyInRef.current.active) {
      const droneTarget = getResponsiveDroneCamera();
      flyInRef.current.elapsed += dt;
      const t = Math.min(1, flyInRef.current.elapsed / 2.0);
      const eased = 1 - Math.pow(1 - t, 3);

      camera.position.set(
        THREE.MathUtils.lerp(FLY_IN_START_CAMERA.position[0], droneTarget.position[0], eased),
        THREE.MathUtils.lerp(FLY_IN_START_CAMERA.position[1], droneTarget.position[1], eased),
        THREE.MathUtils.lerp(FLY_IN_START_CAMERA.position[2], droneTarget.position[2], eased),
      );
      controls.target.set(...droneTarget.lookAt);
      controls.update();

      if (t >= 1) {
        flyInRef.current.active = false;
      } else {
        invalidate();
      }
    } else if (
      routeFollowActive &&
      routeActive &&
      selectedBuilding?.rute &&
      selectedBuilding.rute.length >= 2
    ) {
      const pts = selectedBuilding.rute;
      routeProgressRef.current = Math.min(1, routeProgressRef.current + dt * 0.14);
      const totalSegs = pts.length - 1;
      const scaled = routeProgressRef.current * totalSegs;
      const idx = Math.min(totalSegs - 1, Math.floor(scaled));
      const segT = scaled - idx;

      const pA = pts[idx];
      const pB = pts[idx + 1];
      const wx = THREE.MathUtils.lerp(pA[0], pB[0], segT);
      const wz = THREE.MathUtils.lerp(pA[2], pB[2], segT);

      const desiredPos = new THREE.Vector3(wx + 12, 26, wz + 22);
      const desiredLook = new THREE.Vector3(wx, 1.5, wz);

      camera.position.lerp(desiredPos, 1 - Math.exp(-4 * dt));
      controls.target.lerp(desiredLook, 1 - Math.exp(-4 * dt));
      controls.update();

      if (routeProgressRef.current >= 1) {
        stopRouteFollow();
      } else {
        invalidate();
      }
    } else if (isAnimating.current) {
      const alpha = 1 - Math.exp(-5.5 * dt);
      camera.position.lerp(goalPos.current, alpha);
      controls.target.lerp(goalLook.current, alpha);
      controls.update();

      const distPos = camera.position.distanceTo(goalPos.current);
      const distLook = controls.target.distanceTo(goalLook.current);
      if (distPos < 0.25 && distLook < 0.25) {
        camera.position.copy(goalPos.current);
        controls.target.copy(goalLook.current);
        controls.update();
        isAnimating.current = false;
      } else {
        invalidate();
      }
    }

    const now = state.clock.elapsedTime;
    if (now - lastReportRef.current > 0.12) {
      lastReportRef.current = now;
      setLiveCameraPosition([camera.position.x, camera.position.y, camera.position.z]);
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enabled={cameraMode === 'drone'}
      enableDamping
      dampingFactor={0.08}
      minDistance={20}
      maxDistance={165}
      minPolarAngle={0.35}
      maxPolarAngle={1.15}
      onStart={() => {
        flyInRef.current.active = false;
        isAnimating.current = false;
        if (routeFollowActive) {
          stopRouteFollow();
        }
      }}
      onChange={() => {
        if (useCampusStore.getState().cameraMode !== 'drone') return;
        const controls = controlsRef.current;
        if (!controls) return;
        controls.target.x = THREE.MathUtils.clamp(controls.target.x, -95, 95);
        controls.target.z = THREE.MathUtils.clamp(controls.target.z, -52, 52);
        controls.target.y = THREE.MathUtils.clamp(controls.target.y, 0, 18);
        setLiveCameraPosition([camera.position.x, camera.position.y, camera.position.z]);
        invalidate();
      }}
    />
  );
}
