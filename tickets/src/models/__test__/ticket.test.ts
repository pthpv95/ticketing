import { Ticket } from "../tickets"

it("implements optimistic concurrency control", async (done) => {
  const ticket = Ticket.build({
    title: "hello",
    price: 100,
    userId: "122",
  })

  await ticket.save()

  const firstInstance = await Ticket.findById(ticket.id)
  const secondInstance = await Ticket.findById(ticket.id)

  firstInstance!.set({ price: 10 })
  secondInstance!.set({ price: 20 })

  await firstInstance!.save()
  try {
    await secondInstance!.save()
  } catch (error) {
    return done()
  }
})


it('increments the version number on multiple saves', async() => {
  const ticket = Ticket.build({
    title: "hello",
    price: 100,
    userId: "122",
  })

  await ticket.save()
  expect(ticket.version).toEqual(0)
  await ticket.save()
  expect(ticket.version).toEqual(1)
})