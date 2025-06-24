const { Router } = require("express");
const adminRouter = Router();
const bcrypt = require("bcrypt");

adminRouter.post("/signup", (req, res) => {
  const username = req.body.username;
});

module.exports = {
  adminRouter: adminRouter,
};
