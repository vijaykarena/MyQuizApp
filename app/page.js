"use client";
import { useEffect } from "react";
import Navbar from "./Components/Navbar";
import QuizzesArea from "./Components/QuizzesArea";
import useGlobalContextProvider from "./ContextApi";

export default function Home() {
  const { quizToStartObject, selectedQuizObject } = useGlobalContextProvider();
  const { setSelectQuizToStart } = quizToStartObject;
  const { setSelectedQuiz } = selectedQuizObject;

  useEffect(() => {
    setSelectQuizToStart(null);
    setSelectedQuiz(null);
  }, []);

  return (
    <div className="h-screen bg-[url('/questionbg.jpg')]">
      <header>
        <Navbar />
      </header>
      <QuizzesArea />
    </div>
  );
}
