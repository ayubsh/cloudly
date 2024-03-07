import {Document, Schema, model} from "mongoose";


export type UserDocument = Document & {
  githubId: String,
  repo_url: String
}

const userSchema = new Schema<UserDocument>({
  githubId: {type: String, required: true},
  repo_url: {type: String, required: true}
})


const User = model<UserDocument>('User', userSchema)

export default User;
