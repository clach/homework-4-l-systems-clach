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

  constructor() {
    super(); // Call the constructor of the super class. This is required.
    this.indices = new Uint32Array(0);
    this.positions = new Float32Array(0);
    this.normals = new Float32Array(0);
    this.colors = new Float32Array(0);

    //this.indicesTemp = [];
    //this.positionsTemp = [];
    //this.normalsTemp = [];
  }

  addIndices(newIndices: Uint32Array) : void {
    var newIndicesArray = new Uint32Array(this.indices.length + newIndices.length);
    newIndicesArray.set(this.indices);
    newIndicesArray.set(newIndices, this.indices.length);

    this.indices = newIndicesArray;
  }

  addPositions(newPositions: Float32Array) : void {
    var newPositionsArray = new Float32Array(this.positions.length + newPositions.length);
    newPositionsArray.set(this.positions);
    newPositionsArray.set(newPositions, this.positions.length);

    this.positions = newPositionsArray;
  }

  addNormals(newNormals: Float32Array) : void {
    var newNormalsArray = new Float32Array(this.normals.length + newNormals.length);
    newNormalsArray.set(this.normals);
    newNormalsArray.set(newNormals, this.normals.length);

    this.normals = newNormalsArray;
  }

  addColors(newColors: Float32Array) : void {
    var newColorsArray = new Float32Array(this.colors.length + newColors.length);
    newColorsArray.set(this.colors);
    newColorsArray.set(newColors, this.colors.length);

    this.colors = newColorsArray;
  }

  clear() {
    this.indices = new Uint32Array(0);
    this.positions = new Float32Array(0);
    this.normals = new Float32Array(0);
    this.colors = new Float32Array(0);
  }

  getMaxIndex() : number {
    if (this.indices.length == 0) {
      return -1;
    } else {
      var max = this.indices.reduce(function(a, b) {
        return Math.max(a, b);
      });
      return max;
    }
  }

  // only call once all geometry has been added to cactus (l-system has been fully expanded and such)
  create() {
    

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
