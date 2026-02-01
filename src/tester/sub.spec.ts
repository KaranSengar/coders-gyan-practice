import { sum } from "../config/sum";

test.skip("adds 1 + 2 to equal 3", () => {
  expect(sum(1, 2)).toBe(3);
});

test.skip("adds 1 + 4 to equal 5", () => {
  expect(sum(1, 4)).toBe(5);
});

test.skip("adds 1 + 1 to equal 2", () => {
  expect(sum(1, 1)).toBe(2);
});

test.skip("adds 1 + 2 to equal 3", () => {
  expect(sum(1, 22)).toBe(23);
});
