import {Document, Schema, model} from "mongoose";
import { type } from "os";


export type UserDocument = Document & {
  githubId: String
}

const userSchema = new Schema<UserDocument>({
  githubId: {type: String, required: true}
})


const User = model<UserDocument>('User', userSchema)

export default User;
