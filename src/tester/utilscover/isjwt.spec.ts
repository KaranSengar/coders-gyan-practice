import { isjwt } from "../../utils/index";

describe("isjwt function", () => {
  it("returns false for null token", () => {
    expect(isjwt(null)).toBe(false);
  });

  it("returns false for invalid token format", () => {
    expect(isjwt("invalid.token")).toBe(false);
  });

  it("returns true for valid token", () => {
    const validToken = "abc.def.ghi"; // simple 3-part token
    expect(isjwt(validToken)).toBe(true);
  });


});
