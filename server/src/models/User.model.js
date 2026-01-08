import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["deposit", "withdraw"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "rejected", "approved"],
      default: "pending",
    },
    paymentGateway: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const nicSchema = new mongoose.Schema(
  {
    frontImage: {
      type: String, // store as URL or path
      default: null,
    },
    backImage: {
      type: String, // store as URL or path
      default: null,
    },
  },
  { _id: false }
);

const bandkDepositSchema = mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },

  payment_id: {
    type: String,
    required: true,
  },

  bankName: {
    type: String,
    required: true,
    trim: true,
  },

  accountNumber: {
    type: String,
    required: true,
    trim: true,
  },

  proofImage: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending",
  },

  depositedAt: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    status: {
      type: String,
      enum: ["inActive", "active", "pending", "rejected"],
      default: "inActive",
    },

    funds: {
      type: Number,
      default: 0,
      min: 0,
    },
    // funds_before: { type: Number },
    // funds_after: { type: Number },

    transactions: {
      type: [transactionSchema],
      default: [],
    },

    nic: {
      type: nicSchema,
      default: {},
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    bankDeposits: {
      type: [bandkDepositSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
