import {vec3, vec4} from 'gl-matrix';
import Drawable from '../rendering/gl/Drawable';
import {gl} from '../globals';

class LSystem extends Drawable {
  indices: Uint32Array;
  positions: Float32Array;
  normals: Float32Array;
  colors: Float32Array;

  indicesTemp: number[];
  positionsTemp: number[];
  normalsTemp: number[];
  colorsTemp: number[];

  constructor() {
    super(); // Call the constructor of the super class. This is required.
    //this.indices = new Uint32Array(0);
    this.positions = new Float32Array(0);
    this.normals = new Float32Array(0);
    this.colors = new Float32Array(0);

    this.indicesTemp = [];
    this.positionsTemp = [];
    this.normalsTemp = [];
    this.colorsTemp = [];
  }

  /*
  addIndices(newIndices: Uint32Array) : void {
    var newIndicesArray = new Uint32Array(this.indices.length + newIndices.length);
    newIndicesArray.set(this.indices);
    newIndicesArray.set(newIndices, this.indices.length);

    this.indices = newIndicesArray;
  }*/

  addIndex(newIndex: number) : void {
    this.indicesTemp.push(newIndex);
  }

  addPosition(newPos: number) : void {
    this.positionsTemp.push(newPos);
  }

  addNormal(newNor: number) : void {
    this.normalsTemp.push(newNor);
  }

  addColor(newCol: number) : void {
    this.colorsTemp.push(newCol);
  }

  clear() {
    this.indicesTemp = [];
    this.positionsTemp = [];
    this.normalsTemp = [];
    this.colorsTemp = [];
  }

  getMaxIndex() : number {
    if (this.indicesTemp.length == 0) {
      return -1;
    } else {
      var max = this.indicesTemp.reduce(function(a, b) {
        return Math.max(a, b);
      });
      return max;
    }
  }

  // only call once all geometry has been added to cactus (l-system has been fully expanded and such)
  create() {
    

    this.indices = new Uint32Array(this.indicesTemp);
    this.positions = new Float32Array(this.positionsTemp);
    this.normals = new Float32Array(this.normalsTemp);
    this.colors = new Float32Array(this.colorsTemp);


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

export default LSystem;
