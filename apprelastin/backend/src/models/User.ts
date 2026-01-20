import mongoose, { Schema, InferSchemaType } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, index: true },
    phone: { type: String, index: true },
    passwordHash: { type: String },
    name: { type: String, required: true },
    photoUrl: { type: String },
    settings: {
      aiEnabled: { type: Boolean, default: true },
      warningsEnabled: { type: Boolean, default: true },
      privateMode: { type: Boolean, default: false },
      notifications: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export type User = InferSchemaType<typeof UserSchema> & { _id: mongoose.Types.ObjectId };
export const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);
