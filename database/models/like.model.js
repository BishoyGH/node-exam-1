import mongoose from 'mongoose';

const likeSchema = mongoose.Schema({
  postId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});

const likeModel = mongoose.model('like', likeSchema);

export default likeModel;
