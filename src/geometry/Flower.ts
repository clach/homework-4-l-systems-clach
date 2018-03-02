import {vec3, vec4} from 'gl-matrix';
import Drawable from '../rendering/gl/Drawable';
import {gl} from '../globals';

class Flower extends Drawable {
  indices: Uint32Array;
  positions: Float32Array;
  normals: Float32Array;
  colors: Float32Array;
  color: vec3;

  constructor() {
    super(); // Call the constructor of the super class. This is required.
    this.color = vec3.fromValues(0.75, 0.5, 0.74);
  }

  setColor(newColor: vec3) {
    this.color = newColor;
  }

  resetColors() {
    var colorsArr: number[] = [];
    for (var i = 0; i < this.positions.length; i +=4) {
      colorsArr.push(this.color[0]);
      colorsArr.push(this.color[1]);
      colorsArr.push(this.color[2]);
      colorsArr.push(1);
    }
    this.colors = new Float32Array(colorsArr);
  }

  create() {

    var colorsArr: number[] = [];
    for (var i = 0; i < this.positions.length; i +=4) {
      colorsArr.push(this.color[0]);
      colorsArr.push(this.color[1]);
      colorsArr.push(this.color[2]);
      colorsArr.push(1);
    }
    this.colors = new Float32Array(colorsArr);

    this.generateIdx();
    this.generatePos();
    this.generateNor();
    this.generateCol();

    this.count = this.indices.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNor);
    gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
    gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufCol);
    gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);
  }
};

export default Flower;
