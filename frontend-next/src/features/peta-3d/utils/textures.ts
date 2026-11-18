'use client';

import * as THREE from 'three';

interface TileTextureSet {
  map: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
}

const tileCache = new Map<string, TileTextureSet>();
let cachedPaving: THREE.CanvasTexture | null = null;
let cachedGrass: THREE.CanvasTexture | null = null;

function makeCanvas(size = 512): [HTMLCanvasElement, CanvasRenderingContext2D] | null {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  return [canvas, ctx];
}

/**
 * Membuat tekstur genteng bergelombang beserta bumpMap prosedural (maks 512x512).
 */
export function getTileRoofTextures(
  palette: [string, string, string] = ['#c2410c', '#ea580c', '#f97316'],
): TileTextureSet | null {
  const key = palette.join('|');
  const existing = tileCache.get(key);
  if (existing) return existing;

  const colorPair = makeCanvas(512);
  const bumpPair = makeCanvas(512);
  if (!colorPair || !bumpPair) return null;

  const [cCanvas, cCtx] = colorPair;
  const [bCanvas, bCtx] = bumpPair;

  const rows = 16;
  const cols = 16;
  const rowH = 512 / rows;
  const colW = 512 / cols;

  cCtx.fillStyle = palette[0];
  cCtx.fillRect(0, 0, 512, 512);
  bCtx.fillStyle = '#404040';
  bCtx.fillRect(0, 0, 512, 512);

  for (let r = 0; r < rows; r++) {
    const y = r * rowH;
    const baseColor = palette[r % palette.length];
    const offset = (r % 2) * (colW * 0.5);

    for (let c = -1; c <= cols; c++) {
      const x = c * colW + offset;

      // Warna genteng
      cCtx.fillStyle = baseColor;
      cCtx.beginPath();
      cCtx.roundRect(x + 1, y + 1, colW - 2, rowH - 2, [0, 0, 8, 8]);
      cCtx.fill();

      // Garis bayangan tipis antar baris genteng
      cCtx.fillStyle = 'rgba(15, 23, 42, 0.22)';
      cCtx.fillRect(x, y + rowH - 3, colW, 3);

      // Bump map timbul untuk tiap keping genteng
      const grad = bCtx.createLinearGradient(x, y, x, y + rowH);
      grad.addColorStop(0, '#a0a0a0');
      grad.addColorStop(0.75, '#f0f0f0');
      grad.addColorStop(1, '#303030');
      bCtx.fillStyle = grad;
      bCtx.fillRect(x + 1, y + 1, colW - 2, rowH - 2);
    }
  }

  const map = new THREE.CanvasTexture(cCanvas);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(3, 2);
  map.colorSpace = THREE.SRGBColorSpace;

  const bumpMap = new THREE.CanvasTexture(bCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(3, 2);

  const result = { map, bumpMap };
  tileCache.set(key, result);
  return result;
}

/**
 * Tekstur paving krem/bata halus untuk halaman depan Gedung Utama (512x512).
 */
export function getPavingTexture(): THREE.CanvasTexture | null {
  if (cachedPaving) return cachedPaving;
  const pair = makeCanvas(512);
  if (!pair) return null;
  const [canvas, ctx] = pair;

  ctx.fillStyle = '#ede4d3';
  ctx.fillRect(0, 0, 512, 512);

  const step = 32;
  for (let y = 0; y < 512; y += step) {
    const shift = ((y / step) % 2) * (step / 2);
    for (let x = -step; x < 512 + step; x += step) {
      ctx.fillStyle = (x + y) % 64 === 0 ? '#e4d8c3' : '#f2eadc';
      ctx.fillRect(x + shift + 1, y + 1, step - 2, step - 2);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 4);
  tex.colorSpace = THREE.SRGBColorSpace;
  cachedPaving = tex;
  return tex;
}

/**
 * Tekstur rumput hijau cerah dengan variasi beberapa nuansa hijau (512x512).
 */
export function getGrassTexture(): THREE.CanvasTexture | null {
  if (cachedGrass) return cachedGrass;
  const pair = makeCanvas(512);
  if (!pair) return null;
  const [canvas, ctx] = pair;

  const greens = ['#65a30d', '#84cc16', '#4d7c0f'];
  ctx.fillStyle = greens[1];
  ctx.fillRect(0, 0, 512, 512);

  const cell = 32;
  for (let y = 0; y < 512; y += cell) {
    for (let x = 0; x < 512; x += cell) {
      const idx = ((x * 7 + y * 13) / cell) % 3;
      ctx.fillStyle = greens[Math.abs(Math.floor(idx)) % 3];
      ctx.globalAlpha = 0.25;
      ctx.fillRect(x, y, cell, cell);
    }
  }
  ctx.globalAlpha = 1;

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(12, 8);
  tex.colorSpace = THREE.SRGBColorSpace;
  cachedGrass = tex;
  return tex;
}
