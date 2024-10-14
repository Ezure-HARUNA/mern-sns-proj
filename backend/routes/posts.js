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

//投稿の削除
router.delete("/:id", async (req, res) => {
  try {
  const post = await Post.findById(req.params.id);
  if (post.userId === req.body.userId) {
    await post.deleteOne();
    return res.status(200).json("投稿の削除に成功しました！");
  } else {
    return res.status(403).json("あなたはほかの人の投稿を削除できません");
  }
  } catch (err) {
    return res.status(500).json(err)
  }
})

//特定の投稿の取得
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    return res.status(200).json(post)
  } catch (err) {
    return res.status(403).json(err);
  }
})

//特定の投稿にいいねを押す
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({
        $push: {
          likes: req.body.userId
        }
      })
      return res.status(200).json("いいねを押しました")
      //投稿にすでに言い値が押されていたら
    } else {
      await post.updateOne({
        $pull: {
          likes: req.body.userId
        }
      })
      return res.status(403).json("いいねを解除しました")
    }

  } catch (err) {
    return res.status(500).json(err);
  }
})

module.exports = router;
