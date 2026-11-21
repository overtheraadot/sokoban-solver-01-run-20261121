import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
const I = process.env.MAKEFUN_INPUT_DIR ?? '/input', O = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const D = [[0, -1], [0, 1], [-1, 0], [1, 0]], L = 'udlrUDLR', X = 400000;
const F = (w, a, o, s, S, t) => {
  const q = [s]; let l = s; S[s] = t;
  for (let i = 0; i < q.length; i++) {
    const p = q[i]; if (p < l) l = p;
    for (let k = 0; k < 4; k++) {
      const n = p + D[k][1] * w + D[k][0];
      if (!a[n] && !o[n] && S[n] !== t) { S[n] = t; q.push(n); }
    }
  }
  return l;
};
const P = t => {
  const r = t.split('\n').filter(x => x.length), h = r.length, w = Math.max(...r.map(x => x.length));
  const a = new Uint8Array(w * h).fill(1), G = [], B = [];
  let p = -1;
  r.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const c = row[x], i = y * w + x;
      if (c === '#') continue;
      a[i] = 0;
      if ('.*+'.includes(c)) G.push(i);
      if ('$*'.includes(c)) B.push(i);
      if ('@+'.includes(c)) p = i;
    }
  });
  return [w, a, G, B.sort((m, n) => m - n), p];
};
const V = (w, a, G) => {
  const v = new Uint8Array(a.length), q = [...G];
  for (const g of G) v[g] = 1;
  for (let i = 0; i < q.length; i++) {
    const x = q[i];
    for (let k = 0; k < 4; k++) {
      const d = D[k][1] * w + D[k][0], y = x - d;
      if (!a[y] && !a[y - d] && !v[y]) { v[y] = 1; q.push(y); }
    }
  }
  return v;
};
const W = (w, a, o, f, t) => {
  if (f === t) return '';
  const v = new Int32Array(a.length).fill(-1), h = [], q = [f];
  v[f] = f;
  for (let i = 0; i < q.length; i++) {
    const p = q[i]; if (p === t) break;
    for (let k = 0; k < 4; k++) {
      const n = p + D[k][1] * w + D[k][0];
      if (a[n] || o[n] || v[n] >= 0) continue;
      v[n] = p; h[n] = L[k]; q.push(n);
    }
  }
  if (v[t] < 0) return '';
  let s = '';
  for (let p = t; p !== f; p = v[p]) s = h[p] + s;
  return s;
};
const R = (w, a, G, B, p) => {
  const n = B.length, z = a.length, g = new Uint8Array(z);
  for (const x of G) g[x] = 1;
  const v = V(w, a, G);
  if (B.some(b => !v[b])) return null;
  const d = G.map(s => {
    const e = new Int32Array(z).fill(-1), q = [s];
    e[s] = 0;
    for (let i = 0; i < q.length; i++) {
      const y = q[i];
      for (let k = 0; k < 4; k++) {
        const m = y + D[k][1] * w + D[k][0];
        if (!a[m] && e[m] < 0) { e[m] = e[y] + 1; q.push(m); }
      }
    }
    return e;
  });
  const H = B => {
    let s = 0;
    for (const b of B) {
      let m = 1e9;
      for (let j = 0; j < n; j++) { const c = d[j][b]; if (c >= 0 && c < m) m = c; }
      if (m === 1e9) return 1e9;
      s += m;
    }
    return s;
  };
  const o = new Uint8Array(z), S = new Int32Array(z), M = new Int32Array(z);
  let st = 0;
  const K = (B, l) => { let k = l; for (const b of B) k = k * z + b; return k; };
  const Z = t => {
    for (const x of [t, t - 1, t - w, t - w - 1]) {
      const b = x + 1, c = x + w, e = c + 1;
      if (!(a[x] || o[x]) || !(a[b] || o[b]) || !(a[c] || o[c]) || !(a[e] || o[e])) continue;
      if ((o[x] && !g[x]) || (o[b] && !g[b]) || (o[c] && !g[c]) || (o[e] && !g[e])) return 1;
    }
    return 0;
  };
  const SB = [B.slice()], SP = [p], PA = [-1], PD = [-1], SG = [0], BK = [];
  const best = new Map();
  for (const b of B) o[b] = 1;
  best.set(K(B, F(w, a, o, p, S, ++st)), 0);
  for (const b of B) o[b] = 0;
  (BK[H(B)] ||= []).push(0);
  let e = 0, f = -1, mf = 0;
  while (f < 0) {
    while (mf < BK.length && !(BK[mf] && BK[mf].length)) mf++;
    if (mf >= BK.length) return null;
    const s = BK[mf].pop(), q = SG[s];
    if (e++ >= X) return null;
    const C = SB[s];
    for (const b of C) o[b] = 1;
    const h = ++st;
    F(w, a, o, SP[s], S, h);
    for (let i = 0; i < n && f < 0; i++) {
      const b = C[i];
      for (let k = 0; k < 4; k++) {
        const j = D[k][1] * w + D[k][0], t = b + j;
        if (S[b - j] !== h || a[t] || o[t] || !v[t]) continue;
        o[b] = 0; o[t] = 1;
        const fr = Z(t);
        let N = null, y = -1;
        if (!fr) { N = C.slice(); N[i] = t; N.sort((m, x) => m - x); y = K(N, F(w, a, o, b, M, ++st)); }
        o[t] = 0; o[b] = 1;
        if (fr || N === null) continue;
        const pv = best.get(y);
        if (pv !== undefined && pv <= q + 1) continue;
        best.set(y, q + 1);
        const id = SB.length;
        SB.push(N); SP.push(b); PA.push(s); PD.push(k); SG.push(q + 1);
        if (N.every(x => g[x])) { f = id; break; }
        const hh = H(N);
        if (hh < 1e9) (BK[q + 1 + hh] ||= []).push(id);
      }
    }
    for (const b of C) o[b] = 0;
  }
  const A = [];
  for (let s = f; s > 0; s = PA[s]) A.push(s);
  A.reverse();
  let m = '', q = p, C = B.slice();
  for (const s of A) {
    const N = SB[s], from = SP[s], k = PD[s], j = D[k][1] * w + D[k][0];
    for (const b of C) o[b] = 1;
    m += W(w, a, o, q, from - j);
    for (const b of C) o[b] = 0;
    m += L[k + 4];
    q = from; C = N;
  }
  return [m, q];
};
const S = (w, a, G, B, p) => {
  const v = V(w, a, G), r = Math.floor(p / w), c = new Uint8Array(a.length);
  for (let i = r * w; i < (r + 1) * w; i++) if (!a[i] && !v[i]) c[i] = 1;
  if (B.some(b => c[b])) return null;
  const t = new Int32Array(a.length).fill(-1), Q = [];
  for (let s = 0; s < a.length; s++) {
    if (a[s] || c[s] || t[s] >= 0) continue;
    const q = [s]; t[s] = Q.length;
    for (let i = 0; i < q.length; i++) {
      const y = q[i];
      for (let k = 0; k < 4; k++) {
        const n = y + D[k][1] * w + D[k][0];
        if (!a[n] && !c[n] && t[n] < 0) { t[n] = Q.length; q.push(n); }
      }
    }
    Q.push({ b: [], g: [] });
  }
  for (const b of B) Q[t[b]].b.push(b);
  for (const g of G) if (t[g] >= 0) Q[t[g]].g.push(g);
  if (G.some(g => t[g] < 0) || Q.some(x => x.b.length !== x.g.length)) return null;
  return Q.filter(x => x.b.length);
};
const solve = t => {
  const [w, a, G, B, p] = P(t);
  if (p < 0 || B.every(b => G.includes(b))) return '';
  const Q = S(w, a, G, B, p);
  if (Q === null) { const r = R(w, a, G, B, p); return r ? r[0] : ''; }
  let m = '', q = p;
  const d = new Set();
  for (let i = 0; i < Q.length; i++) {
    const x = Q[i], wa = a.slice();
    if (x.b.every(b => x.g.includes(b))) continue;
    Q.forEach((o, j) => { if (j !== i) for (const b of d.has(j) ? o.g : o.b) wa[b] = 1; });
    const r = R(w, wa, x.g, x.b, q);
    if (r === null) return '';
    m += r[0]; q = r[1]; d.add(i);
  }
  return m;
};
for (const id of readdirSync(I).sort()) {
  const m = solve(readFileSync(join(I, id, 'level.txt'), 'utf8'));
  mkdirSync(join(O, id), { recursive: true });
  writeFileSync(join(O, id, 'solution.txt'), m + '\n');
}
