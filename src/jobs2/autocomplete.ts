export function getOptions(search: string, options: string[]) {
  const separator = " ";
  const parts = search.trim().split(separator);
  const lastPart = parts.pop() || "";
  const leftPart = parts.join(separator);
  return options
    .filter((option) => option.toLowerCase().startsWith(lastPart.toLowerCase()))
    .map((word) => (leftPart === "" ? word : `${leftPart}${separator}${word}`));
}

// class TrieNode {
//   children: { [key: string]: TrieNode };
//   value: string;
//   isEndOfWord: boolean;

//   constructor(value: string) {
//     this.value = value;
//     this.isEndOfWord = false;
//     this.children = {};
//   }
// }

// export class Trie {
//   root: TrieNode;

//   constructor() {
//     this.root = new TrieNode("");
//   }

//   insert(word: string) {
//     let current = this.root;
//     for (let character of word) {
//       if (current.children[character] === undefined) {
//         current.children[character] = new TrieNode(character);
//       }
//       current = current.children[character];
//     }
//     current.isEndOfWord = true;
//   }

//   private search(word: string) {
//     let current = this.root;
//     for (let character of word) {
//       if (current.children[character] === undefined) {
//         return false;
//       }
//       current = current.children[character];
//     }
//     return current;
//   }

//   private collectWords(node: TrieNode, prefix: string): string[] {
//     const words: string[] = [];
//     if (node.isEndOfWord) {
//       words.push(prefix);
//     }
//     for (const [char, child] of Object.entries(node.children)) {
//       words.push(...this.collectWords(child, `${prefix}${char}`));
//     }
//     return words;
//   }

//   autocomplete(prefix: string): string[] {
//     const separator = " ";
//     const parts = prefix.split(separator);

//     const rightPart = parts.pop() || "";
//     const leftPart = parts.join(separator);

//     const node = this.search(rightPart);
//     if (!node) {
//       return [];
//     }
//     return this.collectWords(node, rightPart).map((word) =>
//       leftPart === "" ? word : `${leftPart}${separator}${word}`,
//     );
//   }
// }
