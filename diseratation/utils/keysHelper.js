import nacl from "tweetnacl";
import naclUtils from "tweetnacl-util";
nacl.utils = naclUtils;

const decode = (text) => {
  const str = text.startsWith("0x") ? text.substring(2) : text;
  return Buffer.from(str, "hex");
};

const generatekey = () => {
  try {
    const entropy = nacl.randomBytes(64);
    // console.log(entropy)
    return nacl.sign.keyPair.fromSeed(entropy.subarray(0, 32));
  } catch (error) {
    throw new Error(error.message);
  }
};

const convertKeyToBase64 = async (key) => {
  try {
    return nacl.utils.encodeBase64(key);
  } catch (error) {
    throw new Error(error.message);
  }
};

const convertBase64ToKey = (base64Key) => {
  try {
    return nacl.utils.decodeBase64(base64Key);
  } catch (error) {
    throw new Error(error.message);
  }
};

// const createJwtWithSha = async (privateKey, vc, audience=[]) => {
//     try {
//         const message = {
//             payload: Buffer.from(JSON.stringify(vc)).toString('base64'),
//             issuer: vc.credentialSubject.id,
//             audience: audience,
//             timeStamp: Date.now(),
//             exp: Date.now() + 1000000,
//         };
//         const signaturePayload = Uint8Array.from(Buffer.from(JSON.stringify(message),'utf-8'));
//         return Buffer.from(nacl.sign(signaturePayload, convertBase64ToKey(privateKey))).toString('hex');
//     } catch (error) {
//         throw new Error(error.message);
//     }
// };

const createJwt = async (privateKey, vc, audience = []) => {
  try {
    const message = {
      payload: Buffer.from(JSON.stringify(vc)).toString("base64"),
      issuer: vc.credentialSubject.id,
      audience: audience,
      timeStamp: Date.now(),
      exp: Date.now() + 1000000,
    };
    const signaturePayload = Uint8Array.from(
      Buffer.from(JSON.stringify(message), "utf-8"),
    );
    return Buffer.from(
      nacl.sign(signaturePayload, convertBase64ToKey(privateKey)),
    ).toString("hex");
  } catch (error) {
    throw new Error(error.message);
  }
};

const verifyJwt = async (publicKey, signature, payloadOptions) => {
  try {
    const payload = nacl.sign.open(
      Uint8Array.from(decode(signature)),
      convertBase64ToKey(publicKey),
    );
    if (!payload) {
      throw new Error("User Ownership failed");
    }
    const message = JSON.parse(Buffer.from(payload).toString("utf8"));
    if (!message.audience.includes(payloadOptions.audience)) {
      throw new Error("Audience does not match");
    } else if (message.exp < payloadOptions.exp) {
      throw new Error("Token is Expired");
    } else {
      return message;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

// exports.verifyJwt = async (token, hexPublicKey) => {
//     const userPublicKey = Buffer.from((hexPublicKey),'base64').toString('utf8');
//     const edPublicKey = await parseJwk(JSON.parse(userPublicKey), 'EdDSA');
//     const { payload, protectedHeader } = await jwtVerify(token, edPublicKey, {
//         audience: 'did:earthid:testnet:FrzfcwthEU1YubhhfcdscbJkgWvauC8iZWMkEzJQiNga;earthid:testnet:fid=0.0.365755'
//     });
//     // return new SignJWT({ encodedVC: Buffer.from(JSON.stringify(vc)).toString('base64') })
//     //     .setProtectedHeader({ alg: 'EdDSA' })
//     //     .setIssuedAt()
//     //     .setIssuer('did:earthid:testnet:CKmrgKcVEJ9jMYBmeoXuKZQU2fGh1ipLjY51w11HoJCY;earthid:testnet:fid=0.0.365755')
//     //     .setAudience('did:earthid:testnet:FrzfcwthEU1YubhhfcdscbJkgWvauC8iZWMkEzJQiNga;earthid:testnet:fid=0.0.365755')
//     //     .setExpirationTime('2h')
//     //     .sign(privateKey);
//     console.log(payload,protectedHeader);
//     console.log(JSON.parse(Buffer.from(payload.encodedVC,'base64').toString('utf8')));
// };

module.exports = {
  generatekey,
  convertKeyToBase64,
  convertBase64ToKey,
  createJwt,
  verifyJwt,
};
