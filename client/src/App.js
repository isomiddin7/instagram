import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";
import Profile from "./components/pages/Profile";
import CreatePost from "./components/pages/CreatePost";
import { useEffect, createContext, useReducer, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { initialState, reducer } from './reducers/userReducer'
import UserProfile from "./components/pages/UserProfile";
import FollowedUserPost from "./components/pages/FollowedUserPost";

export const UserContext = createContext();

const Routing = () => {
  const navigate = useNavigate();
  const {state, dispatch} = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      dispatch({ type: "USER", payload: user });
      // navigate("/");
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/create" element={<CreatePost />} />
      <Route path="/user_profile/:userId" element={<UserProfile />} />
      <Route path="/followedUserPost" element={<FollowedUserPost />} />
    </Routes>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
      <UserContext.Provider value={{ state, dispatch }}>
        <Navbar />
        <Routing />
      </UserContext.Provider>
  )
}

export default App;
