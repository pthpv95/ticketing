import { OrderStatus } from "@hptickets/common"
import request from "supertest"
import { app } from "../../app"
import { Order } from "../../models/order"
import { Ticket } from "../../models/ticket"

it("update status of order to cancelled", async () => {
  const ticket = Ticket.build({
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
    .delete(`/api/orders/${body.id}`)
    .set("Cookie", user)
    .send()
    .expect(204)

  const updatedOrder = await Order.findById(body.id)
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it.todo("emits an order cancelled event")
