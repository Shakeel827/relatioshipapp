import mongoose, { Schema, InferSchemaType } from "mongoose";

const InviteSchema = new Schema(
  {
    code: { type: String, unique: true, index: true, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    acceptedBy: { type: Schema.Types.ObjectId, ref: "User" },
    conversationId: { type: Schema.Types.ObjectId, ref: "Conversation" },
    expiresAt: { type: Date, default: () => new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) }, // 7 days
  },
  { timestamps: true }
);

export type Invite = InferSchemaType<typeof InviteSchema> & { _id: mongoose.Types.ObjectId };
export const InviteModel = mongoose.models.Invite || mongoose.model("Invite", InviteSchema);
