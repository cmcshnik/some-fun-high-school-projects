let gl = null
const COORDS = 0;
onload = () => {
  const canvas = document.getElementById('canvas1');

 
  canvas.width = 500;
  canvas.height = 500;
  
  gl = canvas.getContext('webgl2');
  gl.enable(gl.BLEND);
  gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ZERO, gl.ONE);
  makeSquare()
  gl.enableVertexAttribArray(COORDS);
  const program = buildProgram(VS, FS, {
    coords: COORDS
                       })
 
  
  const uniforms = {};
  for (const name of ['unif1', 'time']) {
      uniforms[name] = gl.getUniformLocation(program, name);
  }
  
  const drawFrame = time => {
    //////////////////////////
 
    
    gl.uniform1f(uniforms.time, time/1000);
    
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
 
    gl.drawArrays(gl.TRIANGLES, 0, 6)
 
    //////////////////////
    
 
    requestAnimationFrame(drawFrame);
  };
  gl.useProgram(program)
  
  requestAnimationFrame(drawFrame);
  drawFrame()
 
  
}
 
// function makeTri(){
//   const coords = new Float32Array([
//     -1, -1,
//     -1, 1,
//     1, -1,
//     -1, 1,
//     1, 1,
//     1, -1
//   ]);
 
//   gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
//   gl.bufferData(gl.ARRAY_BUFFER, coords, gl.STATIC_DRAW);
//   gl.vertexAttribPointer(COORDS, 2, gl.FLOAT, false, 8, 0);
// }
 
 
function makeSquare() {
  let coords = []
 
  for (let i = 0; i < 60; i++) {
    coords.push(Math.cos(i * (2 * Math.PI / 60)), Math.sin(i * (2 * Math.PI / 60)))
    coords.push(Math.cos((i+2) * (2 * Math.PI / 60)), Math.sin((i + 2) * (2 * Math.PI / 60)))
    coords.push(0, 0)
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coords), gl.STATIC_DRAW);
  gl.vertexAttribPointer(COORDS, 2, gl.FLOAT, false, 8, 0);
}
 
function compileShader(source, type) {
    let glType = type;
 
    if (type === 'vertex') { glType = gl.VERTEX_SHADER; }
    else if (type === 'fragment') { glType = gl.FRAGMENT_SHADER; }
 
    const shader = gl.createShader(glType);
 
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
 
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { 
        console.error(`SHADER TYPE ${type}`);
        console.error(gl.getShaderInfoLog(shader));
 
        return null;
    }
 
    return shader;
}
 
function buildProgram(vsSource, fsSource, attributes) {
    const vs = compileShader(vsSource, 'vertex');
    if (vs === null) { return null; }
 
    const fs = compileShader(fsSource, 'fragment');
    if (fs === null) { return null; }
 
    const program = gl.createProgram();
 
    for (const name in attributes) {
        const index = attributes[name];
 
        gl.bindAttribLocation(program, index, name);
    }
    
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
 
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { 
        console.error(gl.getProgramInfoLog(program));
 
        return null;
    }
 
    return program;
}
 
const VS = ` #version 300 es
 
in vec2 coords;
out vec2 vPos;
uniform vec2 unif1;
 
void main(){
  vPos = coords;
  gl_Position = vec4(coords, 0, 3);
}
`;
 
const FS = `#version 300 es
precision highp float;
out vec4 color;
in vec2 vPos;
 
uniform float time;
 
float func(vec2 v){
  float len = length(v);
  if (len < 0.0) { len = len * -1.0; }
  if (len <= 1.){
    return (1. - len*len)*(1. - len*len);
  }
  else{
    return 0.0;
  }
}
 
void main(){
  float s = cos(7.0*time)/3.0;
  float t = cos(7.0*time)/0.8;
 
  vec2 p1 = vec2(-0.6, 0);
  vec2 p2 = vec2(0.6, 0);
  vec2 p3 = vec2(0, 0.1-0.4*t);
  vec2 p4 = vec2(0, -0.1+0.01*t);
 
  float value = 1.6*func(vPos-p1) + 1.6*func(vPos-p2) + 1.9*func(vPos-p3) + 1.*func(vPos-p4);
  value = 2.*(value - 1.5);
 
  while (value > 1. + s) { value -= 1. + s; }
  
  color = vec4(value - .1, value - .5, 0.0, 9);
}
`;










// const FS = `#version 300 es
// precision highp float;
// out vec4 color;
// in vec2 vPos;
 
// uniform float time;
 
// float func(vec2 v){
//   float len = length(v);
//   if (len < 0.0) { len = len * -1.0; }
//   if (len <= 1.){
//     return (1. - len*len)*(1. - len*len);
//   }
//   else{
//     return 0.0;
//   }
// }
 
// void main(){
//   float s = cos(7.0*time)/3.0;
//   float t = cos(7.0*time)/0.8;
 
//   vec2 p1 = vec2(-0.6, 0);
//   vec2 p2 = vec2(0.6, 0);
//   vec2 p3 = vec2(0, 0.1-0.4*t);
//   vec2 p4 = vec2(0, -0.1+0.01*t);
 
//   float value = 1.6*func(vPos-p1) + 1.6*func(vPos-p2) + 1.9*func(vPos-p3) + 1.*func(vPos-p4);
//   value = 2.*(value - 1.5);
 
//   while (value > 1. + s) { value -= 1. + s; }
  
//   color = vec4(value, value, 0.0, 9);
// }
// `;