# Cloud is composed of different services, 
interservice communication is then via redis pub/sub

## 1. Auth service
Handles the authentication of user using Github Oauth
### Routes
`/auth/github`
Start of user sing/singup flow where the user info is ontained from github
And sets up seesion storage for the user

`/auth/github/logout`
It sings out the user and clears the saved session

`/auth/github/current_user`
Has information about the currently singin user or is empty when no user
is singin


## 2. Upload service
Takes the desired project that the user want to deploy
it upload it to s3 bucket

### Routes
`/upload`
uploads the project and publishes a message to redis pub/sub
`Deploy channel with message of username and project name`

## 3. Deploy
It downloads the uploaded project from s3
then builds it locally

### Routes
`/upload`
it subscribes to the **Deloy channel and listens for messages
it builds the project using new process then upload the builded project to s3

## 4. Proxy
its a reverse proxy that routes incoming request
to the dist of the builded project
