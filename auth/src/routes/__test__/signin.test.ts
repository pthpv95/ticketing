import request from "supertest"
import { app } from "../../app"

it("fails when a email that does not exist", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@gmail.com",
      password: "123456",
    })
    .expect(400)
})

it("fails when an incorrect password is supplied", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@gmail.com",
      password: "123456",
    })
    .expect(201)

  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@gmail.com",
      password: "wrongpassword",
    })
    .expect(400)
})

it("return valid cookie when credential is supplied", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@gmail.com",
      password: "123456",
    })
    .expect(201)

  const reponse = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@gmail.com",
      password: "123456",
    })
    .expect(201)

  expect(reponse.get("Set-Cookie")).toBeDefined()
})
