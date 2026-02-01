import { sum } from "../../config/sum";  // file ka path

describe("sum function", () => {
    it("should add two numbers correctly", () => {
        expect(sum(2, 3)).toBe(5);
        expect(sum(-1, 1)).toBe(0);
    });
    
    it("should handle negative numbers", () => {
        expect(sum(-5, -3)).toBe(-8);
        expect(sum(-2, 4)).toBe(2);
    });

    it("should handle zeros", () => {
        expect(sum(0, 0)).toBe(0);
        expect(sum(0, 5)).toBe(5);
    });
});

