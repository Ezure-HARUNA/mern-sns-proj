const router = require("express").Router();

//登録
router.post("/register", (req, res) => {
  try {
    
  } catch(error) {
    return res.status(500).json(error);
  }
});

// router.get("/", (req, res) => {
//     res.send("user router")
// })

module.exports = router;
