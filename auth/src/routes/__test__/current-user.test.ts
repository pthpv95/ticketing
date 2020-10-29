import request from "supertest"
import { app } from "../../app"

it("returns info of current user", async () => {
  const cookie = await global.signin()

  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .expect(200)

  expect(response.body.currentUser.email).toEqual("test@gmail.com")
})

it("returns null if not authenticated", async () => {
  const response = await request(app)
    .get("/api/users/currentuser")
    .expect(200)

  expect(response.body.currentUser).toBeNull()
})