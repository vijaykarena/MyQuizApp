"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useGlobalContextProvider from "../ContextApi";

const AuthPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState(""); // For both login and signup
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { updateAuthStatus, userObject } = useGlobalContextProvider();
  const { setUser } = userObject;
  const router = useRouter();

  const toggleSignup = () => {
    setIsSignup(!isSignup);
    setError("");
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");

    if (isSignup) {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      try {
        const response = await fetch("/api/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
          if (data.token) {
            updateAuthStatus(data.token);
          }
          if (data.username) {
            setUser(prevUser => ({ ...prevUser, isLogged: true, name: data.username })); 
          }
          router.push('/');
        } else {
          setError(data.message || 'Signup failed');
        }
      } catch (error) {
        console.error("Signup error:", error);
        setError("An unexpected error occurred");
      }
    } else {
      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
          updateAuthStatus(data.token);
          if (data.username) {
            setUser(prevUser => ({ ...prevUser, isLogged: true, name: data.username }));
          }
          router.push("/");
        } else {
          setError(data.message || "Login failed");
        }
      } catch (error) {
        console.error("Login error:", error);
        setError("An unexpected error occurred");
      }
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-[url('/questionbg.jpg')] bg-cover">
      <div className=" p-8 bg-white rounded-md shadow-md w-96 ">
        <h1 className="text-center mb-6 text-green-700">
          {isSignup ? "Sign Up" : "Login"}
        </h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleAuth}>
          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="username"
              className="block mb-2 font-bold text-sm text-green-700"
            >
              Username:
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 rounded border border-gray-300 text-sm"
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="password"
              className="block mb-2 font-bold text-sm text-green-700"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 rounded border border-gray-300 text-sm"
            />
          </div>

          {isSignup && (
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                htmlFor="confirmPassword"
                className="block mb-2 font-bold text-sm text-green-700"
              >
                Confirm Password:
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3 py-2 rounded border border-gray-300 text-sm"
              />
            </div>
          )}

          <button
            type="submit"
            className="bg-green-700 text-white px-6 py-3 rounded-md border-none cursor-pointer text-lg w-full block"
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-green-700">
          {isSignup ? (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                onClick={toggleSignup}
                className="text-green-700 font-bold border-none bg-none cursor-pointer"
              >
                Log in
              </button>
            </p>
          ) : (
            <p>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={toggleSignup}
                className="font-bold border-none bg-none cursor-pointer"
              >
                Sign up
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
