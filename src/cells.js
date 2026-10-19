/**
 * Acid Shellscape — as cinco receitas de célula para canvas 2D.
 * por Kevin · GitHub @k3v1nn
 *
 * Uso:
 *   import { block, halftone, dots, glyph, blob, mix, hash, RAMP } from './cells.js';
 *   const ctx = canvas.getContext('2d');
 *   block(ctx, 0, 0, 16, '#1f74c4');
 *
 * Cores: passe hex (#rrggbb). Os valores oficiais estão em ../tokens/acid-shellscape.css.
 * Para glifos, defina antes a fonte: ctx.font = `${s * .95}px "JetBrains Mono", monospace`
 * e ctx.textBaseline = 'top'.
 */

/** Aleatório estável: mesmo (a, b, seed) devolve sempre o mesmo número em [0, 1). */
export const hash = (a, b, s = 0) => {
  let h = (a * 374761393 + b * 668265263 + s * 2246822519) | 0;
  h = (h ^ (h >>> 13)) * 1274126177 | 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
};

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));

/** Mistura duas cores hex; devolve `rgb(r,g,b)`. Não encadeie (a saída não é hex). */
export const mix = (a, b, t) => {
  const A = hx(a), B = hx(b);
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',')})`;
};

/** Rampa de glifos, do vazio ao denso. Escolha por luminosidade: RAMP[floor(l * (RAMP.length - 1))]. */
export const RAMP = ' .:-=+*#%@$';

/** 1. Bloco: massa de cor chapada. */
export const block = (ctx, x, y, s, col) => {
  ctx.fillStyle = col;
  ctx.fillRect(x, y, s, s);
};

/** 2. Meio-tom: hachura diagonal cruzada; `l` (0–1) controla alfa e densidade. */
export function halftone(ctx, x, y, s, bg, fg, l) {
  if (bg) { ctx.fillStyle = bg; ctx.fillRect(x, y, s, s); }
  ctx.save();
  ctx.beginPath(); ctx.rect(x, y, s, s); ctx.clip();
  ctx.strokeStyle = fg; ctx.globalAlpha = .3 + .7 * l; ctx.lineWidth = 1;
  const st = Math.max(2, Math.round(5 - l * 3));
  ctx.beginPath();
  for (let k = -s; k < s * 2; k += st) {
    ctx.moveTo(x + k, y); ctx.lineTo(x + k + s, y + s);
    ctx.moveTo(x + k, y + s); ctx.lineTo(x + k + s, y);
  }
  ctx.stroke();
  ctx.restore();
}

/** 3. Pontos: matriz de quadradinhos a 4px; `l` controla o tamanho. Sem `bg`, pinta por cima do que já existe. */
export function dots(ctx, x, y, s, bg, fg, l) {
  if (bg) { ctx.fillStyle = bg; ctx.fillRect(x, y, s, s); }
  const g = 4, n = Math.floor(s / g), d = Math.max(1, Math.round(l * 3.2));
  ctx.fillStyle = fg;
  for (let a = 0; a < n; a++) for (let b = 0; b < n; b++) ctx.fillRect(x + a * g + 1, y + b * g + 1, d, d);
}

/** 4. Caractere: um glifo de terminal. */
export function glyph(ctx, x, y, s, ch, fg, bg) {
  if (bg) { ctx.fillStyle = bg; ctx.fillRect(x, y, s, s); }
  ctx.fillStyle = fg;
  ctx.fillText(ch, x + s * .12, y);
}

/** 5. Blob: círculos de raio .62 se fundem com os vizinhos; use .45 na borda de um disco. */
export const blob = (ctx, x, y, s, col, k = .62) => {
  ctx.fillStyle = col;
  ctx.beginPath(); ctx.arc(x + s / 2, y + s / 2, s * k, 0, Math.PI * 2); ctx.fill();
};
