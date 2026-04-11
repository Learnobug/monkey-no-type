"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      username,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="bg-[#2c2e31] p-10 rounded-xl w-full max-w-md">
        <h1 className="text-[#e2b714] text-3xl font-bold text-center mb-2">
          monkey-no-type
        </h1>
        <p className="text-[#646669] text-center mb-8 text-sm">
          {isRegister ? "Create an account" : "Sign in to continue"}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isRegister && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-[#323437] text-white px-4 py-3 rounded-md outline-none focus:ring-2 focus:ring-[#e2b714]"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-[#323437] text-white px-4 py-3 rounded-md outline-none focus:ring-2 focus:ring-[#e2b714]"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-[#323437] text-white px-4 py-3 rounded-md outline-none focus:ring-2 focus:ring-[#e2b714]"
          />

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-[#e2b714] text-black font-bold py-3 rounded-md hover:bg-yellow-400 disabled:opacity-50 transition-colors"
          >
            {loading ? "Please wait..." : isRegister ? "Register" : "Sign In"}
          </button>
        </form>

        <p className="text-[#646669] text-center mt-6 text-sm">
          {isRegister ? "Already have an account?" : "New here?"}{" "}
          <button
            onClick={() => { setIsRegister(!isRegister); setError(""); }}
            className="text-[#e2b714] hover:underline"
          >
            {isRegister ? "Sign In" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
}
