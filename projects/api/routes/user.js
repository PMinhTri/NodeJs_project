const express = require("express");
const { verifyUser, verifyAdmin } = require("../middleware/authorization");
const User = require("../models/User");
const router = express.Router();

router.put("/:id", verifyUser, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SECRET
    ).toString();
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", verifyUser, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER
router.get("/find/:id", verifyAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...userData } = user._doc;
    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL USER
router.get("/", verifyAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    // const { password, ...userData } = users._doc;
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER STATS
// router.get("/stats", verifyAdmin, async (req, res) => {
//   const date = new Date();
//   const lastYear = new Date(date.setFullYear.apply(date.getFullYear() - 1));

//   try {
//     const data = await User.aggregate([
//       { $match: { createdAt: { $gte: lastYear } } },
//       {
//         $project: {
//           month: { $month: "$createdAt" },
//         },
//       },
//     ]);
//   } catch (err) {}
// });

module.exports = router;
