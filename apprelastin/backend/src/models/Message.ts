import mongoose, { Schema, InferSchemaType } from "mongoose";

const MessageSchema = new Schema(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: "Conversation", index: true, required: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, default: "" },
    type: { type: String, enum: ["text", "gift"], default: "text" },
    flags: {
      hideFromAI: { type: Boolean, default: false },
      warningShown: { type: Boolean, default: false },
    },
    sentAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export type Message = InferSchemaType<typeof MessageSchema> & { _id: mongoose.Types.ObjectId };
export const MessageModel = mongoose.models.Message || mongoose.model("Message", MessageSchema);
