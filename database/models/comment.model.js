import mongoose from 'mongoose';

const commentSchema = mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    postId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    isDeleted: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

const commentModel = mongoose.model('comment', commentSchema);

export default commentModel;
