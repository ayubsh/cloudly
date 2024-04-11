import {Document, Schema, model} from "mongoose";


export type Url = Document & {
  user_id: string
  url: string
}

const Url = new Schema<Url>({
  url: {type: String, required: true},
  user_id: {type: String, required: true}
})


const UrlProj = model<Url>('Url', Url)

export default UrlProj;
