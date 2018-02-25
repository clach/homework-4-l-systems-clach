class ListNode {
    character: string;
    prev: ListNode;
    next: ListNode;

    constructor(character: string, prev: ListNode, next: ListNode) {
        this.character = character;
        this.prev = prev;
        this.next = next;
    }
}

class LinkedList {
    head: ListNode;
    tail: ListNode;

    constructor() {
    }

}

export default LinkedList;