// routes/results.js
const express = require("express");
const { ObjectId } = require("mongodb");
const { getCollection } = require("../lib/db");
// const { verifyToken, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// GET /results — সব result
router.get("/", async (req, res) => {
  try {
    const collection = await getCollection("results");
    const results = await collection.find({}).toArray();

    res.send(results);
  } catch (err) {
    console.error("GET /results error:", err);
    res.status(500).send({ message: "Server error" });
  }
});

// GET /results/:id — একটা result
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid id" });
    }

    const collection = await getCollection("results");
    const result = await collection.findOne({ _id: new ObjectId(id) });

    if (!result) {
      return res.status(404).send({ message: "Result not found" });
    }

    res.send(result);
  } catch (err) {
    console.error("GET /results/:id error:", err);
    res.status(500).send({ message: "Server error" });
  }
});

// POST /results — নতুন result
// router.post("/", verifyToken, requireAdmin, async (req, res) => {
router.post("/", async (req, res) => {
  try {
    const { studentName, studentImage, courseName, comment } = req.body;

    const newResult = {
      studentName,
      studentImage: studentImage || "",
      courseName: courseName || "",
      comment: comment || "",
      createdAt: new Date(),
    };

    const collection = await getCollection("results");
    const result = await collection.insertOne(newResult);

    res.status(201).send({
      message: "Result created",
      insertedId: result.insertedId,
      result: { _id: result.insertedId, ...newResult },
    });
  } catch (err) {
    console.error("POST /results error:", err);
    res.status(500).send({ message: "Server error" });
  }
});

// PATCH /results/:id — update
// router.patch("/:id", verifyToken, requireAdmin, async (req, res) => {
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid id" });
    }

    const allowed = ["studentName", "studentImage", "courseName", "comment"];

    const updateDoc = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updateDoc[key] = req.body[key];
    }

    const collection = await getCollection("results");
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateDoc }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({ message: "Result not found" });
    }

    const updated = await collection.findOne({ _id: new ObjectId(id) });
    res.send({ message: "Result updated", result: updated });
  } catch (err) {
    console.error("PATCH /results/:id error:", err);
    res.status(500).send({ message: "Server error" });
  }
});

// DELETE /results/:id
// router.delete("/:id", verifyToken, requireAdmin, async (req, res) => {
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid id" });
    }

    const collection = await getCollection("results");
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Result not found" });
    }

    res.send({ message: "Result deleted", deletedId: id });
  } catch (err) {
    console.error("DELETE /results/:id error:", err);
    res.status(500).send({ message: "Server error" });
  }
});

module.exports = router;