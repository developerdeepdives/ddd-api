import mongoose, { Schema, Document } from 'mongoose';

export interface UserInterface extends Document {
  name: string;
  bio: string;
  email: string;
  password: string;
  articles: string[];
  createdDate: Date;
  updatedDate: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    articles: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Article',
      },
    ],
  },
  {
    timestamps: {
      createdAt: 'createdDate',
      updatedAt: 'updatedDate',
    },
  }
);

const User = mongoose.model<UserInterface>('User', UserSchema);

export default User;
