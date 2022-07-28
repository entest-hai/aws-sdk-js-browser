# Upload to S3 from Browser using AWS-SDK-JS

AWS-SDK-JS version 3 two modes

- NodeJS
- Browser

for the browser, need to use webpack to package dependencies such as "@aws-sdk/client-s3" into main.js for the index.html. Also need to provide a cognito identity pool so client can be granted to aws services such as uploading to a S3 bucket. Then we can run index.html for uploading files to S3

## Project Structure

```
|--sdk-s3-example
    |--src
      |--config.json
      |--index.html
      |--script.js
    |--package.json
```

package.json

```json
{
  "name": "sdk-s3-example",
  "version": "1.0.0",
  "main": "index.js",
  "repository": "",
  "author": "haimtran",
  "license": "Apache 2.0",
  "scripts": {
    "run": "npx webpack --entry ./script.js --mode development --target web --devtool false -o main.js"
  },
  "dependencies": {
    "@aws-sdk/client-cognito-identity": "^3.32.0",
    "@aws-sdk/client-polly": "^3.32.0",
    "@aws-sdk/client-s3": "^3.32.0",
    "@aws-sdk/credential-provider-cognito-identity": "^3.32.0",
    "@aws-sdk/node-http-handler": "^3.32.0",
    "@aws-sdk/polly-request-presigner": "^3.32.0",
    "package.json": "^2.0.1"
  },
  "devDependencies": {
    "webpack": "^4.46.0",
    "webpack-cli": "^3.3.11"
  }
}
```

## Install Webpack

need to install webpack [HERE](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/webpack.html)

use webpack to package dependencies into main.js for index.html

```bash
npx webpack --entry ./script.js --mode development --target web --devtool false -o main.js
```

## Getting Started with AWS-SDK-JS

configure cognito identity

```js
const client = new S3Client({
  region: config.REGION,
  credentials: fromCognitoIdentityPool({
    client: new CognitoIdentityClient({ region: config.REGION }),
    identityPoolId: config.IdentifyPoolId,
  }),
});
```

list objects in a s3 bucket

```js
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
```

upload an object

```js
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
```

front-end upload button

```js
onst uploadData = async () => {
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
```

## Configure S3 CORS for Local Testing

follow [this](https://docs.aws.amazon.com/AmazonS3/latest/userguide/ManageCorsUsing.html) or [here](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/s3-example-photo-album.html) to setup CORS, this is for local (127.0.0.1) testing
