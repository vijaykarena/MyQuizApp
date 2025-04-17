"use client";
import React from "react";
import Image from "next/image";
import useGlobalContextProvider from "../ContextApi";
import { useRouter } from "next/navigation";

function Navbar() {
  const { userObject, updateAuthStatus } = useGlobalContextProvider();
  const { user, setUser } = userObject;
  const router = useRouter();

  const handleLogout = () => {
    updateAuthStatus(null); 
    router.push("/");
  };

  return (
    <nav className=" poppins  mx-auto max-w-screen-xl p-4 sm:px-8 sm:py-5 lg:px-10">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="text-center sm:text-left">
          <a className="flex gap-1 items-center">
            <Image src="/quizSpark_icon.png" alt="" width={60} height={60} />
            <h2 className="text-2xl font-bold flex gap-2">
              My <span className="text-green-700">Quiz</span>App
            </h2>
          </a>
        </div>

        <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
          {user.isLogged && (
            <div className="flex gap-2">
              <span>Welcome: {user.name}</span>
            </div>
          )}

          {user.isLogged ? (
            <button
              className="block rounded-lg bg-green-700 px-7 py-3 text-sm font-medium text-white transition hover:bg-green-800 focus:outline-none"
              type="button"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <button
              className="block rounded-lg bg-green-700 px-7 py-3 text-sm font-medium text-white transition hover:bg-green-800 focus:outline-none"
              type="button"
              onClick={() => router.push("/auth")}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
