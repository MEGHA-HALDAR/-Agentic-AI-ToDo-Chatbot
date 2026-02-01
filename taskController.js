const Task = require("../models/Task");
const { agent } = require("../ai/agent");

/**
 * CREATE TASK (via OpenAI agent)
 */
exports.createTask = async (req, res) => {
  try {
    const message = req.body.message;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // 🧠 Call OpenAI agent
    const result = await agent(message);
    console.log("🧠 AI RESULT:", result);

    // 🔒 Safety fallback
    if (!result || !result.data || !result.data.title) {
      const task = await Task.create({
        user: req.user,
        title: message,
        priority: "normal"
      });

      return res.status(201).json({
        message: "Task created (fallback)",
        task
      });
    }

    // ✅ Normal AI-created task
    const task = await Task.create({
      user: req.user,
      title: result.data.title,
      priority: result.data.priority || "normal"
    });

    res.status(201).json({
      message: "Task created successfully",
      task
    });
  } catch (err) {
    console.error("Create task error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * GET TASKS (for logged-in user)
 */
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user })
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    console.error("Get tasks error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
