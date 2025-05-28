import axios from 'axios';
import React, { useState } from 'react';
import { config } from '../config';

interface Props {
  onClose: () => void;
}

const LoginModal: React.FC<Props> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async(e: React.FormEvent) => {
    e.preventDefault();
    try{
        const res = await axios.post(`${config.BASE_URL}/auth/login`,{
            user_email:email,
            password:password
        });
        console.log(res);
        onClose();
        alert('Login Sucessfully')
    }catch(e){
alert('Login Failed')
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 p-2 rounded"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 p-2 rounded"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Login
          </button>
        </form>
        <button onClick={onClose} className="mt-4 text-sm text-gray-500 hover:underline">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
