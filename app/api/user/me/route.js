import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDB } from "@/libs/mongoDB";
import User from "../../../models/UserSchema";

export async function GET(request) {
  try {
    await connectToDB();

    const authorizationHeader = request.headers.get('Authorization');

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized: Missing or invalid token format' }, { status: 401 });
    }

    const token = authorizationHeader.split(' ')[1];

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized: Token not provided' }, { status: 401 });
    }

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

      const user = await User.findById(decodedToken.userId).select('-password'); 

      if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }

      return NextResponse.json({ userId: user._id.toString(), username: user.username }, { status: 200 });

    } catch (error) {
      console.error('JWT verification error:', error);
      return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
    }

  } catch (error) {
    console.error('Error in /api/user/me:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}