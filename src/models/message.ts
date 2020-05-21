import mongoose, { Schema, Document } from 'mongoose';

export interface MessageInterface extends Document {
  body: string;
  author: string;
  room: string;
  createdDate: Date;
}

const MessageSchema: Schema = new Schema(
  {
    body: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    room: {
      type: Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: 'createdDate',
      updatedAt: false,
    },
  }
);

const Message = mongoose.model<MessageInterface>('Message', MessageSchema);

export default Message;
