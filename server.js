const express = require("express");
const userRouter = require("./routes/routes");
const dashboardRouter = require("./routes/dashboardRoutes");
const contactRouter = require("./routes/contactroute");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { connectdb } = require("./DB/connect");

app.use(cors());
app.use(express.json({ limit: "40mb" }));
app.use("/api/images", express.static("images"));
app.use("/api/user", userRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/contact", contactRouter);
const port = process.env.PORT;
const start = async () => {
  try {
    app.listen(port, () => console.log(`server is listening on ${port} `));
    await connectdb();
  } catch (error) {
    console.log(error);
  }
};
start();
