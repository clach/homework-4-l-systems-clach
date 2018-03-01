import { vec4, vec3, mat3, mat4, glMatrix, quat } from 'gl-matrix';
import CactusPaddle from './geometry/CactusPaddle'
import Drawable from './rendering/gl/Drawable'
import LSystemMesh from './geometry/LSystemMesh'
import Flower from './geometry/Flower'

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

    scaleTurtle(scale: number) : void {
        this.scale *= scale;
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
    rotation: number;

    cactusMesh: LSystemMesh;

    turtleStates: TurtleState[] = [];

    currentTurtle: TurtleState;

    constructor(rotation: number, startMesh: LSystemMesh, startPos: vec3, startOrientation: quat, startDepth: number, startScale: number) {
        this.rotation = rotation;
        this.cactusMesh = startMesh;
        this.currentTurtle = new TurtleState(startPos, startOrientation, startDepth, startScale);
    }

    drawCactusPaddle(cactusPaddleMesh: CactusPaddle, cactusMesh: LSystemMesh) : void {
        console.log("draw cactus paddle");

        if (this.currentTurtle.depth > 0) {
            // rotate cactus by some random amount (0-45 degrees)
            let randX = Math.random() - 0.5;
            let randY = Math.random() - 0.5;
            let randZ = Math.random() - 0.5;
            this.currentTurtle.rotateTurtleX(this.rotation * randX * 45);
            this.currentTurtle.rotateTurtleY(this.rotation * randY * 45);
            this.currentTurtle.rotateTurtleZ(this.rotation * randZ * 45);
        }

        if (this.currentTurtle.depth > 0) {
            // scale cactus by some random amount
            let scaleRand = (Math.random() + 1) / 2.0;
            this.currentTurtle.scaleTurtle(scaleRand * 0.9);
        }

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

        // pass cactus colors
        cactusMesh.addColors(cactusPaddleMesh.colors);

        let offset: number = cactusMesh.getMaxIndex() + 1;

        let cactusPaddleIndices: Uint32Array = cactusPaddleMesh.indices;
        var cactusIndices: number[] = [];
        for (var i = 0; i < cactusPaddleIndices.length; i++) {
            cactusIndices.push(cactusPaddleIndices[i] + offset);
        }
        let indicesArray: Uint32Array = new Uint32Array(cactusIndices);
        cactusMesh.addIndices(indicesArray);

        var toTranslateBy: vec4 = vec4.fromValues(0, 1, 0, 1);
        toTranslateBy = vec4.scale(toTranslateBy, toTranslateBy, this.currentTurtle.scale);
        toTranslateBy = vec4.transformQuat(toTranslateBy, toTranslateBy, this.currentTurtle.orientation);
        let toTranslateByVec3: vec3 = vec3.fromValues(toTranslateBy[0], toTranslateBy[1], toTranslateBy[2]);
        
        this.currentTurtle.translateTurtle(toTranslateByVec3);

        this.currentTurtle.depth++;
    }

    drawCactusPaddleFlower(cactusPaddleMesh: CactusPaddle, flowerMesh: Flower, cactusMesh: LSystemMesh) : void  {

        this.drawCactusPaddle(cactusPaddleMesh, cactusMesh);

        var toTranslateBy: vec4 = vec4.fromValues(0, 0.05, 0, 1);
        toTranslateBy = vec4.scale(toTranslateBy, toTranslateBy, this.currentTurtle.scale);
        toTranslateBy = vec4.transformQuat(toTranslateBy, toTranslateBy, this.currentTurtle.orientation);
        let toTranslateByVec3: vec3 = vec3.fromValues(toTranslateBy[0], toTranslateBy[1], toTranslateBy[2]);
        
        this.currentTurtle.translateTurtle(toTranslateByVec3);

        let transformMat: mat4 = this.currentTurtle.getTurtleTransMat();
        let invTransMat: mat4 = this.currentTurtle.getTurtleInvTransTransMat();

        let flowerPos: Float32Array = flowerMesh.positions;
        let flowerNor: Float32Array = flowerMesh.normals;
        for (var i = 0; i < flowerPos.length; i += 4) {
            // get positions of basic cactus and transform them
            var pos: vec4 = vec4.fromValues(flowerPos[i],
                flowerPos[i + 1], flowerPos[i + 2], flowerPos[i + 3]);
            pos = vec4.transformMat4(pos, pos, transformMat);

            // put positions into array and pass to mesh
            let posArray: Float32Array = new Float32Array([pos[0], pos[1], pos[2], pos[3]]);
            cactusMesh.addPositions(posArray);

            // get normals of basic cactus and transform them
            var nor: vec4 = vec4.fromValues(flowerNor[i],
                flowerNor[i + 1], flowerNor[i + 2], flowerNor[i + 3]);
            nor = vec4.transformMat4(nor, nor, invTransMat);

            // put positions into array and pass to mesh
            let norArray: Float32Array = new Float32Array([nor[0], nor[1], nor[2], nor[3]]);
            cactusMesh.addNormals(norArray);

        }

        let offset: number = cactusMesh.getMaxIndex() + 1;

        let flowerIndices: Uint32Array = flowerMesh.indices;
        var cactusIndices: number[] = [];
        for (var i = 0; i < flowerIndices.length; i++) {
            cactusIndices.push(flowerIndices[i] + offset);
        }
        let indicesArray: Uint32Array = new Uint32Array(cactusIndices);
        cactusMesh.addIndices(indicesArray);

        // pass flower colors
        cactusMesh.addColors(flowerMesh.colors);

        this.currentTurtle.depth++;

        console.log("draw flower");

    }

    rotateLeft(cactusPaddleMesh: CactusPaddle, cactusMesh: LSystemMesh) : void  {
        console.log("rotateLeft");
        this.turtleStates.push(this.currentTurtle);

        let pos: vec3 = vec3.fromValues(this.currentTurtle.position[0], this.currentTurtle.position[1],
            this.currentTurtle.position[2]);
        let orientation: quat = quat.fromValues(this.currentTurtle.orientation[0], 
            this.currentTurtle.orientation[1], this.currentTurtle.orientation[2], 
            this.currentTurtle.orientation[3]);
        let depth = this.currentTurtle.depth + 1;
        let scale = this.currentTurtle.scale;

        var newTurtle: TurtleState = new TurtleState(pos, orientation, depth, scale);
        newTurtle.rotateTurtleZ(45);

        this.currentTurtle = newTurtle;
    }

    rotateRight(cactusPaddleMesh: CactusPaddle, cactusMesh: LSystemMesh) : void {
        console.log("rotateRight");

        this.currentTurtle = this.turtleStates.pop();
        this.currentTurtle.rotateTurtleZ(-45);
    }


}

export default Turtle;