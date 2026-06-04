/**
 * Contact Model - Mongoose Schema
 * For contact form submissions
 */

const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: {
      type:      String,
      required:  [true, 'Name is required'],
      trim:      true,
      minlength: [2,  'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type:      String,
      required:  [true, 'Email is required'],
      lowercase: true,
      trim:      true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
    },
    message: {
      type:      String,
      required:  [true, 'Message is required'],
      trim:      true,
      minlength: [10, 'Message must be at least 10 characters'],
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    isRead: {
      type:    Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model('Contact', contactSchema);
