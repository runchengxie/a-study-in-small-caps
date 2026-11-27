/** Decorative market constellation. Positions are designed, not financial observations. */
export function initializeConstellation(): void {
 const canvas = document.querySelector<HTMLCanvasElement>('#market-constellation');
 const pause = document.querySelector<HTMLButtonElement>('#motion-toggle');
 const hero = canvas?.closest<HTMLElement>('.hero');
 if (!canvas || !pause || !hero) return;
 const motion = matchMedia('(prefers-reduced-motion: reduce)');
 if (motion.matches) { pause.hidden = true; return; }
 const gl = canvas.getContext('webgl', {alpha: true, antialias: false, powerPreference: 'low-power'});
 if (!gl) { pause.hidden = true; return; }
 const shader = (type: number, source: string): WebGLShader | null => {
  const result = gl.createShader(type); if (!result) return null;
  gl.shaderSource(result, source); gl.compileShader(result);
  if (!gl.getShaderParameter(result, gl.COMPILE_STATUS)) {gl.deleteShader(result); return null;}
  return result;
 };
 const vertex = shader(gl.VERTEX_SHADER, 'attribute vec2 p; uniform float size; void main(){gl_Position=vec4(p,0.,1.);gl_PointSize=size;}');
 const fragment = shader(gl.FRAGMENT_SHADER, 'precision mediump float; uniform vec4 color;void main(){gl_FragColor=color;}');
 const program = gl.createProgram();
 if (!vertex || !fragment || !program) {pause.hidden = true; return;}
 gl.attachShader(program, vertex); gl.attachShader(program, fragment); gl.linkProgram(program);
 if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {pause.hidden = true; return;}
 gl.useProgram(program);
 const buffer = gl.createBuffer();
 if (!buffer) return;
 gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
 const position = gl.getAttribLocation(program, 'p'); gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
 const color = gl.getUniformLocation(program, 'color'); const size = gl.getUniformLocation(program, 'size');
 gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
 let visible = true, lost = false, frame = 0, last = 0, phase = 0;
 let stopped: boolean = false;
 let pointerX = 0, pointerY = 0;
 const count = 76;
 const positions = new Float32Array(count * 2);
 const draw = (time: number) => {
  frame = 0;
  if (lost) return;
  const moving = visible && !document.hidden && !stopped && !motion.matches;
  if (moving && time - last < 33) { frame = requestAnimationFrame(draw); return; }
  if (moving) phase += Math.min(time - last, 60) * .00012;
  last = time;
  const width = Math.round(canvas.clientWidth * Math.min(devicePixelRatio, 1.5));
  const height = Math.round(canvas.clientHeight * Math.min(devicePixelRatio, 1.5));
  if(canvas.width !== width || canvas.height !== height) {canvas.width=width; canvas.height=height;}
  gl.viewport(0, 0, width, height); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
  for (let i=0;i<count;i++) {
   const angle = i * 2.39996 + phase;
   const radius = Math.sqrt((i+.5)/count);
   const x = Math.cos(angle)*radius, y = Math.sin(angle)*radius;
   const perspective = 1 + .15*Math.sin(angle+phase);
   positions[i*2] = x*.82*perspective + pointerX*.045;
   positions[i*2+1] = y*.72 + Math.sin(x*3+phase)*.1 + pointerY*.045;
  }
  const lines: number[]=[];
  for(let i=0;i<count;i++) for(let j=i+1;j<count;j++) {
   const dx=positions[i*2]-positions[j*2], dy=positions[i*2+1]-positions[j*2+1];
   if(dx*dx+dy*dy < .078) lines.push(positions[i*2],positions[i*2+1],positions[j*2],positions[j*2+1]);
  }
  const dark = document.documentElement.dataset.theme === 'dark';
  gl.uniform4f(color, dark?.72:.25, dark?.84:.42, dark?.73:.33, .24);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(lines),gl.DYNAMIC_DRAW);gl.drawArrays(gl.LINES,0,lines.length/2);
  gl.uniform4f(color,dark?.94:.65,dark?.65:.28,dark?.49:.19,.85);gl.uniform1f(size,3.5);
  gl.bufferData(gl.ARRAY_BUFFER,positions,gl.DYNAMIC_DRAW);gl.drawArrays(gl.POINTS,0,count);
  hero.classList.toggle('constellation-ready', !motion.matches);
  pause.hidden=motion.matches;
  if(moving) frame=requestAnimationFrame(draw);
 };
 const schedule=()=>{if(!frame && !lost) frame=requestAnimationFrame(draw);};
 const reflect=()=>{pause.setAttribute('aria-pressed',String(stopped));hero.classList.toggle('motion-paused',stopped || motion.matches);};
 pause.addEventListener('click',()=>{stopped=!stopped;reflect();schedule();});
 hero.addEventListener('pointermove',event=>{const rect=hero.getBoundingClientRect();pointerX=(event.clientX-rect.left)/rect.width-.5;pointerY=.5-(event.clientY-rect.top)/rect.height;});
 hero.addEventListener('pointerleave',()=>{pointerX=pointerY=0;});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();}).observe(hero);
 document.addEventListener('visibilitychange',schedule);
 window.addEventListener('resize',schedule);
 motion.addEventListener('change',()=>{stopped=motion.matches;pause.hidden=motion.matches;hero.classList.toggle('constellation-ready',!motion.matches);reflect();schedule();});
 new MutationObserver(schedule).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
 canvas.addEventListener('webglcontextlost',()=>{lost=true;cancelAnimationFrame(frame);hero.classList.remove('constellation-ready');pause.hidden=true;});
 reflect();schedule();
}
