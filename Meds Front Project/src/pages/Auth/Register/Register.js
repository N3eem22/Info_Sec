import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import "../Register/style/Register.css"
import { setAuthUser } from "../../../helper/Storage";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [register, setRegister] = useState({
    email: "",
    password: "",
    name: "",
    Phone_Number: "",
    loading: false,
    err: [],
  });

  const RegisterFun = (e) => {
    e.preventDefault();
    setRegister({ ...register, loading: true, err: [] });
    axios
      .post("http://localhost:4000/auth/register",  {
        email: register.email  || "sasa@gmail.com",
        password: register.password,
        name: register.name,
        Phone_Number: register.Phone_Number,
      }, {
        withCredentials: true // This ensures cookies are sent with requests
      })
      .then((resp) => {
        setRegister({ ...register, loading: false, err: [] });
        setAuthUser(resp.data.user);
        sessionStorage.setItem("Token", JSON.stringify(resp.data.Token));
        navigate("/");
      })
      .catch((errors) => {
        setRegister({
          ...register,
          loading: false,
          err: errors.response.data.errors,
        });
      });
  };

  return (
    <div className="login-container">
      <h1>Registration Form</h1>

      {register.err && register.err.map((error, index) => (
        <Alert key={index} variant="danger" className="p-2">
          {error.msg}
        </Alert>
      ))}

      <Form onSubmit={RegisterFun}>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Full Name"
            value={register.name}
            onChange={(e) => setRegister({ ...register, name: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Control
            type="email"
            placeholder="Email"
            value={register.email}
            onChange={(e) => setRegister({ ...register, email: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Control
            type="password"
            placeholder="Password"
            value={register.password}
            onChange={(e) => setRegister({ ...register, password: e.target.value })}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control
            type="number"
            placeholder="Phone Number"
            value={register.Phone_Number}
            onChange={(e) => setRegister({ ...register, Phone_Number: e.target.value })}
          />
        </Form.Group>

        <Button
          className="btn btn-dark w-100"
          variant="primary"
          type="submit"
          disabled={register.loading === true}>
          register
        </Button>
      </Form>
    </div>
  );
};

export default Register;
