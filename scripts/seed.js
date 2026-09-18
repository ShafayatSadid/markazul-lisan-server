// scripts/seed.js
require("dotenv").config();
const { getCollection, connectDB } = require("../lib/db");

async function seed() {
  await connectDB();
  console.log("Connected to DB");

  const coursesCollection = await getCollection("courses");
  const teachersCollection = await getCollection("teachers");
  const blogsCollection = await getCollection("blogs");
  const booksCollection = await getCollection("books");
  const dailyContentCollection = await getCollection("dailyContent");
  const studentsCollection = await getCollection("students");
  const resultsCollection = await getCollection("results");

  // পুরোনো ডাটা মুছে ফেলুন (শুধু seed টেস্টের জন্য)
  await coursesCollection.deleteMany({});
  await teachersCollection.deleteMany({});
  await blogsCollection.deleteMany({});
  await booksCollection.deleteMany({});
  await dailyContentCollection.deleteMany({});
  await studentsCollection.deleteMany({});
  await resultsCollection.deleteMany({});
  console.log("Cleared old data");

  // ---------- Courses ----------
  const courses = [
    {
      name: "Basic Arabic",
      duration: "3 months",
      description: "Arabic basics for beginners — নাহু, সরফ, কিরাত",
      image: "",
      syllabus: ["Nahw", "Sarf", "Qirat"],
      featured: true,
      createdAt: new Date(),
    },
    {
      name: "Quran Reading",
      duration: "6 months",
      description: "সহীহ তিলাওয়াত শেখার কোর্স",
      image: "",
      syllabus: ["Makhraj", "Tajweed", "Fluency"],
      featured: true,
      createdAt: new Date(),
    },
    {
      name: "Hadith Studies",
      duration: "1 year",
      description: "হাদিস শাস্ত্রের প্রাথমিক কোর্স",
      image: "",
      syllabus: ["Sahih Bukhari", "Sahih Muslim", "Sunan"],
      featured: false,
      createdAt: new Date(),
    },
  ];
  await coursesCollection.insertMany(courses);
  console.log("Courses inserted");

  // ---------- Teachers ----------
  const teachers = [
    {
      name: "Shafayat Sadid",
      designation: "Senior Teacher",
      subject: "Arabic Grammar",
      description: "10 years of experience in teaching Arabic",
      image: "",
      experience: "10 years",
      education: ["Al-Azhar University", "Darul Uloom"],
      featured: true,
      createdAt: new Date(),
    },
    {
      name: "Muhammad Hasan",
      designation: "Hafiz & Teacher",
      subject: "Quran & Tajweed",
      description: "হাফেজ, ৮ বছর ধরে তাজবীদ পড়াচ্ছেন",
      image: "",
      experience: "8 years",
      education: ["Madrasah Islamia"],
      featured: true,
      createdAt: new Date(),
    },
  ];
  await teachersCollection.insertMany(teachers);
  console.log("Teachers inserted");

  // ---------- Blogs ----------
  const blogs = [
    {
      title: "নামাজের নিয়ম",
      description: "নামাজ শেখার প্রাথমিক নিয়ম",
      content: "Full content ekhane...",
      image: "",
      authorName: "Shafayat Sadid",
      authorRole: "Senior Teacher",
      createdAt: new Date(),
    },
    {
      title: "কুরআন তিলাওয়াতের ফজিলত",
      description: "কুরআন পড়ার উপকারিতা",
      content: "Full content ekhane...",
      image: "",
      authorName: "Muhammad Hasan",
      authorRole: "Teacher",
      createdAt: new Date(),
    },
  ];
  await blogsCollection.insertMany(blogs);
  console.log("Blogs inserted");

  // ---------- Books ----------
  const books = [
    {
      title: "Riyadus Salihin",
      author: "Imam Nawawi",
      description: "Hadith collection",
      image: "",
      downloadUrl: "https://example.com/riyadus-salihin.pdf",
      fileSize: "5 MB",
      pages: 350,
      createdAt: new Date(),
    },
    {
      title: "Tafsir Ibn Kathir",
      author: "Ibn Kathir",
      description: "Quran tafsir",
      image: "",
      downloadUrl: "https://example.com/tafsir-ibn-kathir.pdf",
      fileSize: "12 MB",
      pages: 800,
      createdAt: new Date(),
    },
  ];
  await booksCollection.insertMany(books);
  console.log("Books inserted");

  // ---------- Daily Content ----------
  const dailyContent = [
    {
      type: "quran",
      title: "Surah Al-Fatiha",
      content: "সমস্ত প্রশংসা আল্লাহর, যিনি সমগ্র জগতের রব।",
      reference: "Surah Al-Fatiha 1:2",
      createdAt: new Date(),
    },
    {
      type: "hadith",
      title: "নিয়তের হাদিস",
      content: "নিশ্চয়ই সকল কাজ নিয়তের উপর নির্ভরশীল।",
      reference: "Sahih Bukhari 1",
      createdAt: new Date(),
    },
    {
      type: "mulniti",
      title: "ঈমানের মূলনীতি",
      content: "আল্লাহ এক, তিনি ছাড়া কোনো ইলাহ নেই।",
      reference: "Islamer Mulniti - 1",
      createdAt: new Date(),
    },
  ];
  await dailyContentCollection.insertMany(dailyContent);
  console.log("Daily content inserted");

  // ---------- Students ----------
  const students = [
    {
      name: "Abdullah Rahman",
      image: "",
      country: "Germany",
      courseName: "Basic Arabic",
      status: "active",
      joinedAt: new Date("2026-01-15"),
      createdAt: new Date(),
    },
    {
      name: "Yusuf Ahmed",
      image: "",
      country: "USA",
      courseName: "Quran Reading",
      status: "active",
      joinedAt: new Date("2026-02-10"),
      createdAt: new Date(),
    },
    {
      name: "Bilal Khan",
      image: "",
      country: "Saudi Arabia",
      courseName: "Hadith Studies",
      status: "completed",
      joinedAt: new Date("2025-06-01"),
      createdAt: new Date(),
    },
  ];
  await studentsCollection.insertMany(students);
  console.log("Students inserted");

  // ---------- Results ----------
  const results = [
    {
      studentName: "Abdullah Rahman",
      studentImage: "",
      courseName: "Basic Arabic",
      comment: "Alhamdulillah, এখন আমি কুরআন দেখে পড়তে পারি।",
      createdAt: new Date(),
    },
    {
      studentName: "Yusuf Ahmed",
      studentImage: "",
      courseName: "Quran Reading",
      comment: "Alhamdulillah, তিলাওয়াত অনেক উন্নত হয়েছে।",
      createdAt: new Date(),
    },
  ];
  await resultsCollection.insertMany(results);
  console.log("Results inserted");

  console.log("Seed complete ✅");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});