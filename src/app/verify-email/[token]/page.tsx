"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

const VerifyEmailPage = ({ params }: { params: { token: string } }) => {
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [message, setMessage] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.post(`http://localhost:5000/auth/verify-email/${params.token}`);
        if (res.data?.success) {
          setStatus("success");
          setMessage("Your email has been verified! You can now log in.");
          setTimeout(() => router.push("/login"), 2000);
        } else {
          setStatus("error");
          setMessage(res.data?.message || "Verification failed.");
        }
      } catch (err: any) {
        setStatus("error");
        setMessage(err.response?.data?.message || "Verification failed.");
      }
    };
    verify();
  }, [params.token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4">Email Verification</h2>
        {status === "verifying" && <p>Verifying your email...</p>}
        {status === "success" && <p className="text-green-600">{message}</p>}
        {status === "error" && <p className="text-red-600">{message}</p>}
      </div>
    </div>
  );
};

export default VerifyEmailPage; 