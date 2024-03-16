import {S3} from "aws-sdk"
import fs from "fs"
import path from "path"
import dotenv from "dotenv"

dotenv.config()

const s3 = new S3({
  accessKeyId: process.env.R2_ACCESS_KEY,
  secretAccessKey: process.env.R2_SECRET_KEY,
  endpoint: process.env.R2_ENDPOINT
})

export const uploadDir = (dir_path: string, callback: (fname: string, fpath: string) => void) => {
  const allfiles = fs.readdirSync(dir_path)
  console.log("dir_path is: ", dir_path)
  console.log("allfiles", allfiles)

  allfiles.forEach(file => {
    const file_path = path.join(dir_path, file)
    console.log("full path is: ", file_path)
    if (file == '.git') {
      console.log("file is git: ", file)
    } else {
        if (fs.statSync(file_path).isDirectory()) {
          uploadDir(file_path, callback)
        }else {
          callback(file_path, dir_path)
        }
    }
  })
  
}

export const uploadFile = async (fname: string, fpath: string) => {
  const fcontent = fs.readFileSync(fname)
  
  try {
     const rsp = await s3.upload({
      Body: fcontent,
      Bucket: "cloudly-bucket",
      Key: fname
    }).promise()

    console.log(rsp)   
  } catch (error) {
    console.error(error)
  }

}
