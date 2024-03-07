import { Schema, model, Document, StringExpressionOperatorReturningArray } from "mongoose"

export type ReposDocument = Document & {
  githubId: String
  url: String,
  name: String,
  visibility: String,
  repo_id: String
}

const reposSchema = new Schema<ReposDocument> ({
  githubId: {type: String, required: true},
  url: {type: String, required: true},
  name: {type: String, required: true},
  visibility: {type: String, required: true},
  repo_id: {type: String, required: true}
})

const Repos = model<ReposDocument>('Repos', reposSchema)

export default Repos;
