import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; 
import { connectToDB } from "@/libs/mongoDB";
import User from "../../models/UserSchema"; 

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ message: 'Please provide both username and password' }, { status: 400 });
    }

    await connectToDB();

    const user = await User.findOne({ username });

    if (!user) {
      return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '24h', 
    });

    return NextResponse.json({ message: 'Login successful', token, username: user.username }, { status: 200 });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Something went wrong during login' }, { status: 500 });
  }
}