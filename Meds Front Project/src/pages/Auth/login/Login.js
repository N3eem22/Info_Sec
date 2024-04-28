import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
//import "./style/login.css"
import axios from "axios";
import { setAuthUser } from "../../../helper/Storage";
import { useNavigate } from "react-router-dom";


const Login = ()=>{
  const navigate = useNavigate();
  const [login, setLogin] = useState({
    email: "",
    password: "",
    loading: false,
    err: [],
  });

  const LoginFun = (e) => {
    e.preventDefault();
    setLogin({ ...login, loading: true, err: [] });
    axios.post("http://localhost:4000/auth/login", {
      email: login.email,
      password: login.password,
    }, {
      withCredentials: true // This ensures cookies are sent with requests
    })
      .then((resp) => {
        setLogin({ ...login, loading: false, err: [] });
        setAuthUser(resp.data);
        sessionStorage.setItem("authUser", JSON.stringify(resp.data));
        navigate("/");
      })
      .catch((err) => {
        setLogin({
          ...login,
          loading: false,
          err: err.response.data.errors,
        });
        // console.log(login.err);
      });
  };

  return (
    <div className="login-container">
      <h1>Login Form</h1>

    
      {login.err.map((error, index) => (
        <Alert key={index} variant="danger" className="p-2">
          {error.msg}
        </Alert>
      ))}


        <Form onSubmit={LoginFun}>
        <Form.Group className="mb-3">
          <Form.Control
            type="email"
            placeholder="Email"
            required
            value={login.email}
            onChange={(e) => setLogin({ ...login, email: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Control
            type="password"
            placeholder="Password"
            required
            value={login.password}
            onChange={(e) => setLogin({ ...login, password: e.target.value })}
          />
        </Form.Group>

        <Button
          className="btn btn-dark w-100"
          variant="primary"
          type="submit"
          disabled={login.loading === true}>
          Login
        </Button>
      </Form>
      
    </div>
  );
}



export default Login;
