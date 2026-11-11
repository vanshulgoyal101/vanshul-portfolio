// Returns one item of a non-empty list, chosen uniformly at random.
export const pickRandom = (items, random = Math.random) =>
  items[Math.min(items.length - 1, Math.floor(random() * items.length))];
