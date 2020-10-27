import express from "express"
import cookieSession from 'cookie-session'
import "express-async-errors"
import { json } from "body-parser"
import mongoose from "mongoose"
import { currentUserRouter } from "./routes/current-user"
import { signinRouter } from "./routes/signin"
import { signoutRouter } from "./routes/signout"
import { signupRouter } from "./routes/signup"
import { errorHandler } from "./middlewares/error-handler"
import { NotFoundError } from "./errors/not-found-error"

const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(cookieSession({
  signed: false,
  secure: true
}))
app.use(currentUserRouter, signinRouter, signoutRouter, signupRouter)
app.all("*", async () => {
  throw new NotFoundError()
})
app.use(errorHandler)

const start = async () => {
  if(!process.env.JWT_KEY){
    throw new Error('JWT_KEY must be defined')
  }
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
  } catch (error) {
    console.log(error)
  }

  app.listen(3000, () => {
    console.log("listening on 3000 !!!!")
  })
}

start()
