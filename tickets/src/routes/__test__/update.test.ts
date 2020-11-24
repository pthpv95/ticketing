import mongoose from "mongoose"
import request from "supertest"
import { app } from "../../app"
import { generateObjectId } from "../../helpers/generate-objectId"
import { Ticket } from "../../models/tickets"
import { natsWrapper } from "../../nats-wrapper"

it("return a 404 if the provided does not exist", async () => {
  const id = generateObjectId()
  const response = await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({ title: "122", price: 10 })

  expect(response.status).toEqual(404)
})

it("return a 401 if the user is not authenticated", async () => {
  const id = generateObjectId()
  const response = await request(app).put(`/api/tickets/${id}`)
  expect(response.status).toEqual(401)
})

it("return a 404 if the user does own the ticket", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "tit", price: 100 })

  const updateTicketResponse = await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({ title: "122", price: 5 })

  expect(updateTicketResponse.status).toEqual(401)
})

it("return a 400 if the user provide invalid title or price", async () => {
  const response = await request(app)
    .put(`/api/tickets/${generateObjectId()}`)
    .set("Cookie", global.signin())
    .send({})

  expect(response.status).toEqual(400)
})

it("return a 201 if ticket is updated successfully", async () => {
  const cookie = global.signin()
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "title", price: 100 })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "title updated", price: 500 })
    .expect(200)

  const getTicketRes = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
  expect(getTicketRes.body.title).toEqual("title updated")
  expect(getTicketRes.body.price).toEqual(500)
})

it("publishes an event after update ticket successful", async () => {
  const cookie = global.signin()
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "title", price: 100 })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "title updated", price: 500 })
    .expect(200)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})

it("throw error when ticket is already reserved", async () => {
  const cookie = global.signin()
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "title", price: 100 })

  const ticket = await Ticket.findById(response.body.id)
  const orderId = new mongoose.Types.ObjectId().toHexString()
  ticket!.set({ orderId })
  await ticket!.save()

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "title updated", price: 500 })
    .expect(400)
})
