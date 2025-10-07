import { createHash } from "crypto";

/**
 * Compute the SHA‑256 hash of the input data.
 * @param data Buffer containing the data.
 * @returns Buffer with the hash.
 */
function sha256(data: Buffer): Buffer {
  return createHash("sha256").update(data).digest();
}

/**
 * Hash a pair of buffers by concatenating them and computing the SHA‑256 hash.
 * @param left Left Buffer.
 * @param right Right Buffer.
 * @returns Buffer with the resulting hash.
 */
function hashPair(left: Buffer, right: Buffer): Buffer {
  return sha256(Buffer.concat([left, right]));
}

class SparseMerkleTree {
  height: number;
  nodes: Map<string, Buffer>;
  defaultHashes: Buffer[];

  /**
   * Creates a Sparse Merkle Tree with the given height.
   * @param height Tree height. For a tree of height h, there are 2^h leaves.
   */
  constructor(height: number = 4) {
    this.height = height;
    this.nodes = new Map<string, Buffer>();
    this.defaultHashes = this.computeDefaultHashes();
  }

  /**
   * Precompute the default hashes for each level of the tree.
   * The default hash at level 0 is computed as sha256(Buffer.from("0")), and then each subsequent
   * level is computed by hashing the concatenation of the default hash of the previous level with itself.
   * @returns Array of default hashes for levels 0 through height.
   */
  private computeDefaultHashes(): Buffer[] {
    const defaultHashes: Buffer[] = [];
    // Level 0: default hash computed from a base value.
    defaultHashes[0] = sha256(Buffer.from("0"));
    for (let level = 1; level <= this.height; level++) {
      defaultHashes[level] = hashPair(
        defaultHashes[level - 1],
        defaultHashes[level - 1]
      );
    }
    return defaultHashes;
  }

  /**
   * Update the leaf at index `key` with the given `value`, then update all parent nodes.
   * @param key The index of the leaf (0 <= key < 2^height).
   * @param value The new value to store (as a Buffer).
   */
  update(key: number, value: Buffer): void {
    if (key >= Math.pow(2, this.height)) {
      throw new Error("Key out of range for tree height");
    }

    // Update the leaf at level 0.
    this.nodes.set(`0-${key}`, sha256(value));

    let currentIndex = key;
    // Bubble the change up to the root.
    for (let level = 1; level <= this.height; level++) {
      const leftIndex = currentIndex - (currentIndex % 2);
      const rightIndex = leftIndex + 1;

      const leftKey = `${level - 1}-${leftIndex}`;
      const rightKey = `${level - 1}-${rightIndex}`;

      const leftChild =
        this.nodes.get(leftKey) || this.defaultHashes[level - 1];
      const rightChild =
        this.nodes.get(rightKey) || this.defaultHashes[level - 1];

      const parentHash = hashPair(leftChild, rightChild);
      currentIndex = Math.floor(currentIndex / 2);
      this.nodes.set(`${level}-${currentIndex}`, parentHash);
    }
  }

  /**
   * Get the current root hash of the tree.
   * @returns Buffer representing the root hash.
   */
  getRoot(): Buffer {
    return (
      this.nodes.get(`${this.height}-0`) || this.defaultHashes[this.height]
    );
  }

  /**
   * Generate a Merkle proof for a given leaf key.
   * @param key The leaf index.
   * @returns An array of Buffer objects, each representing a sibling hash from the leaf to the root.
   */
  getProof(key: number): Buffer[] {
    if (key >= Math.pow(2, this.height)) {
      throw new Error("Key out of range for tree height");
    }
    const proof: Buffer[] = [];
    let currentIndex = key;
    for (let level = 0; level < this.height; level++) {
      // Get sibling by flipping the last bit of the index.
      const siblingIndex = currentIndex ^ 1;
      const siblingKey = `${level}-${siblingIndex}`;
      const siblingHash =
        this.nodes.get(siblingKey) || this.defaultHashes[level];
      proof.push(siblingHash);
      currentIndex = Math.floor(currentIndex / 2);
    }
    return proof;
  }

  /**
   * Verify a Merkle proof for a given leaf key and value.
   * @param key The leaf index.
   * @param value The original value at the leaf (as a Buffer).
   * @param proof An array of Buffer objects representing the Merkle proof.
   * @param root The expected root hash (as a Buffer).
   * @returns True if the proof is valid, false otherwise.
   */
  verifyProof(
    key: number,
    value: Buffer,
    proof: Buffer[],
    root: Buffer
  ): boolean {
    let currentHash = sha256(value);
    let currentIndex = key;
    for (const siblingHash of proof) {
      if (currentIndex % 2 === 0) {
        currentHash = hashPair(currentHash, siblingHash);
      } else {
        currentHash = hashPair(siblingHash, currentHash);
      }
      currentIndex = Math.floor(currentIndex / 2);
    }
    return currentHash.equals(root);
  }
}

// Example usage:
(() => {
  // Create a tree with height 4 (16 leaves).
  const tree = new SparseMerkleTree(4);

  const key = 3;
  const value = Buffer.from("hello world");
  tree.update(key, value);

  const root = tree.getRoot();
  console.log("Root hash:", root.toString("hex"));

  const proof = tree.getProof(key);
  console.log("Merkle Proof:");
  proof.forEach((hash, level) => {
    console.log(` Level ${level}: ${hash.toString("hex")}`);
  });

  const isValid = tree.verifyProof(key, value, proof, root);
  console.log("Is the proof valid?", isValid);
})();
