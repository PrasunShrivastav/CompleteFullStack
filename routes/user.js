const { Router } = require("express");
const userRouter = Router();
const bcrypt = require("bcrypt");
const { z } = require("zod");
const { userModel } = require("../db");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
userRouter.post("/signup", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const user = z.object({
    email: z.string().email().min(5),
    password: z.string().min(8),
    name: z.string().min(3),
  });
  const result = user.safeParse({
    name: name,
    email: email,
    password: password,
  });
  if (!result.success) {
    console.log(result.error);
    return res.status(400).json({ message: "Invalid data" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await userModel.create({
      email: email,
      password: hashedPassword,
      name: name,
    });
    res.json({ message: "User created" });
  } catch (e) {
    res.status(404).json({
      error: e,
    });
  }
});
userRouter.post("/signin", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = z.object({
    email: z.string().email().min(5),
    password: z.string().min(8),
  });
  const result = user.safeParse({
    email: email,
    password: password,
  });
  if (!result.success) {
    console.log(result.error);
    return res.status(400).json({ message: "Invalid data" });
  }
  const foundUser = await userModel.findOne({
    email: email,
  });
  if (foundUser) {
    const isValidPassword = await bcrypt.compare(password, foundUser.password);
    if (isValidPassword) {
      const token = jwt.sign(
        {
          email: foundUser.email,
        },
        process.env.key
      );
      res.json({ token: token });
    } else {
      res.status(401).json({ message: "Invalid password" });
    }
  } else {
    res.status(404).json({ message: "User not found" });
  }
});
userRouter.get("/course", (req, res) => {});
module.exports = {
  userRouter: userRouter,
};
