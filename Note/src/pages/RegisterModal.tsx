import React, { useState } from "react";
import axios from "axios";
import { config } from "../config";

interface Props {
  onClose: () => void;
}

const RegisterModal: React.FC<Props> = ({ onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setconfirmpassword] = useState("");

  const handleRegister = async(e: React.FormEvent) => {
    e.preventDefault();
    try{
        const res = await axios.post(`${config.BASE_URL}/auth/register`,{
            user_name :name ,
        user_email : email,
        password :password,

        });

        console.log(res,'getting resposne')
        alert(res.data.msg)

        onClose();
    }catch(e){
 alert('user register failed')
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70  bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Register</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full border border-gray-300 p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

         
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Register
          </button>
        </form>
        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-500 hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default RegisterModal;
