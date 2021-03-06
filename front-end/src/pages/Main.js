import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import io from 'socket.io-client';

import api from '../services/api';
import logo from '../assets/logo.svg';
import like from '../assets/like.svg';
import itsaMatch from '../assets/itsamatch.png';
import empty from '../assets/empty.png';
import dislike from '../assets/dislike.svg';
import './Main.css';



export default function Main( { match }) {
    const [ users, setUsers ] = useState([]);
    const [ matchDev, setMatchDev ] = useState(null);
    const userAvatar = localStorage.getItem('userAvatar');
    const userName = localStorage.getItem('userName');

    useEffect(() => {
        async function loadUsers() {
            const response = await api.get('/devs', {
                headers: {
                    user: match.params.id
                }
            });

            setUsers(response.data);
        }

        loadUsers();
    }, [match.params.id]);


    useEffect(() => {
       const socket = io('http://localhost:3333', {
           query: { user: match.params.id }
       });
       
       socket.on('match', dev => {
           setMatchDev(dev);
       })
    }, [match.params.id]);

    async function handleLike(id) {
        await api.post(`/devs/${id}/likes`, null, {
            headers: { user: match.params.id },
        })

        setUsers(users.filter(user => user._id /= id ));

    }

    async function handleDislike(id) {
        await api.post(`/devs/${id}/dislikes`, null, {
            headers: { user: match.params.id },
        })

        setUsers(users.filter(user => user._id /= id ));
    }

    return (
      <div className="main-container">
          <div className="top-container">
          <Link to="/">
                <img src={logo} alt="Tindev" />
            </Link>
            <img className="avatarImg" src={userAvatar} alt="Avat" />
           
               <strong>{`Welcome: ${userName}`}</strong>  
        </div>
           { users.length > 0 ? (
              <ul>
                 {users.map(user => (
                   <li key={user._id}>
                      <img src={user.avatar} alt= "" />
                      <footer>
                        <stromp>{user.name}</stromp>
                        <p>{user.bio}</p>
                      </footer> 
                     <div className="buttons">
                         <button type="button" onClick={()=> handleDislike(user._id)}>
                             <img src={dislike} alt="dislike" />
                         </button>
                         <button type="button" onClick={()=> handleLike(user._id)}>
                             <img src={like} alt="like" />
                         </button>
                      </div>
                    </li>
                   ))}  
              </ul>
              ) : (
                  <div className="empty">
                       <img src={empty} alt= "" />
                       <strong> No have More Devs :( </strong>
                  </div>
              )} 

              { matchDev && (
                  <div className="match-container">
                      <img src={itsaMatch} alt="It's a match" />
                      <img className="avatar" src= {matchDev.avatar} alt="" />
                      <strong>{matchDev.name}</strong>
                      <p>{matchDev.bio}</p>
                      <button type="button" onClick={ () => setMatchDev(null) } >Close</button>

                  </div>
              )} 
          
      </div>
    )
}