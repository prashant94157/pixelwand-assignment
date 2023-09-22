import mongoose from 'mongoose';

const sessionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    isActive:{
      type: Boolean,
      required: true,
      default: true
    }
  },
  { timestamps: true }
);

const Session = mongoose.model('Session', sessionSchema);
export default Session;
