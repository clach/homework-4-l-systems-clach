import { vec4, vec3, mat3, mat4, glMatrix, quat } from 'gl-matrix';
import CactusPaddle from './geometry/Cactus'
import Drawable from './rendering/gl/Drawable'
import LSystemMesh from './geometry/LSystemMesh'
import Cactus from './geometry/Cactus'

class TurtleState {
    position: vec3;
    orientation: quat;
    depth: number;
    scale: number;

    constructor(startPos: vec3, startOrientation: quat, startDepth: number, startScale: number) {
        this.position = startPos;
        this.orientation = startOrientation;
        this.depth = startDepth;
        this.scale = startScale;
    }

    rotateTurtleX(angle: number) : void  {
        this.orientation = quat.rotateX(this.orientation, this.orientation, glMatrix.toRadian(angle));
    }

    rotateTurtleY(angle: number) : void  {
        this.orientation = quat.rotateY(this.orientation, this.orientation, glMatrix.toRadian(angle));
    }

    rotateTurtleZ(angle: number) : void  {
        this.orientation = quat.rotateZ(this.orientation, this.orientation, glMatrix.toRadian(angle));
    }

    translateTurtle(translate: vec3) : void {
        this.position = vec3.add(this.position, this.position, translate);
    }

    getTurtleTransMat() : mat4 {
        var translateMat: mat4 = mat4.fromRotationTranslationScale(mat4.create(), 
            this.orientation, this.position, vec3.fromValues(this.scale, this.scale, this.scale));
        return translateMat;
    }

    getTurtleInvTransTransMat() : mat4 {
        var translateMat: mat4 = mat4.fromRotationTranslationScale(mat4.create(), 
            this.orientation, this.position, vec3.fromValues(this.scale, this.scale, this.scale));
        translateMat = mat4.invert(translateMat, translateMat);
        translateMat = mat4.transpose(translateMat, translateMat);
        return translateMat;
    }
}

class Turtle {
    cactusMesh: LSystemMesh;

    turtleStates: TurtleState[] = [];

    currentTurtle: TurtleState;

    constructor(startMesh: LSystemMesh, startPos: vec3, startOrientation: quat, startDepth: number, startScale: number) {
        this.cactusMesh = startMesh;
        this.currentTurtle = new TurtleState(startPos, startOrientation, startDepth, startScale);
    }

    drawCactusPaddle(cactusPaddleMesh: Cactus, cactusMesh: LSystemMesh) : void {
        console.log("draw cactus paddle");

        let transformMat: mat4 = this.currentTurtle.getTurtleTransMat();
        let invTransMat: mat4 = this.currentTurtle.getTurtleInvTransTransMat();

        let cactusPaddlePos: Float32Array = cactusPaddleMesh.positions;
        let cactusPaddleNor: Float32Array = cactusPaddleMesh.normals;
        for (var i = 0; i < cactusPaddlePos.length; i += 4) {
            // get positions of basic cactus and transform them
            var pos: vec4 = vec4.fromValues(cactusPaddlePos[i],
                cactusPaddlePos[i + 1], cactusPaddlePos[i + 2], cactusPaddlePos[i + 3]);
            pos = vec4.transformMat4(pos, pos, transformMat);

            // put positions into array and pass to mesh
            let posArray: Float32Array = new Float32Array([pos[0], pos[1], pos[2], pos[3]]);
            cactusMesh.addPositions(posArray);


            // get normals of basic cactus and transform them
            var nor: vec4 = vec4.fromValues(cactusPaddleNor[i],
                cactusPaddleNor[i + 1], cactusPaddleNor[i + 2], cactusPaddleNor[i + 3]);
            nor = vec4.transformMat4(nor, nor, invTransMat);

            // put positions into array and pass to mesh
            let norArray: Float32Array = new Float32Array([nor[0], nor[1], nor[2], nor[3]]);
            cactusMesh.addNormals(norArray);

        }

        let offset: number = cactusMesh.getMaxIndex() + 1;
        console.log(offset);

        let cactusPaddleIndices: Uint32Array = cactusPaddleMesh.indices;
        var cactusIndices: number[] = [];
        for (var i = 0; i < cactusPaddleIndices.length; i++) {
            cactusIndices.push(cactusPaddleIndices[i] + offset);
        }
        let indicesArray: Uint32Array = new Uint32Array(cactusIndices);
        cactusMesh.addIndices(indicesArray);

        console.log(cactusMesh.indices);


        this.currentTurtle.translateTurtle(vec3.fromValues(0, 1, 0));
    }

    drawCactusPaddleLeaf(cactusPaddleMesh: Cactus, cactusMesh: LSystemMesh) : void  {
        console.log("draw cactus paddleLEAF");

        let transformMat: mat4 = this.currentTurtle.getTurtleTransMat();
        let invTransMat: mat4 = this.currentTurtle.getTurtleInvTransTransMat();

        let cactusPaddlePos: Float32Array = cactusPaddleMesh.positions;
        let cactusPaddleNor: Float32Array = cactusPaddleMesh.normals;
        for (var i = 0; i < cactusPaddlePos.length; i += 4) {
            // get positions of basic cactus and transform them
            var pos: vec4 = vec4.fromValues(cactusPaddlePos[i],
                cactusPaddlePos[i + 1], cactusPaddlePos[i + 2], cactusPaddlePos[i + 3]);
            pos = vec4.transformMat4(pos, pos, transformMat);

            // put positions into array and pass to mesh
            let posArray: Float32Array = new Float32Array([pos[0], pos[1], pos[2], pos[3]]);
            cactusMesh.addPositions(posArray);


            // get normals of basic cactus and transform them
            var nor: vec4 = vec4.fromValues(cactusPaddleNor[i],
                cactusPaddleNor[i + 1], cactusPaddleNor[i + 2], cactusPaddleNor[i + 3]);
            nor = vec4.transformMat4(nor, nor, invTransMat);

            // put positions into array and pass to mesh
            let norArray: Float32Array = new Float32Array([nor[0], nor[1], nor[2], nor[3]]);
            cactusMesh.addNormals(norArray);

        }

        let offset: number = cactusMesh.getMaxIndex() + 1;
        let cactusPaddleIndices: Uint32Array = cactusPaddleMesh.indices;
        var cactusIndices: number[] = [];
        for (var i = 0; i < cactusPaddleIndices.length; i++) {
            cactusIndices.push(cactusPaddleIndices[i] + offset);
        }
        let indicesArray: Uint32Array = new Uint32Array(cactusIndices);
        cactusMesh.addIndices(indicesArray);


        console.log(cactusMesh.indices);
        
        this.currentTurtle.translateTurtle(vec3.fromValues(0, 1, 0));
    }

    rotateLeft(cactusPaddleMesh: Cactus, cactusMesh: LSystemMesh) : void  {
        console.log("rotateLeft");
        this.turtleStates.push(this.currentTurtle);

        var newTurtle: TurtleState = new TurtleState(this.currentTurtle.position, this.currentTurtle.orientation,
            this.currentTurtle.depth, this.currentTurtle.scale);
        newTurtle.rotateTurtleZ(45);

        this.currentTurtle = newTurtle;
    }

    rotateRight(cactusPaddleMesh: Cactus, cactusMesh: LSystemMesh) : void {
        console.log("rotateRight");

        this.currentTurtle = this.turtleStates.pop();
        this.currentTurtle.rotateTurtleZ(-45);
    }


}

export default Turtle;