import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface UserInterface extends Document {
  name: string;
  bio: string;
  email: string;
  password: string;
  articles: string[];
  challenges: string[];
  createdDate: Date;
  updatedDate: Date;
  emailVerified: boolean;
  comparePassword: (password: string) => Promise<boolean>;
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
      unique: true,
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
    challenges: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Challenge',
      },
    ],
    emailVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    room: {
      type: Schema.Types.ObjectId,
      ref: 'Room',
    },
  },
  {
    timestamps: {
      createdAt: 'createdDate',
      updatedAt: 'updatedDate',
    },
  }
);

UserSchema.methods.comparePassword = async function (password: string) {
  const isValid = await bcrypt.compare(password, this.password);
  return isValid;
};

UserSchema.pre<UserInterface>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model<UserInterface>('User', UserSchema);

export default User;
