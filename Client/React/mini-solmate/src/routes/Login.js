import React, { useContext, useState } from "react";
import { Form, Button, Nav } from "react-bootstrap";
import solmate_logo from "../images/solMate_logo.png";
import "../styles/Login.css";
import axios from "axios";
import { userContext } from "../context/userContext";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { dispatch } = useContext(userContext);

  async function loginUser(credentials) {
    console.log(credentials);
    return axios
      .post("http://localhost:3001/user/login", credentials, {
        headers: { "Content-Type": "application/json" },
      })
      .then(async (response) => {
        setToken(response.data.token);
        const res = await axios.get("http://localhost:3001/user", {
          params: {
            UserId: response.data.user.email,
          },
        });
        dispatch({ type: "SET_USER", payload: res.data[0] });
        // dispatch({ type: "SET_USER", payload: response.data.user });
      })
      .catch((error) => alert(error));
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await loginUser({
      email,
      password,
    });
  };
  return (
    <div className="login-container">
      <img src={solmate_logo} alt="" className="solmate-logo" />
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Remember Me" />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>

        <div
          style={{
            flexDirection: "row",
            display: "flex",
            justifyContent: "center",
            paddingTop: "15px",
          }}
        >
          <text style={{ paddingTop: "0px" }}>I don't have a user - </text>
          <Nav>
            <Nav.Item>
              <Nav.Link
                href="/register"
                style={{ display: "flex", padding: 0, paddingLeft: 5 }}
              >
                Register
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>
      </Form>
    </div>
  );
};

export default Login;
