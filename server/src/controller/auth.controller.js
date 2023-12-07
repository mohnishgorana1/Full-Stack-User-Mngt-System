import * as EmailValidator from "email-validator";
import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";

const signup = async (req, res, next) => {
  // destructure req.body
  // Validations: all field are req, email-validation, password and confirmPass match,
  // save to db: make new User in User model and take user info for further use

  const { name, email, password, confirmPassword } = req.body;

  if ((!name, !email, !password, !confirmPassword)) {
    return res.send(400).json({
      success: false,
      message: "Every field is required",
    });
  }

  const validEmail = EmailValidator.validate(email);
  if (!validEmail) {
    return res.send(400).json({
      success: false,
      message: "Please enter valid email",
    });
  }

  if (password !== confirmPassword) {
    return res.send(400).json({
      success: false,
      message: "password and confirm Password does not match ❌",
    });
  }

  try {
    const userInfo = new User(req.body);
    const result = await userInfo.save();

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: `Account already exist with the provided email ${email} 😒`,
      });
    }
    return res.status(400).json({
      message: error.message,
    });
  }
};

const login = async (req, res, next) => {};

export { signup, login };
