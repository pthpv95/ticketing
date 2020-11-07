import request from "supertest"
import { app } from "../../app"
import { Ticket } from "../../models/tickets"

it("has a route handler listening to /api/tickets for post request", async () => {
  const response = await request(app).post("/api/tickets")
  expect(response.status).not.toEqual(404)
})

it("can only be accessed if the user is signed in", async () => {
  const response = await request(app).post("/api/tickets")
  expect(response.status).toEqual(401)
})

it("returns a status other than 401 the user is signed in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
  expect(response.status).not.toEqual(401)
})

it("return an error if an invalid title is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "", price: 10 })
    .expect(400)

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "3121" })
    .expect(400)
})

it("return an error if an invalid price is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "iPhone" })
    .expect(400)

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "iPhone", price: -10 })
    .expect(400)
})

it("create ticket with valid input", async () => {
  let tickets = await Ticket.find({})
  expect(tickets.length).toEqual(0)
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "iPhone", price: 10 })
    .expect(201)

  tickets = await Ticket.find({})
  expect(tickets.length).toEqual(1)
  expect(tickets[0].title).toEqual("iPhone")
  expect(tickets[0].price).toEqual(10)
})
