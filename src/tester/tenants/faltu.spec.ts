import { add } from "../../config/sum";

describe("add function", () => {
    it("should add positive numbers correctly", () => {
        expect(add(2, 3)).toBe(5);
        expect(add(22, 3)).toBe(25);
    });

    it("should handle negative numbers", () => {
        expect(add(-1, 1)).toBe(0);
        expect(add(-5, -3)).toBe(-8);
    });

    it("should handle zeros", () => {
        expect(add(0, 0)).toBe(0);
        expect(add(0, 5)).toBe(5);
    });
});
