import GrammarExpansion from './GrammarExpansion';

class LSystem {

    currStringArr: string[] = [];

    expansionRules: GrammarExpansion = new GrammarExpansion();

    constructor(startChar: string) {
        this.currStringArr.push(startChar);

        this.expansionRules.addExpansionRule('[', 1, '[');
        this.expansionRules.addExpansionRule(']', 1, ']');
        this.expansionRules.addExpansionRule('1', 1, '11');
        this.expansionRules.addExpansionRule('0', 1, '1[0]0');
    }

    getString() : string {
        return this.currStringArr.join('');
    }

    expandString() : void {
        //console.log("about to expand " + this.currStringArr);
        //var newStringArr: Array<string> = new Array<string>();
        var newStringArr: string[] = [];
        for (var i = 0; i < this.currStringArr.length; i++) {
            var stringToExpand = this.currStringArr[i];
            //console.log("stringToExpand: " + stringToExpand);
            for (var j = 0; j < stringToExpand.length; j++) {
                var char = stringToExpand.charAt(j);

                let successorString = this.expansionRules.getExpansion(char);

                newStringArr.push(successorString);
            }
        }

        //console.log("should expand to " + newStringArr);
        this.currStringArr = newStringArr;
    }



}

export default LSystem;