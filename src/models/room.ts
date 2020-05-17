import mongoose, { Schema, Document } from 'mongoose';

export interface RoomInterface extends Document {
  title: string;
  owner: string;
  createdDate: Date;
  members: string[];
  currentChallenge: string;
  code: string;
}

const RoomSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    currentChallenge: {
      type: Schema.Types.ObjectId,
      ref: 'Challenge',
    },
    code: {
      type: String,
      required: true,
      default: '',
    },
  },
  {
    timestamps: {
      createdAt: 'createdDate',
      updatedAt: false,
    },
  }
);

const Room = mongoose.model<RoomInterface>('Room', RoomSchema);

export default Room;
