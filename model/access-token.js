import mongoose from "mongoose";
const Schema = mongoose.Schema;

const accessTokenSchema = new Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  isRevoked: {
    type: Boolean,
    required: false,
    default: false,
  },
  expiresAt: {
    type: Date,
    required: false,
  },
});

const AccessToken = mongoose.model("access_tokens", accessTokenSchema);

export default AccessToken;
