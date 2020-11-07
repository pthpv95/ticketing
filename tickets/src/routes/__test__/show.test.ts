import request from "supertest"
import { app } from "../../app"
import { generateObjectId } from "../../helpers/generate-objectId"

it("return 404 if the ticket is not found", async () => {
  const id = generateObjectId()
  const response = await request(app).get(`/api/tickets/${id}`).send({})
  expect(response.status).toEqual(404)
})

it("return the ticket if it is found", async () => {
  const title = "iPhone"
  const price = 10  

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title, price })
    .expect(201)

  const ticketResponse = await request(app).get(
    `/api/tickets/${response.body.id}`
  ).expect(201)

  expect(ticketResponse.body.price).toEqual(price)
  expect(ticketResponse.body.title).toEqual(title)
})
