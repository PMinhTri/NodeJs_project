const express = require("express");
const Post = require("../model/Post");
const verifyToken = require("../middleware/auth");
const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.userId }).populate("user", [
      "username",
    ]);
    res.json({ success: true, posts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.post("/", verifyToken, async (req, res) => {
  const { title, desciption, url, status } = req.body;
  if (!title) {
    return res
      .status(400)
      .json({ success: false, message: "Title is required!" });
  }
  try {
    const newPost = new Post({
      title: title,
      description: desciption,
      url: url.startsWith("https://") ? url : `https://${url}`,
      status: status || "TO LEARN",
      user: req.userId,
    });
    await newPost.save();
    res.json({ success: true, message: "Happy learning!", post: newPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  const { title, desciption, url, status } = req.body;

  if (!title) {
    return res
      .status(400)
      .json({ success: false, message: "Title is required!" });
  }
  try {
    let updatePost = {
      title,
      desciption: desciption || null,
      url: (url.startsWith("https://") ? url : `https://${url}`) || null,
      status: status || "TO LEARN",
    };

    const postudateCondition = { _id: req.params.id, user: req.userId };
    updatePost = await Post.findOneAndUpdate(postudateCondition, updatePost, {
      new: true,
    });
    // User not authorised to update post
    if (!updatePost)
      return res
        .status(401)
        .json({
          success: false,
          message: "Post not found or user not authorised",
        });
    res.json({success:false, message:'Excellent progress', post:updatePost});
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.delete('/:id', verifyToken, async (req, res)=>{
  try {
    const postDeleteCondition = {_id:req.params.id, user:req.userId};
    const deletePost = await Post.findOneAndDelete(postDeleteCondition);

    // User not authorized or post not found
    if(!deletePost){
      res.status(401).json({success:false, message:'Post not found or user not authorized'});
    }
    res.json({success:true, post:deletePost});
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
})
module.exports = router;
