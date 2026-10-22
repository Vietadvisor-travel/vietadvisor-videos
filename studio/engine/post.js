/* =====================================================================
   POST — one WebGL2 "film look" pass per frame (runs on GPU or SwiftShader).
   bloom (¼ res) · halation (⅛ res, warm) · grade (saturation, contrast, lift/gamma/gain, split toning)
   · paper fibre texture · subtle chromatic aberration at the edges · vignette · film grain on 2s.
   Falls back to the Canvas grade (look.js) when WebGL is unavailable. EPISODE.post = false disables it.
   ===================================================================== */
'use strict';
const POST = { on: true, ok: null, gl: null };
const GRADE_GL = { // sat, con, lift, gamma, gain, shadow tint, highlight tint, bloom, halation
  clean: { sat: 1.0, con: 1.0, lift: 0, gam: 1, gain: 1, sh: [0, 0, 0], hi: [0, 0, 0], bloom: .18, hal: .06 },
  sepia: { sat: .62, con: 1.1, lift: .03, gam: .97, gain: 1.0, sh: [.04, .01, -.04], hi: [.07, .035, -.03], bloom: .3, hal: .18 },   // period flashback
  warm: { sat: 1.08, con: 1.05, lift: .01, gam: .98, gain: 1.02, sh: [.02, -.005, -.025], hi: [.035, .015, -.02], bloom: .26, hal: .1 },
  golden: { sat: 1.12, con: 1.06, lift: .015, gam: .96, gain: 1.03, sh: [.01, -.01, .04], hi: [.06, .03, -.03], bloom: .36, hal: .16 },
  teal: { sat: 1.1, con: 1.08, lift: .005, gam: 1, gain: 1.02, sh: [-.02, .02, .04], hi: [.03, .015, -.02], bloom: .22, hal: .08 },
  night: { sat: 1.12, con: 1.1, lift: .01, gam: 1.02, gain: 1.0, sh: [-.01, .0, .05], hi: [.04, .02, -.02], bloom: .5, hal: .2 },
  punchy: { sat: 1.22, con: 1.12, lift: 0, gam: .98, gain: 1.03, sh: [0, 0, .01], hi: [.02, .01, 0], bloom: .2, hal: .06 },
};
const VS = `#version 300 es
in vec2 p; out vec2 uv; void main(){ uv = p*.5+.5; gl_Position = vec4(p,0.,1.); }`;
const FS_BRIGHT = `#version 300 es
precision highp float; in vec2 uv; uniform sampler2D t; uniform float th; out vec4 o;
void main(){ vec3 c = texture(t, uv).rgb; float l = dot(c, vec3(.299,.587,.114)); float k = smoothstep(th, th+.25, l); o = vec4(c*k, 1.); }`;
const FS_BLUR = `#version 300 es
precision highp float; in vec2 uv; uniform sampler2D t; uniform vec2 d; out vec4 o;
void main(){ vec3 s = texture(t, uv).rgb*.227; s += (texture(t, uv+d*1.38).rgb + texture(t, uv-d*1.38).rgb)*.316; s += (texture(t, uv+d*3.23).rgb + texture(t, uv-d*3.23).rgb)*.07; o = vec4(s,1.); }`;
const FS_COMP = `#version 300 es
precision mediump float; in vec2 uv; uniform sampler2D t, bl, ha, pt; uniform vec2 res, go; uniform float sat, con, lift, gam, gain, kb, kh, grain, paper, vig;
uniform vec3 sh, hi; out vec4 o;
void main(){
  vec2 c = uv - .5; float r2 = dot(c, c);
  vec3 col = texture(t, uv).rgb + texture(bl, uv).rgb * kb + texture(ha, uv).rgb * kh * vec3(1., .42, .22);
  col = pow(max(col * gain + lift, 0.), vec3(1./gam));
  col = (col - .5) * con + .5;
  float l = dot(col, vec3(.299,.587,.114)); col = mix(vec3(l), col, sat);
  col += sh * (1. - smoothstep(0., .55, l)) + hi * smoothstep(.45, 1., l);
  float pf = texture(pt, uv * res / 512.).r, gr = texture(pt, uv * res / 512. + go).g;   // static paper fibre, moving grain
  col *= 1. - paper * (pf - .5); col += (gr - .5) * grain;
  col *= 1. - vig * smoothstep(.18, .75, r2 * 1.6);
  o = vec4(clamp(col, 0., 1.), 1.);
}`;
function postInit() {
  POST.ok = false; try {
    const c = mkCanvas(W, H); const gl = c.getContext('webgl2', { premultipliedAlpha: false, preserveDrawingBuffer: true, antialias: false }); if (!gl) return false;
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
    const prog = fs => { const p = gl.createProgram(); gl.attachShader(p, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(p); if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p)); return p; };
    const P = { bright: prog(FS_BRIGHT), blur: prog(FS_BLUR), comp: prog(FS_COMP) };
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const tex = (w, h) => { const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); if (w) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null); return t; };
    const fbo = (w, h) => { const t = tex(w, h), f = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, f); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0); return { t, f, w, h }; };
    const q = [Math.ceil(W / 4), Math.ceil(H / 4)], e = [Math.ceil(W / 8), Math.ceil(H / 8)];
    const pt = tex(); { const N = 512, d = new Uint8Array(N * N * 4), r = rng(77); const nz = (x, y, f) => { const v = Math.sin(x * f * 12.9898 + y * f * 78.233) * 43758.5453; return v - Math.floor(v); };
      for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const k = (y * N + x) * 4; const fib = .5 + .35 * Math.sin(x * .05 + Math.sin(y * .013) * 3) * Math.sin(y * .21 + x * .002) * .5 + (r() - .5) * .25; d[k] = clamp(fib) * 255; d[k + 1] = r() * 255; d[k + 2] = 0; d[k + 3] = 255; }
      gl.bindTexture(gl.TEXTURE_2D, pt); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, N, N, 0, gl.RGBA, gl.UNSIGNED_BYTE, d); }
    Object.assign(POST, { pt, c, gl, P, buf, src: tex(), A: fbo(...q), B: fbo(...q), C: fbo(...e), D: fbo(...e), w: W, h: H, ok: true });
  } catch (err) { console.warn('post disabled:', err.message); POST.ok = false; }
  return POST.ok;
}
function postFrame(grade, t) {
  if (!POST.on || LINT.on || (window.EPISODE && EPISODE.post === false)) return false;
  if (POST.ok === null || (POST.ok && (POST.w !== W || POST.h !== H))) postInit(); if (!POST.ok) return false;
  const { gl, P } = POST, G = GRADE_GL[typeof grade === 'string' ? grade : 'warm'] || GRADE_GL.warm;
  const run = (prog, target, w, h, set) => { gl.useProgram(prog); gl.bindFramebuffer(gl.FRAMEBUFFER, target); gl.viewport(0, 0, w, h); const loc = gl.getAttribLocation(prog, 'p'); gl.bindBuffer(gl.ARRAY_BUFFER, POST.buf); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0); set(n => gl.getUniformLocation(prog, n)); gl.drawArrays(gl.TRIANGLES, 0, 3); };
  const bind = (unit, t) => { gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t); };
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); bind(0, POST.src); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, ctx.canvas);
  const { A, B, C, D } = POST;
  run(P.bright, A.f, A.w, A.h, u => { bind(0, POST.src); gl.uniform1i(u('t'), 0); gl.uniform1f(u('th'), .62); });
  for (let i = 0; i < 2; i++) { run(P.blur, B.f, B.w, B.h, u => { bind(0, A.t); gl.uniform1i(u('t'), 0); gl.uniform2f(u('d'), (1 + i) / A.w, 0); }); run(P.blur, A.f, A.w, A.h, u => { bind(0, B.t); gl.uniform1i(u('t'), 0); gl.uniform2f(u('d'), 0, (1 + i) / A.h); }); }
  run(P.blur, C.f, C.w, C.h, u => { bind(0, A.t); gl.uniform1i(u('t'), 0); gl.uniform2f(u('d'), 2 / C.w, 0); });
  run(P.blur, D.f, D.w, D.h, u => { bind(0, C.t); gl.uniform1i(u('t'), 0); gl.uniform2f(u('d'), 0, 2 / C.h); });
  run(P.blur, C.f, C.w, C.h, u => { bind(0, D.t); gl.uniform1i(u('t'), 0); gl.uniform2f(u('d'), 3 / C.w, 3 / C.h); });
  const gf = Math.floor(t * 15); run(P.comp, null, W, H, u => { bind(0, POST.src); bind(1, A.t); bind(2, C.t); bind(3, POST.pt); gl.uniform1i(u('t'), 0); gl.uniform1i(u('bl'), 1); gl.uniform1i(u('ha'), 2); gl.uniform1i(u('pt'), 3);
    gl.uniform2f(u('res'), W, H); gl.uniform2f(u('go'), (gf * .37) % 1, (gf * .61) % 1); gl.uniform1f(u('sat'), G.sat); gl.uniform1f(u('con'), G.con); gl.uniform1f(u('lift'), G.lift); gl.uniform1f(u('gam'), G.gam); gl.uniform1f(u('gain'), G.gain);
    gl.uniform1f(u('kb'), G.bloom); gl.uniform1f(u('kh'), G.hal); gl.uniform1f(u('grain'), .014); gl.uniform1f(u('paper'), .05); gl.uniform1f(u('vig'), .32); gl.uniform3fv(u('sh'), G.sh); gl.uniform3fv(u('hi'), G.hi); });
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'copy'; ctx.drawImage(POST.c, 0, 0); ctx.restore(); return true;
}
