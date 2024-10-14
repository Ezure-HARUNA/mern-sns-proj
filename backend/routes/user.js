const router = require("express").Router();
const User = require("../models/User");

// router.get("/", (req, res) => {
//   res.send("user router");
// });

//ユーザ情報の更新
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    // if (req.body.password) {
    //   try {
    //     req.body.password = req.body.password;
    //   } catch (err) {
    //     return res.status(500).json(err);
    //   }
    // }

    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("ユーザ情報が更新されました");
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  } else {
    return res
      .status(403)
      .json("あなたはご自身のアカウント時のみ情報を更新できます");
  }
});

//delete user
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("アカウントが削除されました");
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  } else {
    return res
      .status(403)
      .json("あなたはご自身のアカウント時のみアカウントを削除できます");
  }
});

//get a user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    //passwordとupdatedAtを除いたユーザ情報を表示する
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

//クエリでuser情報を取得
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...other } = user._doc;
    return res.status(200).json(other);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//ユーザのフォロー
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      //フォロワーにいなかったらフォローできる
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("ユーザーをフォローしました");
      } else {
        return res.status(403).json("あなたはこのユーザーを既にフォローしています");
      }
    } catch (err) {}
  } else {
    return res.status(500).json("自分をフォローすることはできません");
  }
});


// フォロー解除

router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      //フォロワーにいたらフォロー外せる
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json("user has been unfollowd");
      } else {
        return res.status(403).json("you dont follow this user");
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(500).json("cant unfollow yourself");
  }
});

module.exports = router;
