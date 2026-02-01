const mongoose = require("mongoose");

module.exports = mongoose.model("Task",
  new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: String,
    priority: String,
    dueDate: Date,
    status: { type: String, default: "pending" }
  }, { timestamps: true })
);
