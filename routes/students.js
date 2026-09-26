// routes/students.js
const express = require("express");
const { ObjectId } = require("mongodb");
const { getCollection } = require("../lib/db");
const { verifyToken, requireAdmin } = require("../middleware/auth");

const router = express.Router();

const ALLOWED_STATUS = ["active", "completed", "paused"];

// GET /students — সব student (optional ?status=active&course=Basic Arabic)
router.get("/", async (req, res) => {
  try {
    const { status, course } = req.query;
    const query = {};

    if (status) {
      if (!ALLOWED_STATUS.includes(status)) {
        return res.status(400).send({ message: "Invalid status" });
      }
      query.status = status;
    }

    if (course) query.courseName = course;

    const collection = await getCollection("students");
    const students = await collection.find(query).toArray();

    res.send(students);
  } catch (err) {
    console.error("GET /students error:", err);
    res.status(500).send({ message: "Server error" });
  }
});

// GET /students/:id — একজন student
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid id" });
    }

    const collection = await getCollection("students");
    const student = await collection.findOne({ _id: new ObjectId(id) });

    if (!student) {
      return res.status(404).send({ message: "Student not found" });
    }

    res.send(student);
  } catch (err) {
    console.error("GET /students/:id error:", err);
    res.status(500).send({ message: "Server error" });
  }
});

// POST /students — নতুন student
// router.post("/", verifyToken, requireAdmin, async (req, res) => {
router.post("/", verifyToken, requireAdmin, async (req, res) => {
  try {
    const { name, image, country, courseName, status, joinedAt } = req.body;

    if (status && !ALLOWED_STATUS.includes(status)) {
      return res.status(400).send({ message: "Invalid status" });
    }

    const newStudent = {
      name,
      image: image || "",
      country: country || "",
      courseName: courseName || "",
      status: status || "active",
      joinedAt: joinedAt ? new Date(joinedAt) : new Date(),
      createdAt: new Date(),
    };

    const collection = await getCollection("students");
    const result = await collection.insertOne(newStudent);

    res.status(201).send({
      message: "Student created",
      insertedId: result.insertedId,
      student: { _id: result.insertedId, ...newStudent },
    });
  } catch (err) {
    console.error("POST /students error:", err);
    res.status(500).send({ message: "Server error" });
  }
});

// PATCH /students/:id — update
// router.patch("/:id", verifyToken, requireAdmin, async (req, res) => {
router.patch("/:id", verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid id" });
    }

    const allowed = [
      "name",
      "image",
      "country",
      "courseName",
      "status",
      "joinedAt",
    ];

    const updateDoc = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updateDoc[key] = req.body[key];
    }

    if (updateDoc.status !== undefined && !ALLOWED_STATUS.includes(updateDoc.status)) {
      return res.status(400).send({ message: "Invalid status" });
    }

    if (updateDoc.joinedAt !== undefined) {
      updateDoc.joinedAt = new Date(updateDoc.joinedAt);
    }

    const collection = await getCollection("students");
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateDoc }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({ message: "Student not found" });
    }

    const updated = await collection.findOne({ _id: new ObjectId(id) });
    res.send({ message: "Student updated", student: updated });
  } catch (err) {
    console.error("PATCH /students/:id error:", err);
    res.status(500).send({ message: "Server error" });
  }
});

// DELETE /students/:id
// router.delete("/:id", verifyToken, requireAdmin, async (req, res) => {
router.delete("/:id", verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid id" });
    }

    const collection = await getCollection("students");
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Student not found" });
    }

    res.send({ message: "Student deleted", deletedId: id });
  } catch (err) {
    console.error("DELETE /students/:id error:", err);
    res.status(500).send({ message: "Server error" });
  }
});

module.exports = router;