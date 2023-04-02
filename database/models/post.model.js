import mongoose from 'mongoose';

const postSchema = mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      minLength: 1,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    visibility: {
      type: String,
      enum: ['public', 'friends', 'only me', 'deleted'],
      default: 'public',
    },
  },
  { timestamps: true }
);
const postModel = mongoose.model('post', postSchema);

export default postModel;
