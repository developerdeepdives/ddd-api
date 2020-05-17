import mongoose, { Schema, Document } from 'mongoose';

export interface TestInterface {
  body: string;
  language: string;
}

export interface ChallengeInterface extends Document {
  title: string;
  author: string;
  description: string;
  createdDate: Date;
  updatedDate: Date;
  tests: TestInterface[];
  startCode: string;
}

const ChallengeSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tests: [
      {
        body: {
          type: String,
          required: true,
        },
        language: {
          type: Schema.Types.ObjectId,
          ref: 'Language',
          required: true,
        },
      },
    ],
    startCode: {
      type: String,
      required: true,
      default: '',
    },
  },
  {
    timestamps: {
      createdAt: 'createdDate',
      updatedAt: 'updatedDate',
    },
  }
);

const Challenge = mongoose.model<ChallengeInterface>(
  'Challenge',
  ChallengeSchema
);

export default Challenge;
