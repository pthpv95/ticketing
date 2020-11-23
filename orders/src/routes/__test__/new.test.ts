import mongoose from "mongoose"
import request from "supertest"
import { app } from "../../app"
import { Order, OrderStatus } from "../../models/order"
import { Ticket } from "../../models/ticket"
import { natsWrapper } from "../../nats-wrapper"

it("return an error if the ticket does not exist", async () => {
  const ticketId = new mongoose.Types.ObjectId()
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
      ticketId,
    })
    .expect(404)
})

it("return an error if the ticket is already reserved", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "chelsea vs mu",
    price: 100,
  })
  await ticket.save()
  const reservedOrder = Order.build({
    status: OrderStatus.Created,
    ticket,
    userId: "123",
    expiresAt: new Date(),
  })
  await reservedOrder.save()

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
      ticketId: ticket.id,
    })
    .expect(400)
})

it("reserved a ticket", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "super sunday",
    price: 100,
  })
  await ticket.save()

  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
      ticketId: ticket.id,
    })
    .expect(201)

  expect(response.body.ticket.id).toEqual(ticket.id)
})

it("emits an order created event", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "super sunday",
    price: 100,
  })
  await ticket.save()

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
      ticketId: ticket.id,
    })
    .expect(201)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
