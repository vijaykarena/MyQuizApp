import Quiz from '@/app/models/QuizSchema';
import jwt from 'jsonwebtoken';
import { connectToDB } from '@/libs/mongoDB';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function POST(request) {
  try {
    await connectToDB();
    const { quizTitle, icon, quizQuestions } = await request.json();
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized: Missing token' }, { status: 401 });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key'); // 
    const userId = decodedToken.userId;

    const newQuiz = await Quiz.create({
      quizTitle, 
      icon, 
      quizQuestions, 
      userId: new mongoose.Types.ObjectId(userId) });

      return NextResponse.json({
        id: newQuiz._id,
        message: 'The quiz has been created successfully.',
      }, { status: 201 });

  } catch (error) {
    console.error('Error creating quiz:', error);
    return NextResponse.json({ message: 'Failed to create quiz' }, { status: 500 });
  }

}

export async function GET(request) {
  try {
    await connectToDB();
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized: Missing token' }, { status: 401 });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const userId = decodedToken.userId;

    const quizzes = await Quiz.find({ userId: new mongoose.Types.ObjectId(userId) });

    // console.log("check quizzes in get requist->",quizzes);
    

    return NextResponse.json(quizzes, { status: 200 });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json({ message: 'Failed to fetch quizzes' }, { status: 500 });
  }
  // await connectToDB();
  // const quizzes = await Quiz.find();
  // try {
  //   return NextResponse.json({ quizzes });
  // } catch (error) {
  //   return NextResponse.json({ message: error });
  // }
}

export async function PUT(request) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    let quizToUpdate = await Quiz.findById(id);

    const { updateQuiz, updateQuizQuestions } = await request.json();
    // Update properties of quizToUpdate
    if (updateQuiz) {
      quizToUpdate.icon = updateQuiz.icon;
      quizToUpdate.quizTitle = updateQuiz.quizTitle;
      quizToUpdate.quizQuestions = updateQuiz.quizQuestions;
    }

    if (updateQuizQuestions) {
      quizToUpdate.quizQuestions = updateQuizQuestions;
    }

    await quizToUpdate.save();
    return NextResponse.json({ message: 'success' });
  } catch (error) {
    console.log(error);
  }
}

export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get('id');
  await connectToDB();
  await Quiz.findByIdAndDelete(id);
  return NextResponse.json({ message: 'quiz deleted' });
}
