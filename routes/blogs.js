// routes/blogs.js
const express = require("express");
const { ObjectId } = require("mongodb");
const { getCollection } = require("../lib/db");
// const { verifyToken, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// GET /blogs — সব blog
router.get("/", async (req, res) => {
  try {
    const collection = await getCollection("blogs");
    const blogs = await collection.find({}).toArray();

    res.send(blogs);
  } catch (err) {
    console.error("GET /blogs error:", err);
    res.status(500).send({ message: "Server error" });
  }
});

// GET /blogs/:id — একটা blog
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid id" });
    }

    const collection = await getCollection("blogs");
    const blog = await collection.findOne({ _id: new ObjectId(id) });

    if (!blog) {
      return res.status(404).send({ message: "Blog not found" });
    }

    res.send(blog);
  } catch (err) {
    console.error("GET /blogs/:id error:", err);
    res.status(500).send({ message: "Server error" });
  }
});

// POST /blogs — নতুন blog
// router.post("/", verifyToken, requireAdmin, async (req, res) => {
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      content,
      image,
      authorName,
      authorRole,
    } = req.body;

    const newBlog = {
      title,
      description: description || "",
      content: content || "",
      image: image || "",
      authorName: authorName || "",
      authorRole: authorRole || "",
      createdAt: new Date(),
    };

    const collection = await getCollection("blogs");
    const result = await collection.insertOne(newBlog);

    res.status(201).send({
      message: "Blog created",
      insertedId: result.insertedId,
      blog: { _id: result.insertedId, ...newBlog },
    });
  } catch (err) {
    console.error("POST /blogs error:", err);
    res.status(500).send({ message: "Server error" });
  }
});

// PATCH /blogs/:id — update
// router.patch("/:id", verifyToken, requireAdmin, async (req, res) => {
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid id" });
    }

    const allowed = [
      "title",
      "description",
      "content",
      "image",
      "authorName",
      "authorRole",
    ];

    const updateDoc = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updateDoc[key] = req.body[key];
    }

    const collection = await getCollection("blogs");
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateDoc }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({ message: "Blog not found" });
    }

    const updated = await collection.findOne({ _id: new ObjectId(id) });
    res.send({ message: "Blog updated", blog: updated });
  } catch (err) {
    console.error("PATCH /blogs/:id error:", err);
    res.status(500).send({ message: "Server error" });
  }
});

// DELETE /blogs/:id
// router.delete("/:id", verifyToken, requireAdmin, async (req, res) => {
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid id" });
    }

    const collection = await getCollection("blogs");
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Blog not found" });
    }

    res.send({ message: "Blog deleted", deletedId: id });
  } catch (err) {
    console.error("DELETE /blogs/:id error:", err);
    res.status(500).send({ message: "Server error" });
  }
});

module.exports = router;