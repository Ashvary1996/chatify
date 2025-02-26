import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

function LogIn() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: "",
    phoneNumber: "",
    password: "",
  });

  const [loginWith, setLoginWith] = useState("email");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Submit Clicked", userData);
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post(
        "http://localhost:8000/api/user/login",
        userData
      );
      // console.log("manualYresponse", response);
      if (response.data.success === true) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/home");
        }, 2000);
      }
    } catch (error) {
      console.log(console.log(error));
      if (error.response.data.success === false) {
        toast.warn(error.response.data.message);
      } else toast.error(`${error.message}: Try again later..`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-200">
      <div className="bg-white shadow-lg rounded-xl p-8 w-96">
        <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
          ✍️chatify
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {loginWith === "email" ? (
            <input
              type="email"
              placeholder="Email"
              className="px-4 py-2 border rounded-lg focus:ring-1 focus:ring-blue-800 outline-none"
              required
              name="email"
              value={userData.email}
              onChange={handleChange}
            />
          ) : (
            <input
              type="text"
              placeholder="Phone Number"
              className="px-4 py-2 border rounded-lg focus:ring-1 focus:ring-blue-800 outline-none"
              required
              name="phoneNumber"
              value={userData.phoneNumber}
              onChange={handleChange}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
                const number = parseInt(e.target.value, 10);
                e.target.setCustomValidity(
                  number >= 6000000000 && number <= 9999999999
                    ? ""
                    : "Enter a valid phone number"
                );
              }}
            />
          )}

          <input
            type="password"
            placeholder="Password"
            className="px-4 py-2 border rounded-lg focus:ring-1 focus:ring-blue-800 outline-none"
            required
            name="password"
            value={userData.password}
            onChange={handleChange}
          />
          <div className="flex justify-center mb-4">
            <button
              className={`px-4 py-1 rounded-l-lg ${
                loginWith === "email"
                  ? "bg-orange-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setLoginWith("email")}
            >
              Email
            </button>
            <button
              className={`px-4 py-1 rounded-r-lg ${
                loginWith === "number"
                  ? "bg-orange-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setLoginWith("number")}
            >
              Phone
            </button>
          </div>

          <button
            type="submit"
            className="bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-700 transition-all"
          >
            Log-In
          </button>

          <p className="text-end text-sm">
            <Link
              to="/signup"
              title="Go to Sign-Up"
              className="hover:text-blue-500"
            >
              Sign-Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LogIn;
