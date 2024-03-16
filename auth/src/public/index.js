const handleRepoClick = async (repoName) => {
  const url = "http://localhost:5001/upload"
  const bdy = {
    url: repoName
  }
  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bdy)
    })
  
  } catch (error) {
    console.error(error)
  }
 }
