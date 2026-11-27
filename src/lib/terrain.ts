/** Decorative, designed terrain — not financial observations. Static particle buffers; surface deformation runs on the GPU. */
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
 uniform vec2 pointer;
 uniform float pointerStrength;
 uniform float travel;
 varying float depth;
 varying float crest;
 void main() {
  float x = position.x;
  float z = position.y;
  float river = sin(z * .16 + phase * .22) * 3.4;
  float bank = x - river;
  float height = 2.6 * (1. - exp(-bank * bank * .075))
    + (sin(x * .43 + z * .23 + phase) * .6
    + sin(z * .32 - x * .15 + phase * .6) * .45) * (1. - travel * .25);
  depth = 5. / (z + 5. - travel * 1.4);
  crest = smoothstep(.6, 3.2, height);
  vec2 projected = vec2(x * depth * .19, .72 + (height - 4.1) * depth);
  vec2 delta = projected - pointer;
  float radius = length(delta);
  float ripple = sin(radius * 24. - phase * 9.) * exp(-radius * radius * 7.) * pointerStrength;
  projected.y += ripple * .10;
  projected.x += delta.x * ripple * .035;
  gl_Position = vec4(projected, 0., 1.);
  gl_PointSize = (1.2 + depth * 3.) * pixelRatio;
 }`);
 const fragment = shader(gl.FRAGMENT_SHADER, `
 precision mediump float;
 uniform float dark;
 varying float depth;
 varying float crest;
 void main() {
  float distance = length(gl_PointCoord - vec2(.5));
  float alpha = (1. - smoothstep(.16, .5, distance)) * (.42 + depth * .58);
  vec3 night = mix(vec3(.04,.34,.21), vec3(.87,1.,.32), crest);
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
 // Keep a fixed, bounded buffer; narrow screens use fewer particles.
 const columns = innerWidth < 700 ? 144 : 192, rows = innerWidth < 700 ? 80 : 104;
 const positions = new Float32Array(columns * rows * 2);
 for(let i = 0; i < columns * rows; i++) {
  positions[i * 2] = (i % columns / (columns - 1) - .5) * 36;
  positions[i * 2 + 1] = Math.floor(i / columns) / (rows - 1) * 34;
 }
 gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
 const position = gl.getAttribLocation(program, 'position');
 gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
 const phaseUniform = gl.getUniformLocation(program, 'phase');
 const darkUniform = gl.getUniformLocation(program, 'dark');
 const pointerUniform = gl.getUniformLocation(program, 'pointer');
 const strengthUniform = gl.getUniformLocation(program, 'pointerStrength');
 const travelUniform = gl.getUniformLocation(program, 'travel');
 const ratioUniform = gl.getUniformLocation(program, 'pixelRatio');
 gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
 let visible = true, lost = false, stopped = false, frame = 0, last = 0, phase = 0;
 let pointerX = 0, pointerY = 0, targetX = 0, targetY = 0, strength = 0, targetStrength = 0, travel = 0, targetTravel = 0;
 const scrollProgress = () => Math.max(0, Math.min(1, -hero.getBoundingClientRect().top / hero.clientHeight));
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
  if(!stopped) {
   phase += Math.min(time - last, 60) * .00010;
   pointerX += (targetX - pointerX) * .12;
   pointerY += (targetY - pointerY) * .12;
   strength += (targetStrength - strength) * .09;
   travel += (targetTravel - travel) * .12;
   hero.style.setProperty('--cover-travel', String(travel));
  }
  last = time;
  const ratio = Math.min(devicePixelRatio, 1.5);
  const width = Math.round(canvas.clientWidth * ratio), height = Math.round(canvas.clientHeight * ratio);
  if(canvas.width !== width || canvas.height !== height) {canvas.width=width;canvas.height=height;}
  gl.viewport(0,0,width,height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
  gl.uniform2f(pointerUniform,pointerX,pointerY);
  gl.uniform1f(strengthUniform,strength);gl.uniform1f(travelUniform,travel);
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
 const updateTravel = () => {targetTravel=scrollProgress();schedule();};
 window.addEventListener('resize',updateTravel);
 window.addEventListener('scroll',updateTravel,{passive:true});
 updateTravel();
 hero.addEventListener('pointermove',event=>{
  if(event.pointerType==='touch')return;
  const bounds=canvas.getBoundingClientRect();
  targetX=(event.clientX-bounds.left)/bounds.width*2-1;
  targetY=1-(event.clientY-bounds.top)/bounds.height*2;
  targetStrength=1;
 });
 hero.addEventListener('pointerleave',()=>{targetStrength=0;});
 motion.addEventListener('change',()=>{if(motion.matches)hero.style.setProperty('--cover-travel','0');reflect();schedule();});
 new MutationObserver(schedule).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
 // A lost context stays on the static surface; recovery never forces motion back on.
 canvas.addEventListener('webglcontextlost',()=>{lost=true;cancelAnimationFrame(frame);reflect();});
 reflect();schedule();
}
