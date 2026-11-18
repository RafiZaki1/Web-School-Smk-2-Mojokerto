'use client';

import { create } from 'zustand';
import { CAMPUS_BUILDINGS, type CampusBuilding } from '../data/campus';

export interface CameraTargetState {
  position: [number, number, number];
  lookAt: [number, number, number];
}

export type CameraMode = 'drone' | 'third' | 'first';
export type CameraSensitivity = 0.75 | 1 | 1.5;
export type AvatarAnimState = 'idle' | 'walk' | 'run' | 'jump' | 'wave';
export type ConnectionStatus =
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'offline'
  | 'unavailable'
  | 'full';

export interface RemotePlayerState {
  id: string;
  name: string;
  pos: [number, number, number];
  yaw: number;
  anim: AvatarAnimState;
  shirtColor: string;
  hairColor: string;
  area: string;
  waveText?: string | null;
  waveUntil?: number;
  lastSeen: number;
}

export const DRONE_CAMERA: CameraTargetState = {
  position: [-8, 86, 84],
  lookAt: [-8, 0, -4],
};

export const DRONE_CAMERA_MOBILE: CameraTargetState = {
  position: [-6, 108, 106],
  lookAt: [-6, 0, -4],
};

export const OVERVIEW_CAMERA: CameraTargetState = {
  position: [0, 104, 92],
  lookAt: [0, 0, 0],
};

export const FLY_IN_START_CAMERA: CameraTargetState = {
  position: [-8, 134, 120],
  lookAt: [-8, 0, -4],
};

export const INITIAL_AVATAR_POS: [number, number, number] = [0, 0, -50.5];
export const INITIAL_AVATAR_YAW = 0;

export const DEFAULT_CAMERA = DRONE_CAMERA;

export function getResponsiveDroneCamera(): CameraTargetState {
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return DRONE_CAMERA_MOBILE;
  }
  return DRONE_CAMERA;
}

interface CampusStoreState {
  selectedId: string | null;
  hoveredId: string | null;
  showLabels: boolean;
  isNight: boolean;
  routeActive: boolean;
  routeFollowActive: boolean;
  routeNotice: string | null;
  cameraTarget: CameraTargetState;
  cameraMoveNonce: number;
  liveCameraPosition: [number, number, number];
  zoomRequest: { delta: number; nonce: number };

  // Sudut pandang & avatar
  cameraMode: CameraMode;
  invertY: boolean;
  sensitivity: CameraSensitivity;
  avatarPos: [number, number, number];
  avatarYaw: number;
  avatarPitch: number;
  avatarAnim: AvatarAnimState;
  isPanelOpen: boolean;
  isPointerLocked: boolean;
  joystickVector: [number, number];

  // Identitas, kustomisasi, interaksi & multipemain
  playerId: string;
  playerName: string;
  shirtColor: string;
  hairColor: string;
  waveText: string | null;
  waveUntil: number;
  remotePlayers: RemotePlayerState[];
  nearBuildingId: string | null;
  characterOpen: boolean;
  soundMuted: boolean;
  cityAudioMuted: boolean;
  connectionStatus: ConnectionStatus;
  isObserver: boolean;
  playerListOpen: boolean;
  teleportFade: boolean;
  teleportNonce: number;

  selectBuilding: (building: CampusBuilding | null) => void;
  selectBuildingById: (id: string | null, keepCameraMode?: boolean) => void;
  teleportToBuilding: (id: string) => void;
  focusOnPosition: (pos: [number, number, number]) => void;
  setHoveredId: (id: string | null) => void;
  toggleLabels: () => void;
  toggleNight: () => void;
  goDroneView: () => void;
  resetCamera: () => void;
  requestZoom: (delta: number) => void;
  toggleRoute: () => void;
  clearRoute: () => void;
  clearRouteNotice: () => void;
  stopRouteFollow: () => void;
  setLiveCameraPosition: (pos: [number, number, number]) => void;

  setCameraMode: (mode: CameraMode) => void;
  toggleInvertY: () => void;
  setSensitivity: (sensitivity: CameraSensitivity) => void;
  togglePanel: (open?: boolean) => void;
  resetCameraSettings: () => void;
  setAvatarTransform: (
    pos: [number, number, number],
    yaw: number,
    pitch?: number,
    anim?: AvatarAnimState,
  ) => void;
  setPointerLocked: (locked: boolean) => void;
  setJoystickVector: (vec: [number, number]) => void;

  setPlayerIdentity: (id: string, name: string) => void;
  setAvatarColors: (shirtColor: string, hairColor: string) => void;
  triggerWave: (text?: string) => void;
  setRemotePlayers: (players: RemotePlayerState[]) => void;
  setNearBuildingId: (id: string | null) => void;
  toggleCharacterModal: (open?: boolean) => void;
  toggleSoundMuted: () => void;
  toggleCityAudioMuted: () => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  setObserver: (isObserver: boolean) => void;
  togglePlayerList: (open?: boolean) => void;
}

function focusForBuilding(b: CampusBuilding): CameraTargetState {
  const [x, y, z] = b.posisi;
  const [, h, d] = b.ukuran;
  const distance = Math.max(24, Math.max(b.ukuran[0], d) * 1.5);
  return {
    position: [x + distance * 0.4, Math.max(18, h + 18), z + distance],
    lookAt: [x, y + h * 0.4, z],
  };
}

export const useCampusStore = create<CampusStoreState>((set) => ({
  selectedId: null,
  hoveredId: null,
  showLabels: false,
  isNight: false,
  routeActive: false,
  routeFollowActive: false,
  routeNotice: null,
  cameraTarget: DRONE_CAMERA,
  cameraMoveNonce: 0,
  liveCameraPosition: DRONE_CAMERA.position,
  zoomRequest: { delta: 0, nonce: 0 },

  cameraMode: 'drone',
  invertY: false,
  sensitivity: 1,
  avatarPos: INITIAL_AVATAR_POS,
  avatarYaw: INITIAL_AVATAR_YAW,
  avatarPitch: 0,
  avatarAnim: 'idle',
  isPanelOpen: false,
  isPointerLocked: false,
  joystickVector: [0, 0],

  playerId: 'local-guest',
  playerName: 'Rafi zaki',
  shirtColor: '#0284c7',
  hairColor: '#0f172a',
  waveText: null,
  waveUntil: 0,
  remotePlayers: [],
  nearBuildingId: null,
  characterOpen: false,
  soundMuted: true,
  cityAudioMuted: true,
  connectionStatus: 'connecting',
  isObserver: false,
  playerListOpen: false,
  teleportFade: false,
  teleportNonce: 0,

  selectBuilding: (building) =>
    set((state) => {
      if (!building) {
        return {
          selectedId: null,
          routeActive: false,
          routeFollowActive: false,
          routeNotice: null,
        };
      }
      return {
        selectedId: building.id,
        cameraMode: 'drone',
        routeFollowActive: false,
        routeNotice: null,
        cameraTarget: focusForBuilding(building),
        cameraMoveNonce: state.cameraMoveNonce + 1,
      };
    }),

  selectBuildingById: (id, keepCameraMode = false) =>
    set((state) => {
      if (!id) {
        return {
          selectedId: null,
          routeActive: false,
          routeFollowActive: false,
          routeNotice: null,
        };
      }
      const found = CAMPUS_BUILDINGS.find((item) => item.id === id) ?? null;
      if (!found) {
        return {
          selectedId: null,
          routeActive: false,
          routeFollowActive: false,
          routeNotice: null,
        };
      }
      if (keepCameraMode) {
        return {
          selectedId: found.id,
          routeNotice: null,
        };
      }
      return {
        selectedId: found.id,
        cameraMode: 'drone',
        routeFollowActive: false,
        routeNotice: null,
        cameraTarget: focusForBuilding(found),
        cameraMoveNonce: state.cameraMoveNonce + 1,
      };
    }),

  setHoveredId: (id) => set({ hoveredId: id }),

  toggleLabels: () => set((state) => ({ showLabels: !state.showLabels })),

  toggleNight: () => set((state) => ({ isNight: !state.isNight })),

  goDroneView: () =>
    set((state) => ({
      cameraMode: 'drone',
      routeFollowActive: false,
      routeNotice: null,
      cameraTarget: getResponsiveDroneCamera(),
      cameraMoveNonce: state.cameraMoveNonce + 1,
    })),

  resetCamera: () =>
    set((state) => ({
      selectedId: null,
      cameraMode: 'drone',
      routeActive: false,
      routeFollowActive: false,
      routeNotice: null,
      cameraTarget: OVERVIEW_CAMERA,
      cameraMoveNonce: state.cameraMoveNonce + 1,
    })),

  requestZoom: (delta) =>
    set((state) => ({
      zoomRequest: { delta, nonce: state.zoomRequest.nonce + 1 },
    })),

  toggleRoute: () =>
    set((state) => {
      if (!state.selectedId) {
        return {
          routeNotice: 'Pilih gedung dulu untuk melihat rute.',
        };
      }
      const found = CAMPUS_BUILDINGS.find((item) => item.id === state.selectedId);
      if (!found?.rute || found.rute.length < 2) {
        return {
          routeActive: false,
          routeFollowActive: false,
          routeNotice: 'Rute belum tersedia',
        };
      }
      const next = !state.routeActive;
      return {
        cameraMode: 'drone',
        routeActive: next,
        routeFollowActive: next,
        routeNotice: null,
      };
    }),

  clearRoute: () =>
    set((state) => ({
      routeActive: false,
      routeFollowActive: false,
      routeNotice: null,
      cameraTarget: getResponsiveDroneCamera(),
      cameraMoveNonce: state.cameraMoveNonce + 1,
    })),

  clearRouteNotice: () => set({ routeNotice: null }),

  stopRouteFollow: () => set({ routeFollowActive: false }),

  setLiveCameraPosition: (pos) => set({ liveCameraPosition: pos }),

  setCameraMode: (mode) =>
    set((state) => ({
      cameraMode: mode,
      routeFollowActive: false,
      ...(mode === 'drone'
        ? {
            cameraTarget: getResponsiveDroneCamera(),
            cameraMoveNonce: state.cameraMoveNonce + 1,
          }
        : {}),
    })),

  toggleInvertY: () => set((state) => ({ invertY: !state.invertY })),

  setSensitivity: (sensitivity) => set({ sensitivity }),

  togglePanel: (open) =>
    set((state) => ({
      isPanelOpen: typeof open === 'boolean' ? open : !state.isPanelOpen,
    })),

  resetCameraSettings: () =>
    set((state) => ({
      cameraMode: 'drone',
      invertY: false,
      sensitivity: 1,
      routeFollowActive: false,
      cameraTarget: getResponsiveDroneCamera(),
      cameraMoveNonce: state.cameraMoveNonce + 1,
    })),

  setAvatarTransform: (avatarPos, avatarYaw, avatarPitch, avatarAnim) =>
    set((state) => ({
      avatarPos,
      avatarYaw,
      avatarPitch: typeof avatarPitch === 'number' ? avatarPitch : state.avatarPitch,
      avatarAnim: avatarAnim ?? state.avatarAnim,
    })),

  setPointerLocked: (isPointerLocked) => set({ isPointerLocked }),

  setJoystickVector: (joystickVector) => set({ joystickVector }),

  setPlayerIdentity: (playerId, playerName) => set({ playerId, playerName }),

  setAvatarColors: (shirtColor, hairColor) => set({ shirtColor, hairColor }),

  triggerWave: (text = 'Halo!') => {
    const until = Date.now() + 2600;
    set({
      waveText: text,
      waveUntil: until,
    });
    if (typeof window !== 'undefined') {
      window.setTimeout(() => {
        set((state) => (state.waveUntil === until ? { waveText: null, waveUntil: 0 } : state));
      }, 2650);
    }
  },

  setRemotePlayers: (remotePlayers) => set({ remotePlayers }),

  setNearBuildingId: (nearBuildingId) => set({ nearBuildingId }),

  toggleCharacterModal: (open) =>
    set((state) => ({
      characterOpen: typeof open === 'boolean' ? open : !state.characterOpen,
    })),

  toggleSoundMuted: () => set((state) => ({ soundMuted: !state.soundMuted })),

  toggleCityAudioMuted: () => set((state) => ({ cityAudioMuted: !state.cityAudioMuted })),

  setConnectionStatus: (connectionStatus) => set({ connectionStatus }),

  setObserver: (isObserver) => set({ isObserver }),

  togglePlayerList: (open) =>
    set((state) => ({
      playerListOpen: typeof open === 'boolean' ? open : !state.playerListOpen,
    })),

  teleportToBuilding: (id) => {
    const found = CAMPUS_BUILDINGS.find((item) => item.id === id);
    if (!found) return;

    const safeZ = Math.min(51, Math.max(-51, found.posisi[2] + found.ukuran[2] / 2 + 2.8));
    const safeX = Math.min(96, Math.max(-96, found.posisi[0]));

    set({ teleportFade: true });
    window.setTimeout(() => {
      set((state) => ({
        selectedId: found.id,
        avatarPos: [safeX, 0, safeZ],
        avatarYaw: Math.PI, // Menghadap gedung tujuan (-Z)
        routeNotice: null,
        teleportNonce: state.teleportNonce + 1,
        cameraTarget: focusForBuilding(found),
        cameraMoveNonce: state.cameraMoveNonce + 1,
      }));
      window.setTimeout(() => {
        set({ teleportFade: false });
      }, 220);
    }, 180);
  },

  focusOnPosition: (pos) =>
    set((state) => ({
      cameraMode: 'drone',
      playerListOpen: false,
      cameraTarget: {
        position: [pos[0] + 16, 22, pos[2] + 22],
        lookAt: [pos[0], 1.2, pos[2]],
      },
      cameraMoveNonce: state.cameraMoveNonce + 1,
    })),
}));
