/**
 * User Model - Mongoose Schema
 * Covers: Schema Design, Data Types, Constraints, Validation
 */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
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
      unique:    true,
      lowercase: true,
      trim:      true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
    },
    role: {
      type:    String,
      enum:    { values: ['admin', 'editor', 'viewer'], message: 'Role must be admin, editor, or viewer' },
      default: 'viewer',
    },
    isActive: {
      type:    Boolean,
      default: true,
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

userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

module.exports = mongoose.model('User', userSchema);
