import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"
import jwt from "jsonwebtoken"

export const generateObjectId = () => new mongoose.Types.ObjectId().toHexString()

declare global {
  namespace NodeJS {
    interface Global {
      signin(id?: string): string
    }
  }
}
jest.mock("../nats-wrapper")
let mongo: any
process.env.STRIPE_KEY =
  "sk_test_51HsKgxCvBQyKOtfZMCLtHDAWAOfuRDhcXvmLARKfkxC8JR38KMQmsKlqybGaxi7FtXyG71F4awiayJhjpST1WKOx003zHtJXOv"
  
beforeAll(async () => {
  process.env.JWT_KEY = "123"
  mongo = new MongoMemoryServer()
  const mongoUri = await mongo.getUri()
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
})

beforeEach(async () => {
  jest.clearAllMocks()
  const collections = await mongoose.connection.db.collections()
  for (let collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  await mongo.stop()
  await mongoose.connection.close()
})

global.signin = (id?: string) => {
  const payload = {
    id: id || generateObjectId(),
    email: "test@gmail.com",
  }

  const token = jwt.sign(payload, process.env.JWT_KEY!)
  const session = { jwt: token }
  const sessionJSON = JSON.stringify(session)
  const base64 = Buffer.from(sessionJSON).toString("base64")

  return `express:sess=${base64}`
}
