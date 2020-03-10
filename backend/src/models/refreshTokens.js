import mongoose from "mongoose";

const RefreshTokenSchema = mongoose.Schema({
  refreshToken: String
});

const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);

export default RefreshToken;