import {S3} from "aws-sdk"
import fs from "fs"
import path from "path"
import dotenv from "dotenv"
import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3"

dotenv.config()

const s3 = new S3({
  accessKeyId: process.env.R2_ACCESS_KEY,
  secretAccessKey: process.env.R2_SECRET_KEY,
  endpoint: process.env.R2_ENDPOINT
})

/*
export const s3 = new S3Client({
  region: "auto",
  endpoint: `${process.env.R2_ENDPOINT}`,
  credentials: {
    accessKeyId: `${process.env.R2_ACCESS_KEY}`,
    secretAccessKey: `${process.env.R2_SECRET_KEY}`
  }
})
*/

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
  const sliced_path = fname.slice(dirname_len - 10)
  console.log(sliced_path)
  
  try {
     const rsp = await s3.upload({
      Body: fcontent,
      Bucket: "cloudly-bucket",
      Key: sliced_path
    }).promise()

    console.log(rsp)   
  } catch (error) {
    console.error(error)
  }

}
