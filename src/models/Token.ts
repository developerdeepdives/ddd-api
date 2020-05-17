import mongoose, { Schema, Document } from 'mongoose';

export interface TokenInterface extends Document {
  user: string;
  token: string;
  createdAt: Date;
}

const TokenSchema: Schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  token: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now, expires: 43200 },
});

const Token = mongoose.model<TokenInterface>('Token', TokenSchema);

export default Token;
