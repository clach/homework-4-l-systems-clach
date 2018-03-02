import { vec3, quat } from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';
import Drawable from './rendering/gl/Drawable';
import Icosphere from './geometry/Icosphere';
import Square from './geometry/Square';
import Cube from './geometry/Cube';
import CactusPaddle from './geometry/CactusPaddle';
import Flower from './geometry/Flower';
import Cylinder from './geometry/Cylinder';
import LSystemMesh from './geometry/LSystemMesh';
import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import { setGL } from './globals';
import ShaderProgram, { Shader } from './rendering/gl/ShaderProgram';
import OBJLoader from './OBJLoader';
import LSystem from './LSystem';
import Turtle from './Turtle';

// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
  'Update': update, // A function pointer, essentially
  'Iterations': 1,
  'Rotation': 1,
  'Scale': 1,
  'Flower Color': [0.75 * 255, 0.5 * 255, 0.74 * 255]
};

let cactusPaddle: CactusPaddle; 
let flower: Flower;
let base: Cylinder;
let cactusMesh: LSystemMesh;

function loadScene() {
  cactusPaddle = new CactusPaddle();
  flower = new Flower();
  base = new Cylinder();
  cactusMesh = new LSystemMesh();
}

function update() {
  cactusMesh.destroy();
  cactusMesh.clear();

  let startChar: string = '0';
  let cactusLSystem: LSystem = new LSystem(startChar, cactusMesh);

  // expand starting character
  for (var i = 0; i < controls.Iterations; i++) {
    cactusLSystem.expandString();
    //console.log("iteration " + i + " = " + cactusLSystem.getString());
  }

  let turtle: Turtle = new Turtle(controls.Scale, controls.Rotation, cactusMesh, vec3.fromValues(0, 0, 0), quat.create(), 0, 1);
  
  // add rules for what draw functions to call
  cactusLSystem.addRules(cactusPaddle, flower, cactusMesh, turtle);

  // determines what draw functions to call, fills VBOS of cactusMesh
  cactusLSystem.drawLSystem();

  cactusMesh.create();
}

function main() {
  // Initial display for framerate
  const stats = Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);

  // Add controls to the gui
  const gui = new DAT.GUI();
  gui.add(controls, 'Update');
  gui.add(controls, 'Iterations', 0, 5).step(1);
  gui.add(controls, 'Rotation', 0, 3);
  gui.add(controls, 'Scale', 0, 2);
  var colorPicker = gui.addColor(controls, 'Flower Color');

  colorPicker.onChange(function(value : Float32Array) {
    flower.setColor(vec3.fromValues(value[0] / 255.0, value[1] / 255.0, value[2] / 255.0));
    flower.resetColors();
  });

  // get canvas and webgl context
  const canvas = <HTMLCanvasElement>document.getElementById('canvas');
  const gl = <WebGL2RenderingContext>canvas.getContext('webgl2');
  if (!gl) {
    alert('WebGL 2 not supported!');
  }
  // `setGL` is a function imported above which sets the value of `gl` in the `globals.ts` module.
  // Later, we can import `gl` from `globals.ts` to access it
  setGL(gl);

  // Initial call to load scene
  loadScene();

  const camera = new Camera(vec3.fromValues(0, 0, 5), vec3.fromValues(0, 0, 0));

  const renderer = new OpenGLRenderer(canvas);
  renderer.setClearColor(0.53, 0.81, 0.92, 1);
  gl.enable(gl.DEPTH_TEST);

  const lambert = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/lambert-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/lambert-frag.glsl')),
  ]);


  function cactusPaddleCallback(indices: Array<number>, positions: Array<number>, normals: Array<number>): void {
    cactusPaddle.indices = Uint32Array.from(indices);
    cactusPaddle.positions = Float32Array.from(positions);
    cactusPaddle.normals = Float32Array.from(normals);
    cactusPaddle.create();
  }

  function flowerCallback(indices: Array<number>, positions: Array<number>, normals: Array<number>): void {
    flower.indices = Uint32Array.from(indices);
    flower.positions = Float32Array.from(positions);
    flower.normals = Float32Array.from(normals);
    flower.create();
  }

  function baseCallback(indices: Array<number>, positions: Array<number>, normals: Array<number>): void {
    base.indices = Uint32Array.from(indices);
    base.positions = Float32Array.from(positions);
    base.normals = Float32Array.from(normals);
    base.create();
  }



  // referenced from https://stackoverflow.com/questions/14446447/how-to-read-a-local-text-file
  function readTextFile(file: string, callback: any): void {
    let indices: Uint32Array = new Uint32Array(0);
    let positions: Float32Array = new Float32Array(0);
    let normals: Float32Array = new Float32Array(0);

    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function () {
      if (rawFile.readyState === 4) {
        if (rawFile.status === 200 || rawFile.status == 0) {
          var allText = rawFile.responseText;
          OBJLoader(allText, callback, cactusPaddle);
        }
      }
    }
    rawFile.send(null);
  }

  let cactusFilename: string = "./cactusPaddle2.obj";
  readTextFile(cactusFilename, cactusPaddleCallback);

  let flowerFilename: string = "./flower.obj";
  readTextFile(flowerFilename, flowerCallback);

  let baseFilename: string = "./cylinder.obj";
  readTextFile(baseFilename, baseCallback);

  update();

  // This function will be called every frame
  function tick() {
    camera.update();
    stats.begin();
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.clear();

    renderer.render(camera, lambert, [
      cactusMesh,
      base
    ]);
    stats.end();

    // Tell the browser to call `tick` again whenever it renders a new frame
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', function () {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.setAspectRatio(window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
  }, false);

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.setAspectRatio(window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();

  // Start the render loop
  tick();
}

main();
