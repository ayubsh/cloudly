interface GitHubUrlDataI {
  username: string
  reponame: string
}

export const getName = (url: String): GitHubUrlDataI | null => {
  const userNameRegex: RegExp = /^https:\/\/github.com\/([^/]+)\//
  const repoNameRegex: RegExp = /^https:\/\/github.com\/[^/]+\/([^/]+)\.git$/;

  const username = url.match(userNameRegex)
  const reponame = url.match(repoNameRegex)

  if (username && reponame){
    return {
        reponame: reponame[1] as string,
        username: username[1] as string,
      }
  } else {
    return null
  }
}
