import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

function SignUp() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(" Clicked", userData);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/user/signup ",
        userData
      );
      console.log(response);
      if (response.data.success === true) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.warn(response.data.message);
      }
    } catch (error) {
      console.log(console.log(error));
      toast.error(`${error.message}: Try again later..`);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((pd) => ({ ...pd, [name]: value }));
    // console.log(name, value);
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-200">
      <div className="bg-white shadow-lg rounded-xl p-8 w-96">
        <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
          ✍️chatify
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Name"
            className="px-4 py-2 border rounded-lg focus:ring-1 focus:ring-blue-800  outline-none"
            required
            autoFocus
            name="name"
            value={userData.name}
            onChange={handleChange}
          />

          <input
            type="email"
            placeholder="Email"
            className="px-4 py-2 border rounded-lg focus:ring-1 focus:ring-blue-800 outline-none"
            required
            name="email"
            value={userData.email}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Password"
            className="px-4 py-2 border rounded-lg focus:ring-1 focus:ring-blue-800 outline-none"
            required
            name="password"
            value={userData.password}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Phone Number"
            className="px-4 py-2 border rounded-lg focus:ring-1 focus:ring-blue-800 outline-none"
            required
            name="phoneNumber"
            value={userData.phoneNumber}
            onChange={handleChange}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/\D/g, "");
              e.target.value = e.target.value.slice(0, 10);
              const phoneNumber = e.target.value;
              if (phoneNumber.length === 10) {
                const number = parseInt(phoneNumber, 10);
                if (number < 6000000000 || number > 9999999999) {
                  e.target.setCustomValidity(
                    "Phone number must be between 6000000000 and 9999999999."
                  );
                } else {
                  e.target.setCustomValidity("");
                }
              } else {
                e.target.setCustomValidity(
                  "Phone number must be exactly 10 digits."
                );
              }
            }}
          />

          <button
            type="submit"
            className="bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-700 transition-all"
          >
            Sign Up
          </button>
          <p className="text-end text-sm">
            <Link to="/login" className="hover:text-blue-300">
              Log-In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
