import { SignTypedDataVersion } from "@metamask/eth-sig-util";
import { validateVersion } from "./signature-utils";

describe("Signature Utils", () => {
  test("should validate the v1 correctly", () => {
    expect(validateVersion(SignTypedDataVersion.V1)).toMatchSnapshot("v1");
  });

  test("should validate the v3 correctly", () => {
    expect(validateVersion(SignTypedDataVersion.V3)).toMatchSnapshot("v3");
  });

  test("should validate the v4 correctly", () => {
    expect(validateVersion(SignTypedDataVersion.V4)).toMatchSnapshot("v4");
  });

  test("should throw an error if the version is not supported", () => {
    expect(() => validateVersion("V5" as SignTypedDataVersion)).toThrow("Invalid version: 'V5'");
  });

  test("should throw an error if no versions are allowed", () => {
    expect(() => validateVersion(SignTypedDataVersion.V1, [])).toThrow(
      "SignTypedDataVersion not allowed: 'V1'. Allowed versions are: "
    );
  });

  test("should throw an error if the version is not allowed", () => {
    expect(() => validateVersion(SignTypedDataVersion.V4, [SignTypedDataVersion.V1, SignTypedDataVersion.V3])).toThrow(
      "SignTypedDataVersion not allowed: 'V4'. Allowed versions are: V1, V3"
    );
  });
});
