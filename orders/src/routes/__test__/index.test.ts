import request from "supertest"
import { app } from "../../app"
import { Ticket } from "../../models/ticket"

const createTicket = async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  })
  await ticket.save()
  return ticket
}
it("fetch orders belong to particular user", async () => {
  const ticket1 = await createTicket()
  const ticket2 = await createTicket()
  const ticket3 = await createTicket()

  const user1 = global.signin()
  const user2 = global.signin()

  await request(app)
    .post("/api/orders")
    .set("Cookie", user1)
    .send({
      ticketId: ticket1.id,
    })
    .expect(201)

  const { body: orderOne } = await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({
      ticketId: ticket2.id,
    })
    .expect(201)

  const { body: orderTwo } = await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({
      ticketId: ticket3.id,
    })

  const response = await request(app).get("/api/orders").set("Cookie", user2)
  expect(response.body.length).toEqual(2)
  expect(response.body[0]).toEqual(orderOne)
  expect(response.body[1]).toEqual(orderTwo)
  expect(response.body[0].ticket.id).toEqual(ticket2.id)
})
