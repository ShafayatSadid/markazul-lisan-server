// routes/books.js
const express = require("express");
const { ObjectId } = require("mongodb");
const { getCollection } = require("../lib/db");
const { verifyToken, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// GET /books — সব বই
router.get("/", async (req, res) => {
  try {
    const collection = await getCollection("books");
    const books = await collection.find({}).toArray();

    res.send(books);
  } catch (err) {
    console.error("GET /books error:", err);
    res.status(500).send({ message: "Server error" });
  }
});

// GET /books/:id — একটা বই
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid id" });
    }

    const collection = await getCollection("books");
    const book = await collection.findOne({ _id: new ObjectId(id) });

    if (!book) {
      return res.status(404).send({ message: "Book not found" });
    }

    res.send(book);
  } catch (err) {
    console.error("GET /books/:id error:", err);
    res.status(500).send({ message: "Server error" });
  }
});

// POST /books — নতুন বই
// router.post("/", verifyToken, requireAdmin, async (req, res) => {
router.post("/", verifyToken, requireAdmin, async (req, res) => {
  try {
    const {
      title,
      author,
      description,
      image,
      downloadUrl,
      fileSize,
      pages,
    } = req.body;

    const newBook = {
      title,
      author: author || "",
      description: description || "",
      image: image || "",
      downloadUrl: downloadUrl || "",
      fileSize: fileSize || "",
      pages: pages || "",
      createdAt: new Date(),
    };

    const collection = await getCollection("books");
    const result = await collection.insertOne(newBook);

    res.status(201).send({
      message: "Book created",
      insertedId: result.insertedId,
      book: { _id: result.insertedId, ...newBook },
    });
  } catch (err) {
    console.error("POST /books error:", err);
    res.status(500).send({ message: "Server error" });
  }
});

// PATCH /books/:id — update
// router.patch("/:id", verifyToken, requireAdmin, async (req, res) => {
router.patch("/:id", verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid id" });
    }

    const allowed = [
      "title",
      "author",
      "description",
      "image",
      "downloadUrl",
      "fileSize",
      "pages",
    ];

    const updateDoc = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updateDoc[key] = req.body[key];
    }

    const collection = await getCollection("books");
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateDoc }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({ message: "Book not found" });
    }

    const updated = await collection.findOne({ _id: new ObjectId(id) });
    res.send({ message: "Book updated", book: updated });
  } catch (err) {
    console.error("PATCH /books/:id error:", err);
    res.status(500).send({ message: "Server error" });
  }
});

// DELETE /books/:id
// router.delete("/:id", verifyToken, requireAdmin, async (req, res) => {
router.delete("/:id", verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid id" });
    }

    const collection = await getCollection("books");
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Book not found" });
    }

    res.send({ message: "Book deleted", deletedId: id });
  } catch (err) {
    console.error("DELETE /books/:id error:", err);
    res.status(500).send({ message: "Server error" });
  }
});

module.exports = router;