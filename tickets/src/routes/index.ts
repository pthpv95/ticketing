import { NotFoundError } from "@hptickets/common"
import express, { Request, Response } from "express"
import { Ticket } from "../models/tickets"

const router = express.Router()

router.get("/api/tickets", async (req: Request, res: Response) => {
  const ticket = await Ticket.find({})

  if (!ticket) {
    throw new NotFoundError()
  }

  res.status(201).send(ticket)
})

export { router as indexTicketsRouter }
