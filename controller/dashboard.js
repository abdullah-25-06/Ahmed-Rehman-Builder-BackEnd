const fs = require("fs");
const path = require("path");
const { Project, Detail } = require("../model/model");
const addPost = async (req, res) => {
  try {
    const { title, bedroom, washroom, area, description, link } = req.body;
    if (
      req.files.length < 1 ||
      !title ||
      !bedroom ||
      !washroom ||
      !area ||
      !description ||
      !link
    )
      return res.status(400).json({ msg: "All fields are required" });

    const exist = await Project.findOne({ title });
    if (exist)
      return res.status(400).json({ msg: "Already a Project with same title" });
    const project = await Project.create({
      title,
      description,
      data_url: req.files[0].filename,
    });

    if (!project) return res.status(400).json({ msg: "Please try again" });
    req.files.shift();
    const newData = req.files.map((img) => img.filename);
    const detail = await Detail.create({
      title: project._id,
      bedroom,
      washroom,
      area,
      link,
      data: newData,
    });
    if (!detail) return res.status(400).json({ msg: "Please try again" });
    return res.status(200).json({ msg: "Project Created Successfully" });
  } catch (error) {
    // console.log(error);
    return res.status(400).json({ msg: "Please try again" });
  }
};
const viewPost = async (req, res) => {
  try {
    const data = await Project.find({});
    return res.status(200).json({ data: data });
  } catch (err) {
    return res.status(400).json({ msg: "Please try again" });
  }
};
const onePost = async (req, res) => {
  try {
    const id = req.query.id;
    const proj = await Project.findOne({ _id: id }).select(
      "_id description data_url title"
    );
    if (!proj) return res.status(400).json({ msg: "Please try again" });
    const data = await Detail.findOne({ title: proj.id });
    return res.status(200).json({ detail_data: data, meta_data: proj });
  } catch (err) {
    return res.status(400).json({ msg: "Please try again" });
  }
};
const completePost = async (req, res) => {
  try {
    const id = req.query.id;
    const proj = await Project.findByIdAndUpdate(
      { _id: id },
      { completed: true },
      {
        new: true,
      }
    );
    if (!proj) return res.status(400).json({ msg: "Please try again" });

    return res.status(200).json({ data: proj });
  } catch (err) {
    return res.status(400).json({ msg: "Please try again" });
  }
};
//Updating whole Project
const updatePost = async (req, res) => {
  try {
    const { title, bedroom, washroom, area, description, link, delpic } =
      req.body;
    if (!title || !bedroom || !washroom || !area || !description || !link)
      return res.status(400).json({ msg: "All fields are required" });
    const id = req.query.id;
    const proj = await Project.findByIdAndUpdate(
      { _id: id },
      { title, description }
    );
    if (!proj) return res.status(400).json({ msg: "Please try again" });
    const PicArray = await Detail.findOne({ title: proj._id }).select(
      "-_id data "
    );
    const newData = PicArray.data.filter((img) => {
      return !delpic.includes(img);
    });
    const detail = await Detail.findOneAndUpdate(
      { title: proj._id },
      { bedroom, washroom, area, link, data: newData },
      {
        new: true,
      }
    );
    if (!detail) return res.status(400).json({ msg: "Please try again" });
    try {
      delpic.forEach((img) => {
        const imagePath = path.join(process.cwd(), "images", img);
        fs.access(imagePath, fs.constants.F_OK, (err) => {
          if (err) {
            // console.error(`File ${img} does not exist.`);
            return;
          }
          fs.unlink(imagePath, (err) => {
            if (err) {
              // console.error(`Error deleting ${img}: ${err.message}`);
              return;
            }
            // console.log(`${img} has been successfully deleted.`);
          });
        });
      });
    } catch (err) {
      // console.log(err);
    }

    return res.status(200).json({ msg: "Project Created Successfully" });
  } catch (err) {
    // console.log(err);
    return res.status(200).json({ msg: "Project Created Successfully" });
  }
};
const updateTitle = async (req, res) => {
  try {
    const id = req.query.id;
    const proj = await Project.findByIdAndUpdate(
      { _id: id },
      {
        data_url: req.file.filename,
      }
    );
    if (!proj) return res.status(404).json({ msg: "Try Again" });
    try {
      const imagePath = path.join(process.cwd(), "images", proj.data_url);
      fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (err) {
          // console.error(`File ${proj.data_url} does not exist.`);
          return;
        }
        fs.unlink(imagePath, (err) => {
          if (err) {
            // console.error(`Error deleting ${proj.data_url}: ${err.message}`);
            return;
          }
          // console.log(`${proj.data_url} has been successfully deleted.`);
        });
      });
      // fs.unlinkSync(path.join(process.cwd(), "images", proj.data_url));
    } catch (e) {
      // console.log(e);
    }

    const img = await Project.findById({ _id: id }).select("data_url");
    if (!img) return res.status(404).json({ msg: "Try Again" });
    return res.status(200).json({ img: img });
  } catch (err) {
    // console.log(err);
    return res.status(404).json({ msg: "Try Again" });
  }
};
const allPost = async (req, res) => {
  try {
    const data = await Detail.find({})
      .select("-data -_id") //.populate("title");
      .populate({
        path: "title",
        select: ["data_url", "_id", "title", "completed"],
      });
    const newData = data.filter((rec) => rec.title.completed);
    return res.status(200).json({ newData });
  } catch (err) {
    // console.log(err);
    return res.status(400).json({ msg: "Try Again" });
  }
};

const completeProject = async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) return res.status(400).json({ msg: "No project" });
    const proj = await Project.findOne({ _id: id, completed: true }).select(
      "title description "
    );
    if (!proj) return res.status(400).json({ msg: "Try Again" });
    const data = await Detail.findOne({ title: proj.id }).select("data link");
    if (!data) return res.status(400).json({ msg: "Try Again" });
    return res.status(200).json({
      pic: data.data,
      title: proj.title,
      description: proj.description,
      link: data.link,
    });
  } catch (err) {
    // console.log(err);
    return res.status(400).json({ msg: "Try Again" });
  }
};
const addImage = async (req, res) => {
  try {
    const id = req.query.id;
    const proj = await Project.findById({ _id: id }).select("id");
    if (!proj) return res.status(400).json({ msg: "Try Again" });
    const newData = req.files.map((img) => img.filename);
    const data = await Detail.findOneAndUpdate(
      { title: proj.id },
      { $push: { data: { $each: newData } } },
      {
        new: true,
      }
    ).select("data");
    return res.status(200).json({ detail_data: data });
  } catch (err) {
    // console.log(err);
    return res.status(400).json({ msg: "Try Again" });
  }
};

const deleteProj = async (req, res) => {
  try {
    const id = req.query.id;
    const proj = await Project.findByIdAndDelete({ _id: id });
    const detail = await Detail.findOneAndDelete({ title: proj._id });
    try {
      detail.data.forEach((img) => {
        const imagePath = path.join(process.cwd(), "images", img);
        fs.access(imagePath, fs.constants.F_OK, (err) => {
          if (err) {
            // console.error(`File ${img} does not exist.`);
            return;
          }
          fs.unlink(imagePath, (err) => {
            if (err) {
              // console.error(`Error deleting ${img}: ${err.message}`);
              return;
            }
            // console.log(`${img} has been successfully deleted.`);
          });
        });
      });
    } catch (err) {
      // console.log(err);
    }
    // detail.data.forEach((img) => {
    //   try {
    //     fs.unlinkSync(path.join(process.cwd(), "images", img));
    //   } catch (err) {
    //     console.log(err);
    //   }
    // });
    return res.status(200).json({ msg: "Project Deleted" });
  } catch (err) {
    return res.status(400).json({ msg: "Try Again" });
  }
};
module.exports = {
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
};
