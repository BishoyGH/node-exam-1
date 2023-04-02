import mongoose from 'mongoose';

const relashionSchema = mongoose.Schema({
  fromId: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  targetId: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  approved: {
    type: Boolean,
    default: false,
  },
});

const relashionModel = mongoose.model('relashion', relashionSchema);

export default relashionModel;
