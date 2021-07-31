import React, { useEffect, createContext, useReducer ,useContext} from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom';
import Home from './components/screens/Home';
import Profile from './components/screens/Profile';
import Signin from './components/screens/Signin';
import Signup from './components/screens/Signup';
import CreatePost from './components/screens/CreatePost';
import UserProfile from './components/screens/UserProfile';
import { initialState, reducer } from './components/reducers/userReducer';

// useReducer is similar to useState hook but we use useReducer with createContext hook

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  // doing this to again provide the content to the user when he opens tha app, if closed the app without signing out then details will be still available in the Context variables.
  const {state, dispatch} = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({type:"USER",payload:user});
      // we do not need to redirect the user to Home page if we do not have the user info 
      // history.push('/');
    }
    else {
      history.push('/signin');
    }
  }, []);

  return (
    <Switch> {/* switch makes sure that any one of the router will be active at a time */}
      <Route exact path="/">
        {/* using exact will make browser to look for exactly / only */}
        <Home />
      </Route>
      <Route path="/signin">
        <Signin />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      {/* as userprofile is a nested url for profile section*/}
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route path="/createpost">
        <CreatePost />
      </Route>
      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
    </Switch>
  );
}

function App() {
  // here we can't use history inside the app, as we have used browserRouter inside App.(or wrapped app with browserRouter) so prevent from this we are creating separate routing function so we will be able to use history inside the browserRouter inside Routing component  

  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
   </UserContext.Provider>
  );
}

export default App;
