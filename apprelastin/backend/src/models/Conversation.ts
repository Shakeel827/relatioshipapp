import mongoose, { Schema, InferSchemaType } from "mongoose";

const ConversationSchema = new Schema(
  {
    members: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    aiEnabled: { type: Boolean, default: true },
    startedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export type Conversation = InferSchemaType<typeof ConversationSchema> & { _id: mongoose.Types.ObjectId };
export const ConversationModel =
  mongoose.models.Conversation || mongoose.model("Conversation", ConversationSchema);
