import Arweave from "arweave";
import * as fs from "fs";
import wallet from "./data/arweave_wallet.json";

const arweave = Arweave.init({
  host: "www.arweave.run",
  port: 443,
  protocol: "https",
});

(async () => {
  const image = fs.readFileSync("./app/data/icon_pict.png");
  const transaction = await arweave.createTransaction({
    data: image,
  });
  transaction.addTag("Content-Type", "image/png");

  await arweave.transactions.sign(transaction, wallet);
  const response = await arweave.transactions.post(transaction);
  console.log(`response: ${response}`);

  const id = transaction.id;
  const imageUrl = id ? `https://www.arweave.run/${id}` : undefined;
  console.log(`imageUrl: ${imageUrl}`);
})();
