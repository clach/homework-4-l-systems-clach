// A second Rule-style class that dictates what drawing operation should be performed 
// when a character is parsed during the drawing process. This should also be a map of 
// probabilities, but this time the values in the map will be functions rather than 
// strings. Invoke a given function, e.g. drawBranch, when a character is parsed.

class DrawRules {

    // this maps a character to a map of probabilties to draw functions
    drawRulesMap: Map<string, Map<number, any>> = new Map<string, Map<number, any>>();

    constructor() { }

    // adds draw rule to map
    addDrawRule(char: string, probability: number, drawFunction: any) {
        if (this.drawRulesMap.has(char)) {
            var probToFunctionMap: Map<number, any> = this.drawRulesMap.get(char);
            probToFunctionMap.set(probability, drawFunction);
        } else {
            var probToFunctionMap: Map<number, any> = new Map<number, any>();
            probToFunctionMap.set(probability, drawFunction);
            this.drawRulesMap.set(char, probToFunctionMap);
        }
    }

    // uses randomly generated number to determine how to draw a character
    getDrawRule(char: string): any {
        // check if character exists in map
        if (this.drawRulesMap.has(char)) {
            var probToFunctionMap: Map<number, any> = this.drawRulesMap.get(char);
            
            // generate random number between 0 and 1
            var rand: number = Math.random();

            var drawRule: any;

            var accumulatedProbability: number = 0.0;
            // use random number to pick draw function
            for (const prob of probToFunctionMap.keys()) {
                if (rand > accumulatedProbability && rand <= accumulatedProbability + prob) {
                    drawRule = probToFunctionMap.get(prob);
                }
                accumulatedProbability += prob;
            }

            return drawRule;

        } else { 
            // if character doesn't map to any rule, just return empty function
            return function() : void {};
        }


    }
}

export default DrawRules;