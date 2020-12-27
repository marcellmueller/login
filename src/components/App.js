import { useState, useEffect } from 'react';
import { Route, BrowserRouter, Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import axios from 'axios';
import './App.scss';
import Nav from './Nav';
import Login from './Login';
import Create from './Create';
import Home from './Home';
const history = createBrowserHistory();

export default function App() {
  const [user, setUser] = useState('');

  const getUser = () => {
    const promise = axios.get('/login').then((response) => {
      if (response.data) {
        setUser(response.data);
      } else {
        user(false);
        history.push('/login');
      }
    });
    return promise;
  };

  useEffect(() => {
    getUser();
    history.push('/login');
  }, []);

  return (
    <BrowserRouter>
      <div className="App">
        <Nav setUser={setUser} user={user}></Nav>
        <section className="main-container">
          <Route
            exact
            path="/"
            render={(props) => (
              <Home {...props} user={user} setUser={setUser} />
            )}
            replace
          />
          <Route
            path="/login"
            render={(props) => <Login {...props} setUser={setUser} />}
          />
          <Route path="/create" component={Create} />
        </section>
      </div>
    </BrowserRouter>
  );
}
