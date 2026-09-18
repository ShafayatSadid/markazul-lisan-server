// routes/dailyContent.js
const express = require("express");
const { ObjectId } = require("mongodb");
const { getCollection } = require("../lib/db");
// const { verifyToken, requireAdmin } = require("../middleware/auth");

const router = express.Router();

const ALLOWED_TYPES = ["quran", "hadith", "mulniti"];

// GET /daily-content — সব content (optional ?type=quran)
router.get("/", async (req, res) => {
  try {
    const { type } = req.query;
    const query = {};

    if (type) {
      if (!ALLOWED_TYPES.includes(type)) {
        return res.status(400).send({ message: "Invalid type" });
      }
      query.type = type;
    }

    const collection = await getCollection("dailyContent");
    const contents = await collection.find(query).toArray();

    res.send(contents);
  } catch (err) {
    console.error("GET /daily-content error:", err);
    res.status(500).send({ message: "Server error" });
  }
});

// GET /daily-content/:id — একটা content
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid id" });
    }

    const collection = await getCollection("dailyContent");
    const content = await collection.findOne({ _id: new ObjectId(id) });

    if (!content) {
      return res.status(404).send({ message: "Content not found" });
    }

    res.send(content);
  } catch (err) {
    console.error("GET /daily-content/:id error:", err);
    res.status(500).send({ message: "Server error" });
  }
});

// POST /daily-content — নতুন content
// router.post("/", verifyToken, requireAdmin, async (req, res) => {
router.post("/", async (req, res) => {
  try {
    const { type, title, content, reference } = req.body;

    if (!ALLOWED_TYPES.includes(type)) {
      return res.status(400).send({ message: "Invalid type" });
    }

    const newContent = {
      type,
      title: title || "",
      content: content || "",
      reference: reference || "",
      createdAt: new Date(),
    };

    const collection = await getCollection("dailyContent");
    const result = await collection.insertOne(newContent);

    res.status(201).send({
      message: "Content created",
      insertedId: result.insertedId,
      content: { _id: result.insertedId, ...newContent },
    });
  } catch (err) {
    console.error("POST /daily-content error:", err);
    res.status(500).send({ message: "Server error" });
  }
});

// PATCH /daily-content/:id — update
// router.patch("/:id", verifyToken, requireAdmin, async (req, res) => {
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid id" });
    }

    const allowed = ["type", "title", "content", "reference"];

    const updateDoc = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updateDoc[key] = req.body[key];
    }

    if (updateDoc.type !== undefined && !ALLOWED_TYPES.includes(updateDoc.type)) {
      return res.status(400).send({ message: "Invalid type" });
    }

    const collection = await getCollection("dailyContent");
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateDoc }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({ message: "Content not found" });
    }

    const updated = await collection.findOne({ _id: new ObjectId(id) });
    res.send({ message: "Content updated", content: updated });
  } catch (err) {
    console.error("PATCH /daily-content/:id error:", err);
    res.status(500).send({ message: "Server error" });
  }
});

// DELETE /daily-content/:id
// router.delete("/:id", verifyToken, requireAdmin, async (req, res) => {
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid id" });
    }

    const collection = await getCollection("dailyContent");
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Content not found" });
    }

    res.send({ message: "Content deleted", deletedId: id });
  } catch (err) {
    console.error("DELETE /daily-content/:id error:", err);
    res.status(500).send({ message: "Server error" });
  }
});

module.exports = router;