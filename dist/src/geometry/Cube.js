import Drawable from '../rendering/gl/Drawable';
import { gl } from '../globals';
class Cube extends Drawable {
    constructor() {
        super(); // Call the constructor of the super class. This is required.
    }
    create() {
        // cube has 6 sides, 2 triangles per side: 12 triangles
        // 3 indices per triangle: 12 * 3 = 36 indices total
        this.indices = new Uint32Array([0, 1, 2,
            0, 2, 3,
            4, 5, 6,
            4, 6, 7,
            8, 9, 10,
            8, 10, 11,
            12, 13, 14,
            12, 14, 15,
            16, 17, 18,
            16, 18, 19,
            20, 21, 22,
            20, 22, 23]);
        // each vertex of each face has the same 4 normals
        this.normals = new Float32Array([0, 0, 1, 0,
            0, 0, 1, 0,
            0, 0, 1, 0,
            0, 0, 1, 0,
            0, 0, -1, 0,
            0, 0, -1, 0,
            0, 0, -1, 0,
            0, 0, -1, 0,
            1, 0, 0, 0,
            1, 0, 0, 0,
            1, 0, 0, 0,
            1, 0, 0, 0,
            -1, 0, 0, 0,
            -1, 0, 0, 0,
            -1, 0, 0, 0,
            -1, 0, 0, 0,
            0, 1, 0, 0,
            0, 1, 0, 0,
            0, 1, 0, 0,
            0, 1, 0, 0,
            0, -1, 0, 0,
            0, -1, 0, 0,
            0, -1, 0, 0,
            0, -1, 0, 0]);
        this.positions = new Float32Array([1, -1, 1, 1,
            1, 1, 1, 1,
            -1, 1, 1, 1,
            -1, -1, 1, 1,
            -1, -1, -1, 1,
            -1, 1, -1, 1,
            1, 1, -1, 1,
            1, -1, -1, 1,
            1, -1, -1, 1,
            1, 1, -1, 1,
            1, 1, 1, 1,
            1, -1, 1, 1,
            -1, -1, 1, 1,
            -1, 1, 1, 1,
            -1, 1, -1, 1,
            -1, -1, -1, 1,
            1, 1, 1, 1,
            1, 1, -1, 1,
            -1, 1, -1, 1,
            -1, 1, 1, 1,
            1, -1, -1, 1,
            1, -1, 1, 1,
            -1, -1, 1, 1,
            -1, -1, -1, 1]);
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
        console.log(`Created cube`);
    }
}
;
export default Cube;
//# sourceMappingURL=Cube.js.map