import request from "supertest"
import { app } from "../../app"
import { Ticket } from "../../models/tickets"

const createTicket = () => {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "iPhoneX", price: 10 })
    .expect(201)
}
it("returns the list of tickets", async () => {
  await createTicket()
  await createTicket()
  await createTicket()

  const tickets = await Ticket.find({})
  const response = await request(app).get("/api/tickets").send()
  expect(response.body.length).toEqual(3)
})
