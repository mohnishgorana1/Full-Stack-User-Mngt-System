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

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if ((!email, !password)) {
    return res.status(400).json({
      success: false,
      message: "email and password are required",
    });
  }

  try {
    const user = await User.findOne({ email }).select("+password"); // check if user exist or not

    // check credentials
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // if credentials are true the
    // create jwt token using userSchema( jwtToken() )
    const token = user.jwtToken();
    user.password = undefined;

    const cookieOption = {
      maxAge: 24 * 60 * 60 * 1000, //24hr
      httpOnly: true, //  not able to modify  the cookie in client side
    };

    res.cookie("token", token, cookieOption); // set cookie
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getUser = async (req, res, next) => {
  const userId = req.User.id; // jwtAuth se req.User mila tha usme id thi

  try {
    const user = await User.findById(userId); // password ke alawa jo bhi info h is userId me vo user me store ho jaegi

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "BAD REQUEST",
    });
  }
};

const logout = async (req, res, next) => {
  // * cookie me token hata do to fir logout ho jaega
  // * cookie me se token nikal do yani null kr do

  try {
    const cookieOption = {
      expires: new Date(), // current expiry date
      httpOnly: true, //  not able to modify  the cookie in client side
    };

    res.cookie("token", null, cookieOption);

    res.status(200).json({
      success: true,
      message: "Logged Out",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export { signup, login, getUser, logout };
