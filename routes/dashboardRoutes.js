const express = require("express");
const dashboardRouter = express.Router();
const path = require("path");
const {
  addPost,
  viewPost,
  onePost,
  completePost,
  updatePost,
  updateTitle,
  allPost,
  completeProject,
  addImage,
  deleteProj,
} = require("../controller/dashboard");
const authMiddleware = require("../middleswares/auth");
console.log(process.cwd())
console.log(path.join(process.cwd(), "images"))
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "images"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

dashboardRouter
  .route("/addpost")
  .post(authMiddleware, upload.any("data"), addPost);
dashboardRouter
  .route("/addimage")
  .put(authMiddleware, upload.any("data"), addImage);
dashboardRouter.route("/viewpost").get(authMiddleware, viewPost);
dashboardRouter.route("/onepost").get(authMiddleware, onePost);
dashboardRouter.route("/completepost").put(authMiddleware, completePost);
dashboardRouter.route("/updatepost").put(authMiddleware, updatePost);
dashboardRouter.route("/allpost").get(allPost);
dashboardRouter.route("/project").get(completeProject);
dashboardRouter
  .route("/updatetitle")
  .put(authMiddleware, upload.single("data"), updateTitle);
dashboardRouter.route("/delete").delete(authMiddleware, deleteProj);

module.exports = dashboardRouter;
