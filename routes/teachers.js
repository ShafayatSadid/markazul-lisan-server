// routes/teachers.js
const express = require("express");
const { ObjectId } = require("mongodb");
const { getCollection } = require("../lib/db");
// const { verifyToken, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// GET /teachers — সব teacher
router.get("/", async (req, res) => {
  try {
    const { featured } = req.query;
    const query = {};

    if (featured === "true") query.featured = true;

    const collection = await getCollection("teachers");
    const teachers = await collection.find(query).toArray();

    res.send(teachers);
  } catch (err) {
    console.error("GET /teachers error:", err);
    res.status(500).send({ message: "Server error" });
  }
});

// GET /teachers/:id — একজন teacher
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid id" });
    }

    const collection = await getCollection("teachers");
    const teacher = await collection.findOne({ _id: new ObjectId(id) });

    if (!teacher) {
      return res.status(404).send({ message: "Teacher not found" });
    }

    res.send(teacher);
  } catch (err) {
    console.error("GET /teachers/:id error:", err);
    res.status(500).send({ message: "Server error" });
  }
});

// POST /teachers — নতুন teacher
// router.post("/", verifyToken, requireAdmin, async (req, res) => {
router.post("/", async (req, res) => {
  try {
    const {
      name,
      designation,
      subject,
      description,
      image,
      experience,
      education,
      featured,
    } = req.body;

    const newTeacher = {
      name,
      designation: designation || "",
      subject: subject || "",
      description: description || "",
      image: image || "",
      experience: experience || "",
      education: Array.isArray(education) ? education : [],
      featured: Boolean(featured),
      createdAt: new Date(),
    };

    const collection = await getCollection("teachers");
    const result = await collection.insertOne(newTeacher);

    res.status(201).send({
      message: "Teacher created",
      insertedId: result.insertedId,
      teacher: { _id: result.insertedId, ...newTeacher },
    });
  } catch (err) {
    console.error("POST /teachers error:", err);
    res.status(500).send({ message: "Server error" });
  }
});

// PATCH /teachers/:id — update
// router.patch("/:id", verifyToken, requireAdmin, async (req, res) => {
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid id" });
    }

    const allowed = [
      "name",
      "designation",
      "subject",
      "description",
      "image",
      "experience",
      "education",
      "featured",
    ];

    const updateDoc = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updateDoc[key] = req.body[key];
    }

    if (updateDoc.featured !== undefined) {
      updateDoc.featured = Boolean(updateDoc.featured);
    }

    const collection = await getCollection("teachers");
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateDoc }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({ message: "Teacher not found" });
    }

    const updated = await collection.findOne({ _id: new ObjectId(id) });
    res.send({ message: "Teacher updated", teacher: updated });
  } catch (err) {
    console.error("PATCH /teachers/:id error:", err);
    res.status(500).send({ message: "Server error" });
  }
});

// DELETE /teachers/:id
// router.delete("/:id", verifyToken, requireAdmin, async (req, res) => {
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid id" });
    }

    const collection = await getCollection("teachers");
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Teacher not found" });
    }

    res.send({ message: "Teacher deleted", deletedId: id });
  } catch (err) {
    console.error("DELETE /teachers/:id error:", err);
    res.status(500).send({ message: "Server error" });
  }
});

module.exports = router;