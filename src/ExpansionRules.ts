
// Some sort of class to represent a Rule for expanding a character into a 
// string. You might consider creating a map within each Rule that maps probabilities 
// to strings, so that a Rule can represent multiple possible expansions for a character
// with different probabilities.


let expansionRules: Map<string, string> = new Map<string, string>();

expansionRules.set('', '');

export function getStringExpansion(currString: string) : string {
    return expansionRules.get(currString);
}