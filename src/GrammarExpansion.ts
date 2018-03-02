
// Some sort of class to represent a Rule for expanding a character into a 
// string. You might consider creating a map within each Rule that maps probabilities 
// to strings, so that a Rule can represent multiple possible expansions for a character
// with different probabilities.

class GrammarExpansion {

    // this maps a character to a map of probabilties to strings
    expansionRulesMap: Map<string, Map<number, string>> = new Map<string, Map<number, string>>();

    constructor() {}

    // adds expansion rule to map
    addExpansionRule(startChar: string, probability: number, successorString: string) {
        if (this.expansionRulesMap.has(startChar)) {
            var probToStringMap: Map<number, string> = this.expansionRulesMap.get(startChar);
            probToStringMap.set(probability, successorString);
        } else {
            var probToStringMap: Map<number, string> = new Map<number, string>();
            probToStringMap.set(probability, successorString);
            this.expansionRulesMap.set(startChar, probToStringMap);
        }
        
    }

    // uses randomly generated number to determine how to expand a character
    getExpansion(startChar: string): string {
        if (this.expansionRulesMap.has(startChar)) {

            var probToStringMap: Map<number, string> = this.expansionRulesMap.get(startChar);

            var rand: number = Math.random();

            var successorString: string;

            var accumulatedProbability: number = 0.0;
            for (const prob of probToStringMap.keys()) {
                
                if (rand > accumulatedProbability && rand <= accumulatedProbability + prob) {
                    successorString = probToStringMap.get(prob);
                }
                accumulatedProbability += prob;
            }
            return successorString;
        } else {
            return '';
        }
    }
    

}

export default GrammarExpansion;