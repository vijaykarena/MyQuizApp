"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
function PlaceHolder(props) {
  const router = useRouter();
  return (
    <div className="poppins flex-col gap-3   p-4 flex justify-center items-center  ">
      <Image src="/emptyBox.png" alt="" width={130} height={130} />
      <h2 className="text-2xl font-bold">Quizzes await! Make one.</h2>
      <span className="text-[13px] font-light">
        Click below to begin your journey here...
      </span>
      <button
        onClick={() => {
          router.push("/quiz-build");
        }}
        className="p-3 px-4 text-white text-[12px] bg-green-700 rounded-md"
      >
        Create my first Quiz
      </button>
    </div>
  );
}

export default PlaceHolder;
