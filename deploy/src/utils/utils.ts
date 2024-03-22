import { throws } from "assert"
import { S3 } from "aws-sdk"
import fs from "fs"
import dotenv from "dotenv"
import path, { dirname, resolve } from "path"
import { error, trace } from "console"
import { exec } from "child_process"

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

export const buildProject = (fname: string) => {
  console.log("Start building...:", fname)
  console.log(__dirname) // /home/ayub/prod/cloudly/deploy/build/utils
  return new Promise((resolve) => {
    const child = exec(`cd ${path.join(__dirname, `repos/${fname}`)} && npm install && npm run build`)

    child.stdout?.on('data', data => console.log(data))
    child.stderr?.on('error', data => console.log(data))
    child.on('close', (code) => resolve("Done building"))
  })
}



export const uploadDir = (dir_path: string, callback: (fname: string, fpath: string) => void) => {
  const allfiles = fs.readdirSync(dir_path)

  allfiles.forEach(file => {
    const file_path = path.join(dir_path, file)
    if (file == '.git') {
    } else {
        if (fs.statSync(file_path).isDirectory()) {
          uploadDir(file_path, callback)
        }else {
          callback(file_path, dir_path)
        }
    }
  })
  
}

// /home/ayub/prod/cloudly/upload/src/utils
// /home/ayub/prod/cloudly/upload/repos/ayubsh/alx-backend-storage/0x00-MySQL_Advanced/0-uniq_users.sql

export const uploadFile = async (fname: string, fpath: string) => {
  const fcontent = fs.readFileSync(fname)
  const dirname_len = __dirname.length + 1
  const sliced_path = fname.slice(dirname_len + 6)
  console.log(sliced_path)
  
  try {
     const rsp = await s3.upload({
      Body: fcontent,
      Bucket: "cloudly-bucket",
      Key: `output/${sliced_path}`
    }).promise()

    console.log(rsp)   
  } catch (error) {
    console.error(error)
  }
}
