import express, { Request, Response } from "express"
import { body } from "express-validator"
import {
  authorized,
  NotFoundError,
  UnauthorizedError,
  validateRequest,
} from "@hptickets/common"
import { Ticket } from "../models/tickets"

const router = express.Router()

router.put(
  "/api/tickets/:id",
  authorized,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body
    const ticket = await Ticket.findById({ _id: req.params.id })
    if (!ticket) {
      throw new NotFoundError()
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new UnauthorizedError()
    }

    ticket.set({
      title,
      price,
    })

    await ticket.save()
    return res.send(ticket)
  }
)

export { router as updateTicketRouter }