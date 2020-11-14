import nats from "node-nats-streaming"
import { TicketCreatedPublisher } from "./events/ticket-created-publisher"

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
})

stan.on("connect", async () => {
  console.log("Connected to NATs")
  const publisher = new TicketCreatedPublisher(stan)
  await publisher.publish({
    id: "1",
    title: "party in the us",
    price: new Date().getTime(),
  })
})
