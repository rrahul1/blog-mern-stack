import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
   const { username, email, password } = req.body;

   if (
      (!username || !email || !password || username === "" || email === "",
      password === "")
   ) {
      return res.status(400).json({ message: "All fields are requried" });
   }

   const hashPassword = bcryptjs.hashSync(password, 10);

   const newUser = new User({
      username,
      email,
      password: hashPassword,
   });

   try {
      await newUser.save();
      res.json("signup success");
   } catch (error) {
      next(errorHandler(400, "All fields are required"));
   }
};
