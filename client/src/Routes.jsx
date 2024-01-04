import { useContext } from 'react';
import Register from './Register'
import { UserContext } from './userContext';
import Chat from './Chat';

export default function Routes() {

      const { username,id } = useContext(UserContext);
    if (username) {
        return <Chat/>
      }
  return (
    <Register/>
  )
}
