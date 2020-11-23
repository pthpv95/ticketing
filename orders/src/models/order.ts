import mongoose from "mongoose"
import { OrderStatus } from "@hptickets/common"
import { TicketDoc } from "./ticket"
import { updateIfCurrentPlugin } from "mongoose-update-if-current"

interface OrderAttrs {
  status: OrderStatus
  userId: string
  expiresAt: Date
  ticket: TicketDoc
}

interface OrderDoc extends mongoose.Document {
  status: OrderStatus
  userId: string
  expiresAt: Date
  version: number
  ticket: TicketDoc
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = doc._id
        delete ret._id
      },
    },
  }
)

orderSchema.set("versionKey", "version")
orderSchema.plugin(updateIfCurrentPlugin)

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs)
}

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema)
export { Order, OrderStatus }
