import configs from "dotenv";
import { ethers } from "ethers";
import { GcpKmsSigner } from "./signer";

configs.config();

const kmsCredentials = {
  projectId: process.env.KMS_PROJECT_ID,
  locationId: process.env.KMS_LOCATION_ID,
  keyRingId: process.env.KMS_KEY_RING_ID,
  keyId: process.env.KMS_KEY_ID,
  keyVersion: process.env.KMS_KEY_VERSION,
};

describe.skip("sign with Google KMS", () => {
  test("should send a signed transaction using KMS signer", async () => {
    const provider = ethers.providers.InfuraProvider.getWebSocketProvider("rinkeby", process.env.INFURA_KEY);

    const signer = new GcpKmsSigner(kmsCredentials).connect(provider);

    const tx = await signer.sendTransaction({
      to: "0xEd7B3f2902f2E1B17B027bD0c125B674d293bDA0",
      value: ethers.utils.parseEther("0.001"),
    });

    expect(tx).not.toBeNull();

    /* eslint-disable no-console */
    console.log(tx);
  });
});
