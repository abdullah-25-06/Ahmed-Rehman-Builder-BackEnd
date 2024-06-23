const asynchandler = require("express-async-handler");
const { Contactform, Comment } = require("../model/model");

const contactform = asynchandler(async (req, res) => {
  try {
    const { name, phoneno, email, desc } = req.body;
    if (!name || !phoneno || !email || !desc)
      return res
        .status(400)
        .json({ msg: "Please fill all the required fields" });

    await Contactform.create({
      name,
      phoneno,
      email,
      desc,
    });
    return res.status(201).json({
      msg: "Submitted Successfull",
    });
  } catch (err) {
    return res.status(400).json({ msg: "Not submitted" });
  }
});

const getContacts = asynchandler(async (req, res) => {
  try {
    const allcontacts = await Contactform.find();
    if (!allcontacts) return res.status(200).json({ msg: "No Contact" });
    return res.status(200).json(allcontacts);
  } catch (err) {
    return res.status(400).json({ msg: "No Contact" });
  }
});

const deleteContact = asynchandler(async (req, res) => {
  const { id } = req.query;
  if (!id) {
    res.status(404);
    throw new Error("Not found");
  }
  await Contactform.findByIdAndDelete({
    _id: id,
  });
  res.status(200).json({ msg: "removed !" });
});

const postcomment = asynchandler(async (req, res) => {
  try {
    const { name, comment } = req.body;
    if (!name || !comment)
      return res
        .status(400)
        .json({ msg: "Please fill all the required fields" });

    const pcomment = await Comment.create({
      name,
      comment,
    });
    if (!pcomment) return res.status(400).json({ msg: "Please try again." });
    return res.status(201).json({
      msg: "Comment Successfull",
    });
  } catch (err) {
    return res.status(400).json({ msg: "Not submitted" });
  }
});

const deleteComment = asynchandler(async (req, res) => {
  const { id } = req.query;
  if (!id) {
    res.status(404);
    throw new Error("Not found");
  }
  await Comment.findByIdAndDelete({
    _id: id,
  });
  res.status(200).json({ msg: "comment deleted!" });
});

const getComment = asynchandler(async (req, res) => {
  try {
    const allcomment = await Comment.find({}).select("approved comment name");
    if (!allcomment) return res.status(200).json({ msg: "No comments" });
    return res.status(200).json(allcomment);
  } catch (err) {
    return res.status(400).json({ msg: "No Comment" });
  }
});
const approveComment = asynchandler(async (req, res) => {
  try {
    const allcomment = await Comment.find({ approved: true });
    if (!allcomment) return res.status(200).json({ msg: "No comments" });
    return res.status(200).json(allcomment);
  } catch (err) {
    return res.status(400).json({ msg: "No Comment" });
  }
});

const updatecomment = async (req, res) => {
  try {
    const updated = await Comment.findByIdAndUpdate(
      { _id: req.query.id },
      {
        approved: true,
      },
      {
        new: true,
      }
    );
    if (!updated) return res.status(400).json({ msg: "try again" });
    return res.status(200).json(updated);
  } catch (error) {
    // console.log(error);
    return res.status(400).json({ msg: "try again" });
  }
};

module.exports = {
  contactform,
  getContacts,
  deleteContact,
  postcomment,
  deleteComment,
  getComment,
  updatecomment,
  approveComment,
};
