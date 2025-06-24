const { Router } = require("express");
const userRouter = Router();
const bcrypt = require("bcrypt");
userRouter.post("/signup", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
  } catch (e) {
    res.status(404).json({
      error: e,
    });
  }
});
userRouter.post("/signin", (req, res) => {});
userRouter.get("/course", (req, res) => {});
module.exports = {
  userRouter: userRouter,
};
