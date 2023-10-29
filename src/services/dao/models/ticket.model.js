import mongoose from "mongoose";

const ticketsCollection = "tickets";

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  purchase_datetime: Date,
  amount: Number,
  purchaser: {
    type: String,
    required: true,
    unique: false,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
      quantity: { type: Number, default: 1 },
    },
  ],
});

const ticketModel = mongoose.model(ticketsCollection, ticketSchema);
export default ticketModel;
