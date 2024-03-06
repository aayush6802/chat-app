import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userModel = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    pic: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isVerified: { type: Boolean, default: false },
    emailToken: { type: String },
  },
  {
    timestamps: true,
  }
);

userModel.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
// userModel.pre("save", async (next) => {
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

const User = mongoose.model("User", userModel);
export default User;
