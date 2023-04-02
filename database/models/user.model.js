import mongoose from 'mongoose';
/*************************************
 * Model Validation Expressions
 *************************************/
const EMAIL_REGEXP =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
const NAME_REGEXP = /^([a-zA-Z]{2,12} ?){2,5}$/; // Full Name
/*************************************
 * User Schema
 *************************************/
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      validate: {
        validator: (v) => NAME_REGEXP.test(v),
        message: 'This is not valid name.',
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v) => EMAIL_REGEXP.test(v),
        message: 'This is not valid email.',
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 32,
    },
    age: {
      type: Number,
      required: true,
      min: [13, 'You are too young to register.'],
      max: [150, 'The age you entered is not valid'],
    },
    profilePic: {
      type: String,
      default: 'profile.svg',
    },
    lastLogout: {
      type: Date,
    },
    isEmailValidated: {
      type: Boolean,
      default: false,
      required: true,
    },
    isAccountActive: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
/*************************************
 * User Model
 *************************************/
const userModel = mongoose.model('user', userSchema);

export default userModel;
