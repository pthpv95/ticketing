import express from "express"
import cookieSession from "cookie-session"
import "express-async-errors"
import { json } from "body-parser"
import { errorHandler, NotFoundError, currentUser } from "@hptickets/common"
import { newOrderRouter } from "./routes/new"
import { showOrderRouter } from "./routes/show"
import { indexOrderRouter } from "./routes"
import { deleteOrderRouter } from "./routes/delete"

const app = express()
app.set("trust proxy", true)
app.use(json())
app.use(
  cookieSession({
    signed: false,
    secure: false, //process.env.NODE_ENV !== "test",
  })
)
app.use(
  currentUser,
  newOrderRouter,
  showOrderRouter,
  indexOrderRouter,
  deleteOrderRouter
)
app.all("*", async () => {
  throw new NotFoundError()
})
app.use(errorHandler)

export { app }
