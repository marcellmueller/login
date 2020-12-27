import { useHistory } from 'react-router-dom';
import './User.scss';
import axios from 'axios';
export default function User(props) {
  const history = useHistory();

  const loginClick = () => {
    console.log(props);
    history.push('/login');
  };

  const logoutClick = () => {
    axios.get('/logout').then((response) => {
      history.push('/login');
      props.setUser(false);
    });
  };

  return (
    <section className="user">
      {props.user && <h3 className="user-h3">{props.user.name}</h3>}
      {props.user && (
        <button className="user-logout" onClick={logoutClick}>
          Logout
        </button>
      )}
      {!props.user && (
        <button className="user-login" onClick={loginClick}>
          Login
        </button>
      )}
    </section>
  );
}