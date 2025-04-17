import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { connectToDB } from "@/libs/mongoDB";
import jwt from 'jsonwebtoken'; 
// import User from '../../../models/User'; 
import User from "../../models/UserSchema"; 

export async function POST(request) {
    try {
      const { username, password } = await request.json();
  
      if (!username || !password) {
        return NextResponse.json({ message: 'Please provide both username and password' }, { status: 400 });
      }
  
      await connectToDB();
  
      const existingUser = await User.findOne({ username });
  
      if (existingUser) {
        return NextResponse.json({ message: 'Username already exists' }, { status: 409 });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({
        username,
        password: hashedPassword,
        isLogged: false, // Set the initial isLogged state during signup
      });
  
      const savedUser = await newUser.save();

    const token = jwt.sign({ userId: savedUser._id, username: savedUser.username }, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '24h',
    });
  
    return NextResponse.json({ message: 'User created successfully', token, username: savedUser.username }, { status: 201 });
  
    } catch (error) {
      console.error('Signup error:', error);
      return NextResponse.json({ message: 'Something went wrong during signup' }, { status: 500 });
    }
  }