import axios from "axios";
import { Router, Response, Request } from "express";
import Repos from "../models/Repos";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const url = req.user?.repo_url as ""

  try {
    
    const rsp = await axios.get(url)
    const rsp_data = await rsp.data
    //@ts-ignore
    const create_Repos = []

    //@ts-ignore
    rsp_data.map(repo => {
      create_Repos.push({
        githubId: repo.owner.id,
        url: repo.clone_url,
        visibility: repo.visibility,
        name: repo.name,
        repo_id: repo.id
      })
    })

    //@ts-ignore
    create_Repos.map(async (repo) => {
      const found = await Repos.findOne({repo_id: repo.repo_id})
      if(found){
        console.log("is in the db")
      }else {
        const inserted_repo = await Repos.create({...repo})
        console.log("inserted_repo: ", inserted_repo)
      }
    })

    //@ts-ignore
    res.send()
  } catch (error) {
    res.send(error)
  }

})


router.get("/all", async (req: Request, res: Response) => {
  try {
    const githubId = req.user?.githubId
    const repos = await Repos.find({githubId})

    res.send(repos)
  } catch (error) {
    res.send(error)
  }
})
export default router;
