import { throws } from "assert"
import { S3 } from "aws-sdk"
import fs from "fs"
import dotenv from "dotenv"
import path, { dirname } from "path"
import { error, trace } from "console"

dotenv.config()

const s3 = new S3({
  accessKeyId: process.env.R2_ACCESS_KEY,
  secretAccessKey: process.env.R2_SECRET_KEY,
  endpoint: process.env.R2_ENDPOINT
})

/*
export const dowloadFiles = async (fname: string) => {
  const params = {
    Bucket: "cloudly-bucket",
    Prefix: `repos/${fname}`
  }

  s3.listObjectsV2(params, (err, data) => {
    if(err) throw err;

    data.Contents?.map(file => {
      let params = {
        Bucket: "cloudly-bucket",
        Key: `${file.Key}`
      }

      if(file.Key?.endsWith('/')){
            const finalOutputPath = path.join(__dirname, file.Key!);
            const outputFile = fs.createWriteStream(finalOutputPath);
            const dirName = path.dirname(finalOutputPath);
            if (!fs.existsSync(dirName)){
                fs.mkdirSync(dirName, { recursive: true });
            }
            s3.getObject(params).createReadStream().pipe(outputFile).on("close", () => console.log("Done"))
      //  Key: 'repos/ayubsh/ayubsh/README.md',


        }
     })
  })
}

*/


export async function dowloadFiles(prefix: string) {
  console.log(prefix)
    const params = {
      Bucket: "cloudly-bucket",
      Prefix: `repos/${prefix}`
    }


    const allFiles = await s3.listObjectsV2(params).promise();
    
    // 
    const allPromises = allFiles.Contents?.map(async ({Key}) => {
        return new Promise(async (resolve) => {
            if (!Key) {
                resolve("");
                return;
            }
            const finalOutputPath = path.join(__dirname, Key);
            const outputFile = fs.createWriteStream(finalOutputPath);
            const dirName = path.dirname(finalOutputPath);
            if (!fs.existsSync(dirName)){
                fs.mkdirSync(dirName, { recursive: true });
            }
            s3.getObject({
                Bucket: "cloudly-bucket",
                Key
            }).createReadStream().pipe(outputFile).on("finish", () => {
                resolve("");
            })
        })
    }) || []
    console.log("awaiting");

    await Promise.all(allPromises?.filter(x => x !== undefined));
}
