import Arweave from "arweave";
import wallet from "./data/arweave_wallet.json";
import metadata from "./data/metadata.json";

const arweave = Arweave.init({
  host: "www.arweave.run",
  port: 443,
  protocol: "https",
});

(async () => {
  const metadataRequest = JSON.stringify(metadata);
  const metadataTransaction = await arweave.createTransaction({
    data: metadataRequest,
  });
  metadataTransaction.addTag("Content-Type", "application/json");

  await arweave.transactions.sign(metadataTransaction, wallet);
  const response = await arweave.transactions.post(metadataTransaction);
  console.log(response);
  return response;
})();
