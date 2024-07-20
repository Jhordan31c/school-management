import Spline from '@splinetool/react-spline';
import axios from 'axios';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '@/context/UserContext';

export default function LoginApp() {
  const { setUser, updateUser } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      if (!username || !password) {
        setError('Please enter both username and password.');
        return;
      }
      const response = await axios.post('http://localhost:8080/login', { username, password });

      const { roles, token, user_id } = response.data;

      if (!roles) {
        console.error('Roles not found in response');
        setError('Roles not found in response');
        return;
      }

      const filteredRole = roles.find(role => ['ROLE_ADMIN', 'ROLE_DOCENTE', 'ROLE_ALUMNO'].includes(role));

      if (!filteredRole) {
        setError('No valid roles found.');
        return;
      }

      const userData = { username, roles: [filteredRole], token, user_id };
      setUser(userData);

      // Fetch additional user data
      await updateUser(user_id, filteredRole);

      let path = '/auth/LoginApp';
      if (filteredRole === 'ROLE_ADMIN') {
        path = `/admin/home?${token}`;
      } else if (filteredRole === 'ROLE_DOCENTE') {
        path = `/educator/home?${token}`;
      } else if (filteredRole === 'ROLE_ALUMNO') {
        path = `/parent/innit?${token}`;
      }

      navigate(path);
    } catch (error) {
      if (error.message === 'El usuario no está matriculado, comuníquese con el director') {
        setError('El usuario no está matriculado, comuníquese con el director');
      } else {
        setError('Datos Incorrectos!');
      }
    }
  };

  return (
    <>
      <div className="bg-purple-900 absolute top-0 left-0 bg-gradient-to-b from-gray-900 via-gray-900 to-purple-800 bottom-0 leading-5 h-full w-full overflow-hidden"></div>
      <div className="relative min-h-screen flex justify-center items-center bg-transparent rounded-3xl shadow-xl">
        <div className="flex-col flex self-center lg:px-14 sm:max-w-4xl xl:max-w-md z-10">
          <div className="self-start hidden lg:flex flex-col text-gray-300"></div>
        </div>
        <div className="flex justify-center self-center z-10">
          <div className="p-12 bg-white mx-auto rounded-3xl w-96 pp">
            <div className="mb-7">
              <h3 className="text-center font-semibold text-2xl text-white">Inicie Sesion</h3>
            </div>
            <div className="space-y-6">
              <div>
                <input
                  className="w-full text-sm px-4 py-3 bg-gray-200 focus:bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                  type="type"
                  id='username'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Email"
                />
              </div>
              <div className="relative">
                <input
                  placeholder="Password"
                  type="password"
                  id='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-sm text-gray-600 px-4 py-3 rounded-lg w-full bg-gray-200 focus:bg-gray-100 border border-gray-200 focus:outline-none focus:border-purple-400"
                />
                {error && <p className="text-white mt-2">{error}</p>}
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm ml-auto">
                  <a href="#" className="text-purple-500 hover:text-purple-400">Forgot your password?</a>
                </div>
              </div>
              <div>
                <button type="submit" onClick={handleLogin} className="w-full flex justify-center bg-purple-800 hover:bg-purple-700 text-gray-100 p-3 rounded-lg tracking-wide font-semibold cursor-pointer transition ease-in duration-500">Ingresar</button>
              </div>
              <div className="flex justify-center gap-5 w-full"></div>
            </div>
          </div>
        </div>
        <Spline
          className="absolute bottom-0 left-0 z-0"
          scene="https://prod.spline.design/AVYcuaEZ2h6PdE2z/scene.splinecode"
        />
      </div>
      <footer className="bg-transparent absolute w-full bottom-0 left-0 z-30">
        <div className="container p-5 mx-auto flex items-center justify-between"></div>
      </footer>
      <svg className="absolute bottom-0 left-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path fill="#fff" fillOpacity="1" d="M0,0L40,42.7C80,85,160,171,240,197.3C320,224,400,192,480,154.7C560,117,640,75,720,74.7C800,75,880,117,960,154.7C1040,192,1120,224,1200,213.3C1280,203,1360,149,1400,122.7L1440,96L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"></path>
      </svg>
    </>
  );
}