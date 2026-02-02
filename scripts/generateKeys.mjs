import crypto from "crypto";
import fs from "fs";

const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: "pkcs1",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs1",
    format: "pem",
  },
});

// normal files (optional)
fs.writeFileSync("certs/private.pem", privateKey);
fs.writeFileSync("certs/public.pem", publicKey);

// 🔥 base64 version (IMPORTANT)
//const privateBase64 = Buffer.from(privateKey).toString("base64");
//const publicBase64 = Buffer.from(publicKey).toString("base64");

//fs.writeFileSync("certs/private.base64", privateBase64);
//fs.writeFileSync("certs/public.base64", publicBase64);

//console.log("✅ Keys generated in base64 format");
