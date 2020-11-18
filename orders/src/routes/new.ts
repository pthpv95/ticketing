import mongoose from "mongoose"
import {
  authorized,
  BadRequestError,
  NotFoundError,
  OrderStatus,
} from "@hptickets/common"
import express, { Request, Response } from "express"
import { body } from "express-validator"
import { Ticket } from "../models/ticket"
import { Order } from "../models/order"
const EXPIRATION_WINDOWS_SECONDS = 15 * 60
const router = express.Router()
router.post(
  "/api/orders",
  authorized,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("Ticket must be provided"),
  ],
  async (req: Request, res: Response) => {
    const { ticketId } = req.body
    const ticket = await Ticket.findById(ticketId)
    if (!ticket) {
      throw new NotFoundError()
    }
    const existingOrder = await ticket.isReserved()
    if (existingOrder) {
      throw new BadRequestError("Ticket has been reserved.")
    }

    const expiration = new Date()
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOWS_SECONDS)

    const order = Order.build({
      userId: req.currentUser!.id,
      ticket,
      status: OrderStatus.Created,
      expiresAt: expiration,
    })

    await order.save()
    res.status(201).send(order)
  }
)

export { router as newOrderRouter }
