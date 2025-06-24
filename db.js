const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const user = new Schema({
  email: { type: String, unique: true },
  password: { type: String, required: true },
  name: String,
});
const admin = new Schema({
  email: { type: String, unique: true },
  password: { type: String, required: true },
  name: String,
});
const course = new Schema({
  title: String,
  description: String,
  price: Number,
  imageUrl: String,
  teacher: ObjectId,
});
const purchase = new Schema({
  course: ObjectId,
  user: ObjectId,
});
const userModel = mongoose.model("user", user);
const adminModel = mongoose.model("admin", admin);
const courseModel = mongoose.model("course", course);
const purchaseModel = mongoose.model("purchase", purchase);
module.exports = {
  userModel: userModel,
  adminModel: adminModel,
  courseModel: courseModel,
  purchaseModel: purchaseModel,
};
