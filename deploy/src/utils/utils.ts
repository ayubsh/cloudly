import { S3 } from "aws-sdk"
import fs from "fs"
import dotenv from "dotenv"
import path, { dirname, resolve } from "path"
import mime from "mime-types"
import Jabber from "jabber"
import { createClient } from "redis"


import { exec } from "child_process"

dotenv.config()

const publisher = createClient()
.on("error", err => console.error("eror on pulishing generateName: ", err))
.on('ready', () => console.log("ready to publish"))
publisher.connect()

const j = new Jabber()
const RANDOM_WORD = j.createWord(4)

const s3 = new S3({
  accessKeyId: process.env.R2_ACCESS_KEY,
  secretAccessKey: process.env.R2_SECRET_KEY,
  //endpoint: process.env.R2_ENDPOINT
})


export async function dowloadFiles(prefix: string) {
  console.log(prefix)
    const params = {
      Bucket: "cloudly-bucket",
      Prefix: `repos/${prefix}`
    }


    const allFiles = await s3.listObjectsV2(params).promise();
    
    // 
    const allPromises = allFiles.Contents?.map(async ({Key}) => {

    console.log(Key)
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

    await Promise.all(allPromises?.filter(x => x !== undefined));
    console.log("awaiting");
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

const generateName = (fname: string) => {
  const splited = fname.split("/");
  const uname = splited[0]
  const rname = splited[1]
  const len_of_rname_unama = uname.length + rname.length;
  const res_of_fname = fname.slice(len_of_rname_unama + 2)
  publisher.publish("url", `http://${uname}-${RANDOM_WORD}.localhost:5003/`)
  return `${uname}-${RANDOM_WORD}/${res_of_fname}`
}
// /home/ayub/prod/cloudly/upload/src/utils
// /home/ayub/prod/cloudly/upload/repos/ayubsh/alx-backend-storage/0x00-MySQL_Advanced/0-uniq_users.sql

export const uploadFile = async (fname: string, fpath: string) => {
  const fcontent = fs.readFileSync(fname)
  const sliced_path = fname.slice(__dirname.length + 7)
  //console.log(sliced_path) // ayubsh/test-project-for-cloudly/dist/assets/index-BPgokE0a.js
  console.log(generateName(sliced_path))

  let fextension = path.extname(fname).split(".")[1]
  let content_type = ""

  if (fextension === "js"){
    content_type = "application/javascript"
  }else {
    fextension = `text/${fextension}`
  }
  
  try {
     const rsp = await s3.upload({
      Body: fcontent,
      Bucket: "cloudly-bucket",
      Key: `output/${generateName(sliced_path)}`,
      ContentType: `${mime.lookup(fname)}`
    }).promise()

    console.log(rsp)   
  } catch (error) {
    console.error(error)
  }
}
