import React, { useContext, useState } from 'react'
import axios from 'axios'
import { UserContext } from './userContext';
export default function Register() {
    const [username, setUsername] = useState('');
  const [password, setPassword] = useState('')
  
  const [isloginOrRegister, setIsloginOrRegister] = useState("login");
  const { setUsername:setUsernameAsLongin, setId } = useContext(UserContext);
    async function register(ev) {
      ev.preventDefault();
      const url = isloginOrRegister === 'register' ? 'register' : 'login';
      const { data } = await axios.post(url, { username, password });
      setUsernameAsLongin(username);
      setId(data._id)
      // console.log(data);
      
       
    }

  return (
    <div className="bg-gray-500 h-screen flex items-center">
      <form className="w-64 mx-auto mb-12" onSubmit={register}>
      <h2 className='flext text-center colo bg-slate-700 text-2xl rounded-lg mb-4 p-2 text-white '>Lets Start Chat</h2>
        <input
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
          type="text"
          placeholder="User Name"
          className="block w-full rounded-sm p-2 mb-2 border "
        />
        <input
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          type="password"
          placeholder="Password"
          className="block w-full rounded-sm p-2 mb-2 border"
        />
        <button className="bg-black text-white block w-full rounded-sm">
          {isloginOrRegister === "register" ? "Register" : "Login"}
        </button>
        <div className="text-center mt-2">
          {isloginOrRegister === "register" && (
            <div>
              Already a member?{" "}
              <button onClick={() => setIsloginOrRegister("login")}>
                Login here
              </button>
            </div>
          )}
          {isloginOrRegister === "login" && (
            <div>
              Don't have an account?{" "}
              <button onClick={() => setIsloginOrRegister("register")}>
                Register 
              </button>
            </div>
          )}

        </div>
      </form>
    </div>
  );
}
