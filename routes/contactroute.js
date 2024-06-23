const express = require("express");
const contactRouter = express.Router();
const {
  contactform,
  getContacts,
  deleteContact,
  postcomment,
  deleteComment,
  getComment,
  updatecomment,
  approveComment,
} = require("../controller/contact");
const authMiddleware = require("../middleswares/auth");

//comment Routes
contactRouter.route("/allcomment").get(authMiddleware, getComment);
contactRouter.route("/approvecomment").get(approveComment);
contactRouter.route("/addcomment").post(postcomment);
contactRouter.route("/deletecomment").delete(authMiddleware, deleteComment);
contactRouter.route("/approve").patch(authMiddleware, updatecomment);
//contact Routes
contactRouter.route("/addcontact").post(contactform);
contactRouter.route("/getcontact").get(authMiddleware, getContacts);
contactRouter.route("/deletecontact").delete(authMiddleware, deleteContact);

module.exports = contactRouter;
