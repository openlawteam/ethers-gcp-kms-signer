import configs from "dotenv";
import { ethers } from "ethers";
import { GcpKmsSigner, TypedDataVersion } from "./signer";
import { recoverTypedSignature } from "./util/signature-utils";

configs.config();

type CouponType = "coupon";

type CouponData = {
  type: CouponType;
  authorizedMember: string;
  amount: string;
  nonce: string;
};

const kmsCredentials = {
  projectId: process.env.KMS_PROJECT_ID,
  locationId: process.env.KMS_LOCATION_ID,
  keyRingId: process.env.KMS_KEY_RING_ID,
  keyId: process.env.KMS_KEY_ID,
  keyVersion: process.env.KMS_KEY_VERSION,
};

describe.skip("sign with Google KMS", () => {
  test("should send a signed transaction using KMS signer", async () => {
    const provider = ethers.providers.InfuraProvider.getWebSocketProvider("goerli", process.env.INFURA_KEY);

    const signer = new GcpKmsSigner(kmsCredentials).connect(provider);

    const tx = await signer.sendTransaction({
      to: "0xEd7B3f2902f2E1B17B027bD0c125B674d293bDA0",
      value: ethers.utils.parseEther("0.001"),
    });

    expect(tx).not.toBeNull();

    /* eslint-disable no-console */
    console.log(tx);
  });

  test("should sign a message with typed data v4", async () => {
    const signer = new GcpKmsSigner(kmsCredentials);
    const signerEthAddress = await signer.getAddress();
    const memberAddress = "0xa9f01aaD34F2aF948F55612d06E51ae46ee08Bd4";

    const couponData: CouponData = {
      type: "coupon" as CouponType,
      authorizedMember: memberAddress,
      amount: "100",
      nonce: "1",
    };

    const domain = {
      name: "Snapshot Message",
      version: "4",
      chainId: 1,
      verifyingContract: "0x0000000000000000000000000000000000000000",
      actionId: "0x2",
    };

    const types = {
      Message: [
        { name: "authorizedMember", type: "address" },
        { name: "amount", type: "uint256" },
        { name: "nonce", type: "uint256" },
      ],
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
        { name: "actionId", type: "address" },
      ],
    };

    const signature = await signer.signTypedData({
      data: {
        types,
        primaryType: "Message",
        domain,
        message: couponData,
      },
      version: TypedDataVersion.V4,
    });

    /* eslint-disable no-console */
    console.log(`Signature: ${signature}`);

    expect(signature).not.toBeNull();

    const recoveredAddress = recoverTypedSignature({
      data: {
        types,
        primaryType: "Message",
        domain,
        message: couponData,
      },
      signature,
      version: TypedDataVersion.V4,
    });

    /* eslint-disable no-console */
    console.log(`Signer Address: ${signerEthAddress}`);
    console.log(`Recovered Address: ${recoveredAddress}`);
    expect(recoveredAddress).toEqual(signerEthAddress);
  });
});
