import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const VerifyEmail = () => {
  const { token } = useParams(); // get token from URL
  const [status, setStatus] = useState("Verifying...");
  const navigate = useNavigate();

  const verifyEmail = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/verify",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        setStatus("✅ Email Verified Successfully");

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      setStatus("❌ Verification failed. Please try again");
    }
  };

  useEffect(() => {
    if (token) verifyEmail();
  }, [token]);

  return (
    <div className="relative w-full h-[760px] bg-pink-100 overflow-hidden">
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white p-6 rounded-2xl shadow-md text-center w-[90%] max-w-md">
          <h2 className="text-xl font-semibold text-green-500 mb-4">
            {status}
          </h2>

          <p className="text-gray-500 text-sm">
            We’ve sent you an email to verify your account. Please check your
            inbox and click the verification link.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
