"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", {
        callbackUrl: "/",
        redirect: true,
      });
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex flex-col gap-6 items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col gap-6 items-center justify-center min-h-screen">
        <FcGoogle size={60} />
        <button
          onClick={handleGoogleSignIn}
          className="bg-red-600 hover:bg-red-700 transition-colors text-white px-6 py-3 rounded-md flex items-center gap-2 shadow-md"
        >
          <span>Login with Google</span>
        </button>
      </div>
    );
  }

  return null;
}
