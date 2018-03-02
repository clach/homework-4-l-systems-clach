import GrammarExpansion from './GrammarExpansion';
import DrawRules from './DrawRules';
import Turtle from './Turtle'
import LSystemMesh from './geometry/LSystemMesh'
import CactusPaddle from './geometry/CactusPaddle'
import Flower from './geometry/Flower'
import { vec3, mat4 } from 'gl-matrix';

class LSystem {

    currStringArr: string[] = [];

    expansionRules: GrammarExpansion = new GrammarExpansion();
    drawRules: DrawRules = new DrawRules();

    constructor(startChar: string, startMesh: LSystemMesh) {

        this.currStringArr.push(startChar);

        // add string expansion rules
        this.expansionRules.addExpansionRule('[', 1, '[');
        this.expansionRules.addExpansionRule(']', 1, ']');
        this.expansionRules.addExpansionRule('1', 0.15, '11');
        this.expansionRules.addExpansionRule('1', 0.6, '1[0]1');
        this.expansionRules.addExpansionRule('1', 0.25, '1');
        this.expansionRules.addExpansionRule('0', 0.5, '1[0]0');
        this.expansionRules.addExpansionRule('0', 0.1, '10');
        this.expansionRules.addExpansionRule('0', 0.4, '1[0][0]0');
    }

    // add drawing rules
    // made into separate function because it requires knowing meshes and Turtle
    addRules(cactusPaddleMesh: CactusPaddle, flowerMesh: Flower, cactusMesh: LSystemMesh, turtle: Turtle) : void {
        this.drawRules.addDrawRule('[', 0.6, function(){ turtle.rotateLeftZ(cactusPaddleMesh, cactusMesh) });
        this.drawRules.addDrawRule(']', 0.6, function(){ turtle.rotateRightZ(cactusPaddleMesh, cactusMesh) });
        this.drawRules.addDrawRule('[', 0.4, function(){ turtle.rotateLeftXYZ(cactusPaddleMesh, cactusMesh) });
        this.drawRules.addDrawRule(']', 0.4, function(){ turtle.rotateRightXYZ(cactusPaddleMesh, cactusMesh) });
        this.drawRules.addDrawRule('0', 1, function(){ turtle.drawCactusPaddleFlower(cactusPaddleMesh, flowerMesh, cactusMesh) });
        this.drawRules.addDrawRule('1', 1, function(){ turtle.drawCactusPaddle(cactusPaddleMesh, cactusMesh) });
    }

    getString() : string {
        return this.currStringArr.join('');
    }

    // iterates through each character of the current string
    // determines what successor string each character maps to 
    // returns string made of successor strings
    expandString() : void {
        var newStringArr: string[] = [];
        for (var i = 0; i < this.currStringArr.length; i++) {
            var stringToExpand = this.currStringArr[i];
            for (var j = 0; j < stringToExpand.length; j++) {
                var char = stringToExpand.charAt(j);

                let successorString = this.expansionRules.getExpansion(char);

                newStringArr.push(successorString);
            }
        }

        this.currStringArr = newStringArr;
    }

    drawLSystem() : void {
        for (var i = 0; i < this.currStringArr.length; i++) {
            var stringToExpand = this.currStringArr[i];
            for (var j = 0; j < stringToExpand.length; j++) {
                var char = stringToExpand.charAt(j);

                let drawFunction = this.drawRules.getDrawRule(char);

                drawFunction(); // call draw function of turtle!
            }
        }
    }



}

export default LSystem;