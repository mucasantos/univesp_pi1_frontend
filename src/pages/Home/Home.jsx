import "./Home.css";

import { Navigate } from "react-router-dom";

import { isAuthenticated } from "../../services/auth";

import Signin from "../../components/Signin/Signin";
import Navbar from "../../components/Navbar/Navbar";

const Home = () => {
  return (

    <>
      <div className="Home">
        <Navbar />
        <div className="signinArea">
          {
            isAuthenticated() ?
            (
              <Navigate to="/supply" />
              ) : (
              <Signin />
            )
          }
        </div>
      </div>
    </>
  )
};

export default Home;
