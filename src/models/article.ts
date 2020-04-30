import mongoose, { Schema, Document } from 'mongoose';

export interface ArticleInterface extends Document {
  title: string;
  author: string;
  body: string;
  views: number;
  createdDate: Date;
  updatedDate: Date;
}

const ArticleSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: {
      createdAt: 'createdDate',
      updatedAt: 'updatedDate',
    },
  }
);

const Article = mongoose.model<ArticleInterface>('Article', ArticleSchema);

export default Article;
