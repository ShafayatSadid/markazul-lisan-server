// routes/courses.js
const express = require("express");
const { ObjectId } = require("mongodb");
const { getCollection } = require("../lib/db");
const { verifyToken, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// GET /courses — সব course
router.get("/", async (req, res) => {
  try {
    const { featured } = req.query;
    const query = {};

    if (featured === "true") query.featured = true;

    const collection = await getCollection("courses");
    const courses = await collection.find(query).toArray();

    res.send(courses);
  } catch (err) {
    console.error("GET /courses error:", err);
    res.status(500).send({ message: "Server error" });
  }
});

// GET /courses/:id — একটা course
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid id" });
    }

    const collection = await getCollection("courses");
    const course = await collection.findOne({ _id: new ObjectId(id) });

    if (!course) {
      return res.status(404).send({ message: "Course not found" });
    }

    res.send(course);
  } catch (err) {
    console.error("GET /courses/:id error:", err);
    res.status(500).send({ message: "Server error" });
  }
});

// POST /courses — নতুন course
// router.post("/", verifyToken, requireAdmin, async (req, res) => {
router.post("/",verifyToken, requireAdmin, async (req, res) => {
  try {
    const {
      name,
      duration,
      description,
      image,
      syllabus,
      featured,
    } = req.body;

    const newCourse = {
      name,
      duration: duration || "",
      description: description || "",
      image: image || "",
      syllabus: Array.isArray(syllabus) ? syllabus : [],
      featured: Boolean(featured),
      createdAt: new Date(),
    };

    const collection = await getCollection("courses");
    const result = await collection.insertOne(newCourse);

    res.status(201).send({
      message: "Course created",
      insertedId: result.insertedId,
      course: { _id: result.insertedId, ...newCourse },
    });
  } catch (err) {
    console.error("POST /courses error:", err);
    res.status(500).send({ message: "Server error" });
  }
});

// PATCH /courses/:id — update
// router.patch("/:id", verifyToken, requireAdmin, async (req, res) => {
router.patch("/:id",verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid id" });
    }

    const allowed = [
      "name",
      "duration",
      "description",
      "image",
      "syllabus",
      "featured",
    ];

    const updateDoc = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updateDoc[key] = req.body[key];
    }

    if (updateDoc.featured !== undefined) {
      updateDoc.featured = Boolean(updateDoc.featured);
    }

    const collection = await getCollection("courses");
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateDoc }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({ message: "Course not found" });
    }

    const updated = await collection.findOne({ _id: new ObjectId(id) });
    res.send({ message: "Course updated", course: updated });
  } catch (err) {
    console.error("PATCH /courses/:id error:", err);
    res.status(500).send({ message: "Server error" });
  }
});

// DELETE /courses/:id
// router.delete("/:id", verifyToken, requireAdmin, async (req, res) => {
router.delete("/:id",verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid id" });
    }

    const collection = await getCollection("courses");
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Course not found" });
    }

    res.send({ message: "Course deleted", deletedId: id });
  } catch (err) {
    console.error("DELETE /courses/:id error:", err);
    res.status(500).send({ message: "Server error" });
  }
});

module.exports = router;