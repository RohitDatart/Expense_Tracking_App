const mongoose = require("mongoose");

const userschema = new mongoose.Schema(
  {
    user_name: {
      type: String,
      unique:true,
      required: true,
    },
    password:{
        type: String,
      required: true, 
    },
    email: {
      type: String,
    },
    phone_number: {
      type: Number,
    },
    reaming_balance: {
      type: Number,
      required: true,
      default:0,
      min: 0,
    },
    transactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model('User', userschema);

module.exports = User;