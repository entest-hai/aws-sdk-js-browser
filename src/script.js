// haimtran 27 JUL 2022
// aws sdk s3 client
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import {
  S3Client,
  ListObjectsCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import config from "./config.json";

console.log(config);

const client = new S3Client({
  region: config.REGION,
  credentials: fromCognitoIdentityPool({
    client: new CognitoIdentityClient({ region: config.REGION }),
    identityPoolId: config.IdentifyPoolId,
  }),
});

const listObjects = async () => {
  try {
    const data = await client.send(
      new ListObjectsCommand({ Bucket: config.BUCKET })
    );
    console.log(data);
  } catch (error) {
    console.log(error);
    return alert("ERROR");
  }
};

const uploadObject = async (file) => {
  try {
    const res = await client.send(
      new PutObjectCommand({
        Bucket: config.BUCKET,
        Key: `svg/${file.name}`,
        Body: file,
      })
    );
    console.log(res);
  } catch (error) {
    console.log("error upload file to s3 ...", error);
  }
};

const uploadData = async () => {
  const input = document.getElementById("upload");
  const files = input.files;

  if (files.length > 0) {
    console.log("upload file, ", files[0]);
    await uploadObject(files[0]);
  } else {
    alert("please select a file");
  }
};

window.listObjects = listObjects;
window.uploadData = uploadData;
window.uploadObject = uploadObject;
