const express = require("express");
const app = express();
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const postsRoute = require("./routes/posts");
const PORT = 3001;
const mongoose = require("mongoose");
require("dotenv").config()

//DB接続
mongoose
  .connect(process.env.MONGOURL)
  .then(() => {
    console.log("DBと接続中...");
  })
  .catch((error) => {
    console.log(error);
  });

//ミドルウェア
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postsRoute);

app.get("/", (req, res) => {
  res.send("hello express");
});

// app.get("/users", (req, res) => {
//   res.send("users express");
// });

app.listen(PORT, () => console.log("サーバーが起動しました"));
