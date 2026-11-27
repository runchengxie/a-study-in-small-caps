/** Decorative, designed terrain — not financial observations. No per-frame allocations. */
export function initializeTerrain(): void {
 const canvas = document.querySelector<HTMLCanvasElement>('#particle-terrain');
 const pause = document.querySelector<HTMLButtonElement>('#motion-toggle');
 const hero = canvas?.closest<HTMLElement>('.hero');
 if (!canvas || !pause || !hero) return;
 const motion = matchMedia('(prefers-reduced-motion: reduce)');
 const gl = canvas.getContext('webgl', {alpha: true, antialias: false, powerPreference: 'low-power'});
 if (!gl) return;
 const shader = (type: number, source: string): WebGLShader | null => {
  const result = gl.createShader(type);
  if (!result) return null;
  gl.shaderSource(result, source); gl.compileShader(result);
  if (!gl.getShaderParameter(result, gl.COMPILE_STATUS)) {gl.deleteShader(result); return null;}
  return result;
 };
 const vertex = shader(gl.VERTEX_SHADER, `
 attribute vec2 position;
 uniform float phase;
 uniform float pixelRatio;
 varying float depth;
 varying float crest;
 void main() {
  float x = position.x;
  float z = position.y;
  float height = sin(x * .38 + z * .18 + phase) * .9 + cos(x * .22 - z * .32 + phase * .7) * .65;
  depth = 4.5 / (z + 6.);
  crest = (height + 1.55) / 3.1;
  gl_Position = vec4(x * depth * .2, -.1 + (height - 1.8) * depth, 0., 1.);
  gl_PointSize = (1.1 + depth * 3.6) * pixelRatio;
 }`);
 const fragment = shader(gl.FRAGMENT_SHADER, `
 precision mediump float;
 uniform float dark;
 varying float depth;
 varying float crest;
 void main() {
  float distance = length(gl_PointCoord - vec2(.5));
  float alpha = (1. - smoothstep(.25, .5, distance)) * (.2 + depth * .8);
  vec3 night = mix(vec3(.14,.43,.33), vec3(.78,.91,.38), crest);
  vec3 day = mix(vec3(.08,.26,.19), vec3(.28,.36,.09), crest);
  gl_FragColor = vec4(mix(day, night, dark), alpha * mix(1.5, 1., dark));
 }`);
 const program = gl.createProgram();
 if (!vertex || !fragment || !program) {if(vertex)gl.deleteShader(vertex);if(fragment)gl.deleteShader(fragment);if(program)gl.deleteProgram(program);return;}
 gl.attachShader(program, vertex); gl.attachShader(program, fragment); gl.linkProgram(program);
 gl.deleteShader(vertex); gl.deleteShader(fragment);
 if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {gl.deleteProgram(program);return;}
 const buffer = gl.createBuffer();
 if (!buffer) {gl.deleteProgram(program);return;}
 gl.useProgram(program); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
 const columns = 108, rows = 46;
 const positions = new Float32Array(columns * rows * 2);
 for(let i = 0; i < columns * rows; i++) {
  positions[i * 2] = (i % columns / (columns - 1) - .5) * 30;
  positions[i * 2 + 1] = Math.floor(i / columns) / (rows - 1) * 27;
 }
 gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
 const position = gl.getAttribLocation(program, 'position');
 gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
 const phaseUniform = gl.getUniformLocation(program, 'phase');
 const darkUniform = gl.getUniformLocation(program, 'dark');
 const ratioUniform = gl.getUniformLocation(program, 'pixelRatio');
 gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
 let visible = true, lost = false, stopped = false, frame = 0, last = 0, phase = 0;
 const reflect = () => {
  pause.hidden = lost || motion.matches;
  pause.setAttribute('aria-pressed', String(stopped));
  hero.classList.toggle('motion-paused', stopped);
  hero.classList.toggle('terrain-ready', !lost && !motion.matches);
 };
 const draw = (time: number) => {
  frame = 0;
  reflect();
  if(lost || motion.matches || !visible || document.hidden) return;
  if(!stopped && time - last < 1000 / 30) {if(!stopped)frame=requestAnimationFrame(draw);return;}
  if(!stopped)phase += Math.min(time - last, 60) * .00016;
  last = time;
  const ratio = Math.min(devicePixelRatio, 1.5);
  const width = Math.round(canvas.clientWidth * ratio), height = Math.round(canvas.clientHeight * ratio);
  if(canvas.width !== width || canvas.height !== height) {canvas.width=width;canvas.height=height;}
  gl.viewport(0,0,width,height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
  gl.uniform1f(phaseUniform,phase);gl.uniform1f(ratioUniform,ratio);
  gl.uniform1f(darkUniform,document.documentElement.dataset.theme === 'dark' ? 1 : 0);
  gl.drawArrays(gl.POINTS,0,columns * rows);
  reflect();
  if(!stopped)frame=requestAnimationFrame(draw);
 };
 const schedule = () => {if(!frame && !lost && !motion.matches)frame=requestAnimationFrame(draw);};
 pause.addEventListener('click',()=>{stopped=!stopped;reflect();schedule();});
 const observer = new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();});observer.observe(hero);
 document.addEventListener('visibilitychange',schedule);
 window.addEventListener('resize',schedule);
 motion.addEventListener('change',()=>{reflect();schedule();});
 new MutationObserver(schedule).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
 // A lost context stays on the static surface; recovery never forces motion back on.
 canvas.addEventListener('webglcontextlost',()=>{lost=true;cancelAnimationFrame(frame);reflect();});
 reflect();schedule();
}
