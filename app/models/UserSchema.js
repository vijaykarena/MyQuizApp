import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const userSchema = new Schema({

  isLogged: {
    type: Boolean,
    required: true,
  },

  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true, 
  },
  password: {
    type: String,
    required: true,
  },
  
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
