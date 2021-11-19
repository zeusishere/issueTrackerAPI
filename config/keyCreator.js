const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
console.log("*****  ", path.join(__dirname, "../file", "/publicRSAkey.pem"));
function genKeyPair() {
  const keyPair = crypto.generateKeyPairSync("rsa", {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: "pkcs1", // public key cryptography Standards 1
      format: "pem", // Most common formatting choice
    },
    privateKeyEncoding: {
      type: "pkcs1", // "public key cryptography Standards 1"
      format: "pem", // Most common formatting choice
    },
  });
  //   create the public key file
  fs.writeFileSync(
    path.join(__dirname, "../file", "/publicRSAkey.pem"),
    keyPair.publicKey
  );
  //   create the private key file
  fs.writeFileSync(
    path.join(__dirname, "../file", "/privateRSAkey.pem"),
    keyPair.privateKey
  );
}

// calling the fn to generate the keyPair
genKeyPair();
