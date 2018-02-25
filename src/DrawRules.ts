
// A second Rule-style class that dictates what drawing operation should be performed 
// when a character is parsed during the drawing process. This should also be a map of 
// probabilities, but this time the values in the map will be functions rather than 
// strings. Invoke a given function, e.g. drawBranch, when a character is parsed.

class DrawRules {

    // this maps a character to a map of probabilties to draw functions
    drawRules: Map<string, Map<number, any>> = new Map<string, Map<number, any>>();

    constructor() {}

    // adds draw rule to map
    addDrawRule(char: string, probability: number, drawFunction: any) {
        var probToFunctionMap: Map<number, string> = this.drawRules.get(char);
        probToFunctionMap.set(probability, drawFunction);
    }

    // uses randomly generated number to determine how to draw a character
    getDrawRule(char: string) : any {
        var probToFunctionMap: Map<number, any> = this.drawRules.get(char);

        var rand: number = Math.random();

        var drawRule: any;

        var accumulatedProbability: number = 0.0;
        for (const prob of probToFunctionMap.keys()) {
            if (rand > accumulatedProbability && rand <= accumulatedProbability + prob) {
                drawRule = probToFunctionMap.get(prob);
            }
            accumulatedProbability += prob;
        }

        return drawRule;
    }

}

export default DrawRules;