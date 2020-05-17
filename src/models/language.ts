import mongoose, { Schema, Document } from 'mongoose';

export interface LanguageInterface extends Document {
  title: string;
}

const LanguageSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
});

const Language = mongoose.model<LanguageInterface>('Language', LanguageSchema);

export default Language;
