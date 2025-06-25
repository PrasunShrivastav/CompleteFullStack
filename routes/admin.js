const { Router } = require("express");
const adminRouter = Router();
const bcrypt = require("bcrypt");
const { z } = require("zod");
const { adminModel } = require("../db");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
adminRouter.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const admin = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
  });
  const result = admin.safeParse({
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
    await adminModel.create({
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
  const foundAdmin = await adminModel.findOne({
    email: email,
  });
  if (foundAdmin) {
    const isValidPassword = await bcrypt.compare(password, foundAdmin.password);
    if (isValidPassword) {
      const token = jwt.sign(
        {
          email: foundAdmin.email,
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
module.exports = {
  adminRouter: adminRouter,
};
