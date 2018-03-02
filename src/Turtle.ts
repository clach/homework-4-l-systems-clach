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
    scale: number;

    cactusMesh: LSystemMesh;

    turtleStates: TurtleState[] = [];

    currentTurtle: TurtleState;

    constructor(scale: number, rotation: number, startMesh: LSystemMesh, startPos: vec3, startOrientation: quat, startDepth: number, startScale: number) {
        this.scale = scale;
        this.rotation = rotation;
        this.cactusMesh = startMesh;
        this.currentTurtle = new TurtleState(startPos, startOrientation, startDepth, startScale);
    }

    drawCactusPaddle(cactusPaddleMesh: CactusPaddle, cactusMesh: LSystemMesh) : void {
        //console.log("draw cactus paddle");

        if (this.currentTurtle.depth > 0) {
            // rotate cactus by some random amount (0-45 degrees)
            let randX = Math.random() - 0.5;
            let randY = Math.random() - 0.5;
            let randZ = Math.random() - 0.5;
            this.currentTurtle.rotateTurtleX(this.rotation * randX * 60);
            this.currentTurtle.rotateTurtleY(this.rotation * randY * 60);
            this.currentTurtle.rotateTurtleZ(this.rotation * randZ * 60);
        } else {
            let randY = Math.random() - 0.5;
            this.currentTurtle.rotateTurtleY(this.rotation * randY * 60);
        }

        // scale cactus by some random amount
        let scaleRand = (Math.random() * 0.25) + 0.75;
        if (this.currentTurtle.scale >= 0.2) {
            this.currentTurtle.scaleTurtle(this.scale * scaleRand * 0.9);
        } 

        let transformMat: mat4 = this.currentTurtle.getTurtleTransMat();
        let invTransMat: mat4 = this.currentTurtle.getTurtleInvTransTransMat();

        let cactusPaddlePos: Float32Array = cactusPaddleMesh.positions;
        let cactusPaddleNor: Float32Array = cactusPaddleMesh.normals;
        let cactusPaddleCol: Float32Array = cactusPaddleMesh.colors;
        for (var i = 0; i < cactusPaddlePos.length; i += 4) {
            // get positions of basic cactus and transform them
            var pos: vec4 = vec4.fromValues(cactusPaddlePos[i],
                cactusPaddlePos[i + 1], cactusPaddlePos[i + 2], cactusPaddlePos[i + 3]);
            pos = vec4.transformMat4(pos, pos, transformMat);

            // pass positions
            cactusMesh.addPosition(pos[0]);
            cactusMesh.addPosition(pos[1]);
            cactusMesh.addPosition(pos[2]);
            cactusMesh.addPosition(pos[3]);

            // get normals of basic cactus and transform them
            var nor: vec4 = vec4.fromValues(cactusPaddleNor[i],
                cactusPaddleNor[i + 1], cactusPaddleNor[i + 2], cactusPaddleNor[i + 3]);
            nor = vec4.transformMat4(nor, nor, invTransMat);

            // pass normals
            cactusMesh.addNormal(nor[0]);
            cactusMesh.addNormal(nor[1]);
            cactusMesh.addNormal(nor[2]);
            cactusMesh.addNormal(nor[3]);

            // pass colors
            var col: vec4 = vec4.fromValues(cactusPaddleCol[i],
                cactusPaddleCol[i + 1], cactusPaddleCol[i + 2], cactusPaddleCol[i + 3]);
            cactusMesh.addColor(col[0]);
            cactusMesh.addColor(col[1]);
            cactusMesh.addColor(col[2]);
            cactusMesh.addColor(col[3]);

        }

        // pass indices
        let offset: number = cactusMesh.getMaxIndex() + 1;

        let cactusPaddleIndices: Uint32Array = cactusPaddleMesh.indices;
        for (var i = 0; i < cactusPaddleIndices.length; i++) {
            cactusMesh.addIndex(cactusPaddleIndices[i] + offset);
        }

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
        let flowerCol: Float32Array = flowerMesh.colors;

        for (var i = 0; i < flowerPos.length; i += 4) {
            // get positions of basic cactus and transform them
            var pos: vec4 = vec4.fromValues(flowerPos[i],
                flowerPos[i + 1], flowerPos[i + 2], flowerPos[i + 3]);
            pos = vec4.transformMat4(pos, pos, transformMat);

            // pass positions
            cactusMesh.addPosition(pos[0]);
            cactusMesh.addPosition(pos[1]);
            cactusMesh.addPosition(pos[2]);
            cactusMesh.addPosition(pos[3]);

            // get normals of basic cactus and transform them
            var nor: vec4 = vec4.fromValues(flowerNor[i],
                flowerNor[i + 1], flowerNor[i + 2], flowerNor[i + 3]);
            nor = vec4.transformMat4(nor, nor, invTransMat);

            // pass normals
            cactusMesh.addNormal(nor[0]);
            cactusMesh.addNormal(nor[1]);
            cactusMesh.addNormal(nor[2]);
            cactusMesh.addNormal(nor[3]);

            // get colors and pass them
            var col: vec4 = vec4.fromValues(flowerCol[i],
                flowerCol[i + 1], flowerCol[i + 2], flowerCol[i + 3]);
            cactusMesh.addColor(col[0]);
            cactusMesh.addColor(col[1]);
            cactusMesh.addColor(col[2]);
            cactusMesh.addColor(col[3]);

        }

        // pass indices
        let offset: number = cactusMesh.getMaxIndex() + 1;

        let flowerIndices: Uint32Array = flowerMesh.indices;
        for (var i = 0; i < flowerIndices.length; i++) {
            cactusMesh.addIndex(flowerIndices[i] + offset);
        }

        this.currentTurtle.depth++;

        //console.log("draw flower");

    }

    rotateLeftZ(cactusPaddleMesh: CactusPaddle, cactusMesh: LSystemMesh) : void  {
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

    rotateRightZ(cactusPaddleMesh: CactusPaddle, cactusMesh: LSystemMesh) : void {
        this.currentTurtle = this.turtleStates.pop();
        this.currentTurtle.rotateTurtleZ(-45);
    }

    rotateLeftXYZ(cactusPaddleMesh: CactusPaddle, cactusMesh: LSystemMesh) : void  {
        this.turtleStates.push(this.currentTurtle);

        let pos: vec3 = vec3.fromValues(this.currentTurtle.position[0], this.currentTurtle.position[1],
            this.currentTurtle.position[2]);
        let orientation: quat = quat.fromValues(this.currentTurtle.orientation[0], 
            this.currentTurtle.orientation[1], this.currentTurtle.orientation[2], 
            this.currentTurtle.orientation[3]);
        let depth = this.currentTurtle.depth + 1;
        let scale = this.currentTurtle.scale;

        var newTurtle: TurtleState = new TurtleState(pos, orientation, depth, scale);
        newTurtle.rotateTurtleZ(-25);
        newTurtle.rotateTurtleY(-10);
        newTurtle.rotateTurtleX(-10);

        this.currentTurtle = newTurtle;
    }

    rotateRightXYZ(cactusPaddleMesh: CactusPaddle, cactusMesh: LSystemMesh) : void {
        this.currentTurtle = this.turtleStates.pop();
        this.currentTurtle.rotateTurtleZ(25);
        this.currentTurtle.rotateTurtleY(10);
        this.currentTurtle.rotateTurtleX(10);

    }


}

export default Turtle;