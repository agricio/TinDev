import React, { useState } from 'react';
import './Login.css';
import logo from '../assets/logo.svg';
import api from '../services/api';
import empty from '../assets/empty.png';


export default function Login( { history }) {
  const [username, setUsername ] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const response = await api.post('/devs', { 
      username,
    })
    
    const { _id } = response.data;
    localStorage.setItem('userAvatar', response.data.avatar);
    localStorage.setItem('userName', response.data.name);
   
    history.push(`/dev/${ _id }`);
  }

    return (
        <div className="login-container">
          <form onSubmit={handleSubmit}>
            <img className="login-avatar" src={empty} alt="avatar"/>
            <img src={logo} alt="Tindev"/>
            <input 
              placeholder="Digite seu usuário no Github"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <button type="submit">Enviar</button>
          </form>
        </div>
      );
}
