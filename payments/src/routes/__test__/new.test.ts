import { OrderStatus } from "@hptickets/common"
import request from "supertest"
import { app } from "../../app"
import { Order } from "../../models/order"
import { Payment } from "../../models/payment"
import { stripe } from "../../stripe"
import { generateObjectId } from "../../test/setup"

// jest.mock("../../stripe")
it("return a 404 when purchasing an order that does not exist", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      orderId: generateObjectId(),
      token: "12121",
    })
    .expect(404)
})

it("return a 401 when purchasing an order that does not belong to user", async () => {
  const order = Order.build({
    id: generateObjectId(),
    userId: generateObjectId(),
    price: 10,
    status: OrderStatus.Created,
    version: 0,
  })

  await order.save()
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      orderId: order.id,
      token: "12121",
    })
    .expect(401)
})

it("return a 404 when purchasing an cancelled order", async () => {
  const order = Order.build({
    id: generateObjectId(),
    userId: generateObjectId(),
    price: 10,
    status: OrderStatus.Cancelled,
    version: 0,
  })

  await order.save()
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(order.userId))
    .send({
      orderId: order.id,
      token: "12121",
    })
    .expect(400)
})

it("return a 201 when charging order successfully", async () => {
  const price = Math.floor(Math.random() * 10000)
  const order = Order.build({
    id: generateObjectId(),
    userId: generateObjectId(),
    price,
    status: OrderStatus.Created,
    version: 0,
  })

  await order.save()
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(order.userId))
    .send({
      orderId: order.id,
      token: "tok_visa",
    })
    .expect(201)

  const stripeCharges = await stripe.charges.list({ limit: 50 })
  const charge = stripeCharges.data.find(
    (charge) => charge.amount === price * 100
  )
  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: charge!.id,
  })

  expect(charge!.currency).toEqual("usd")
  expect(payment).not.toBeNull()
})
