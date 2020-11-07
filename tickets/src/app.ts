import express from "express"
import cookieSession from "cookie-session"
import "express-async-errors"
import { json } from "body-parser"
import { errorHandler, NotFoundError, currentUser } from "@hptickets/common"
import { createTicketRouter } from "./routes/new"
import { showTicketsRouter } from "./routes/show"
import { indexTicketsRouter } from "./routes"
import { updateTicketRouter } from "./routes/update"

const app = express()
app.set("trust proxy", true)
app.use(json())
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
)
app.use(
  currentUser,
  createTicketRouter,
  showTicketsRouter,
  indexTicketsRouter,
  updateTicketRouter
)
app.all("*", async () => {
  throw new NotFoundError()
})
app.use(errorHandler)

export { app }
