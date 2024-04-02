function myFunction() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

const logout = async() => {
  await fetch("http://localhost:5000/auth/github/logout")
  window.redirect("/")
}
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

function handleEnterPress(event) {
    if (event.keyCode === 13) {
      // Get the entered repo name
    const input = document.getElementById("input-datalist")
      const repoName = input.value;
      const repourl = repoName.split(" ")[1]
      input.value = "";
      handleRepoClick(repourl)
    }
  }

const handlerRepoRefresh = async () => {
  const rsp = await fetch("http://localhost:5000/repos", {
    credentials: 'include',
  })
  window.location.reload()
  console.log(rsp)
}
