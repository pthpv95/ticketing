import mongoose from "mongoose"
import request from "supertest"
import { app } from "../../app"
import { Ticket } from "../../models/ticket"

it("fetches the order", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  })
  await ticket.save()

  const user = global.signin()
  const { body } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({
      ticketId: ticket.id,
    })
    .expect(201)

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${body.id}`)
    .set("Cookie", user)
    .send({
      ticketId: ticket.id,
    })
    .expect(200)

  expect(fetchedOrder.id).toEqual(body.id)
})

it("return error if user try to fetch order belonged to other", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  })
  await ticket.save()

  const user = global.signin()
  const { body } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({
      ticketId: ticket.id,
    })
    .expect(201)

  await request(app)
    .get(`/api/orders/${body.id}`)
    .set("Cookie", global.signin())
    .send({
      ticketId: ticket.id,
    })
    .expect(401)
})
