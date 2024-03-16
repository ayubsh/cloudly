import {S3} from "aws-sdk"
import fs from "fs"
import path from "path"

const s3 = new S3({
  accessKeyId: process.env.R2_ACCESS_KEY,
  secretAccessKey: process.env.R2_SECRET_KEY,
  endpoint: process.env.R2_ENDPOINT
})


export const uploadDir = (dir_path: string, callback: (fname: string, fpath: string) => void) => {
  const allfiles = fs.readdirSync(dir_path)

  allfiles.forEach(file => {
    const file_path = path.join(dir_path, file)
    if (fs.statSync(file_path).isDirectory()) {
      uploadDir(file_path, callback)
    }else {
      callback(file, file_path)
    }
  })
}

export const uploadFile = async (fname: string, fpath: string) => {
  const fcontent = fs.readdirSync(fname)
  
  const rsp = await s3.upload({
    Body: fcontent,
    Bucket: "cloudly-bucket",
    Key: fname
  }).promise()

  console.log(rsp)
}
