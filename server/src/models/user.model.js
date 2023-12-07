import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "user name is required"],
      minLength: [5, "Name must be at least 5 char"],
      maxLength: [50, "Name must be at less than 50 char"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "already registered"],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      select: false, // by default agar user mango ge to password nhi milega ise explicitly mangna padega
    },
    forgetPasswordToken: {
      type: String,
    },
    forgetPasswordExpiry: {
      type: String,
    },
    forgetPasswordDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next(); // stop fn
  }
  this.password = await bcrypt.hash(this.password, 10);
  return next();
});

// userSchema me ek method banaya 'jwtToken' wo return krega Jwt.sign() // sign() payload, SECRET key, Buffer(expiry time) leta h
userSchema.method = {
  jwtToken() {
    return Jwt.sign(
        { id: this._id, email: this.email }, 
        process.env.SECRET, 
        { expiresIn: "24h" });
  },
};

export const User = mongoose.model("User", userSchema);
