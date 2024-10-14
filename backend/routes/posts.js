const router = require("express").Router();
const Post = require("../models/Post")

router.get("/", (req, res) => {
  res.send("posts router");
});

//投稿の作成
router.post("/", async (req, res) => {
  const newPost = new Post(req.body)
  try {
    const savedPost = await newPost.save()
    res.status(200).json(savedPost)
  } catch (err) {
    return res.status(500).json(err);
  }
})

//投稿の更新
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if(post.userId === req.body.userId) {
      await post.updateOne({
        $set: req.body
      })
      return res.status(200).json("投稿の更新に成功しました！")
    } else {
      return res.status(403).json("あなたはほかの人の投稿を編集できません")
    }
  } catch (err) {
    return res.status(500).json(err);
  }
})

module.exports = router;
