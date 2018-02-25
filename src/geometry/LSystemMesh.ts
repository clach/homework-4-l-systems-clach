import {vec3, vec4} from 'gl-matrix';
import Drawable from '../rendering/gl/Drawable';
import {gl} from '../globals';

class LSystem extends Drawable {
  indices: Uint32Array;
  positions: Float32Array;
  normals: Float32Array;

  constructor() {
    super(); // Call the constructor of the super class. This is required.
  }

  addIndices(newIndices: Uint32Array) {
    var newIndicesArray = new Uint32Array(this.indices.length + newIndices.length);
    newIndicesArray.set(this.indices);
    newIndicesArray.set(newIndices, this.indices.length);

    this.indices = newIndicesArray;
  }

  addPositions(newPositions: Float32Array) {
    var newPositionsArray = new Float32Array(this.positions.length + newPositions.length);
    newPositionsArray.set(this.positions);
    newPositionsArray.set(newPositions, this.positions.length);

    this.positions = newPositionsArray;
  }

  addNormals(newNormals: Float32Array) {
    var newNormalsArray = new Float32Array(this.normals.length + newNormals.length);
    newNormalsArray.set(this.normals);
    newNormalsArray.set(newNormals, this.normals.length);

    this.normals = newNormalsArray;
  }

  // only call once all geometry has been added to cactus (l-system has been fully expanded and such)
  create() {
    this.generateIdx();
    this.generatePos();
    this.generateNor();

    this.count = this.indices.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNor);
    gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
    gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);

    console.log(`Created cactus`);
  }
};

export default LSystem;
