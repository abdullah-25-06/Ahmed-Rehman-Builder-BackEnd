const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: [true, "Enter name"],
    },
    email: {
      type: String,
      require: [true, "Enter email"],
      unique: true,
    },
    phone: {
      type: String,
      require: [true, "Enter Phone Number"],
      unique: true,
    },
    password: {
      type: String,
      require: [true, "Enter Password"],
    },
    token_detail: { access_token: { type: String }, jti: { type: String } },
  },
  {
    timestamps: true,
  }
);

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    require: [true, "Enter title"],
  },
  description: {
    type: String,
    require: [true, "Enter description"],
  },
  data_url: {
    type: String,
    require: [true, "Enter Image"],
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

// projectSchema.set("toObject", { virtuals: true });
// projectSchema.set("toJSON", { virtuals: true });

const detailSchema = new mongoose.Schema({
  data: {
    type: Array,
    default: [],
  },
  title: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
  washroom: {
    type: String,
  },
  area: {
    type: String,
  },
  price: {
    type: String,
  },
  bedroom: {
    type: String,
  },
  link:{
    type: String,
  }
});
const commentSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Enter title"],
  },
  comment: {
    type: String,
    require: [true, "Enter description"],
  },
  approved: {
    type: Boolean,
    default: false,
  },
});

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Enter title"],
  },
  email: {
    type: String,
    require: [true, "Enter description"],
  },
  phoneno: {
    type: String,
    require: [true, "Enter description"],
  },
  desc: {
    type: String,
    require: [true, "Enter description"],
  },
});

const OneUser = mongoose.model("OneUser", userSchema);
const Project = mongoose.model("Project", projectSchema);
const Detail = mongoose.model("Detail", detailSchema);
const Comment = mongoose.model("Comment", commentSchema);
const Contactform = mongoose.model("Contactform", contactSchema);

module.exports = { OneUser, Project, Detail,Comment,Contactform };
