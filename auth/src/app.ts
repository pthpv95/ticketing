import express from "express"
import cookieSession from "cookie-session"
import "express-async-errors"
import { json } from "body-parser"
import { currentUserRouter } from "./routes/current-user"
import { signinRouter } from "./routes/signin"
import { signoutRouter } from "./routes/signout"
import { signupRouter } from "./routes/signup"
import { errorHandler, NotFoundError } from "@hptickets/common"

const app = express()
app.set("trust proxy", true)
app.use(json())
app.use(
  cookieSession({
    signed: false,
    secure: false//process.env.NODE_ENV !== "test",
  })
)
app.use(currentUserRouter, signinRouter, signoutRouter, signupRouter)
app.all("*", async () => {
  throw new NotFoundError()
})
app.use(errorHandler)

export { app }
