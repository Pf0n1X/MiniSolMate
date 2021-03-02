import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

export default function Register() {
  const [inputValues, setInput] = useState({});
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    setInput((prevState) => ({
      ...prevState, // keep all other key-value pairs
      [e.target.name]: e.target.value, // update the value of specific key
    }));
    console.log(inputValues);
  }
  function handleSubmit(event) {
    event.preventDefault();

    if (validate()) {
    }
  }

  function validate() {
    let input = inputValues;
    let errors = {};
    let isValid = true;

    if (!input["name"]) {
      isValid = false;
      errors["name"] = "Please enter your name.";
    }

    if (!input["email"]) {
      isValid = false;
      errors["email"] = "Please enter your email Address.";
    }

    if (typeof input["email"] !== "undefined") {
      var pattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
      );
      if (!pattern.test(input["email"])) {
        isValid = false;
        errors["email"] = "Please enter valid email address.";
      }
    }
    if (!input["password"]) {
      isValid = false;
      errors["password"] = "Please enter your password.";
    }

    if (!input["confirm_password"]) {
      isValid = false;
      errors["confirm_password"] = "Please enter your confirm password.";
    }

    if (!input["file"]) {
      isValid = false;
      errors["file"] = "Please choose profile pic.";
    }

    if (
      typeof input["password"] !== "undefined" &&
      typeof input["confirm_password"] !== "undefined"
    ) {
      if (input["password"] !== input["confirm_password"]) {
        isValid = false;
        errors["password"] = "Passwords don't match.";
        errors["confirm_password"] = "Passwords don't match.";
      }
    }
    console.log(errors);

    setErrors(errors);

    return isValid;
  }

  return (
    <div className="login-container">
      <div class="line-text">Register</div>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="name">
          <Form.Label>Full name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            placeholder="Enter full name"
            value={inputValues.name}
            isInvalid={errors["name"]}
            onChange={(e) => handleChange(e)}
          />
          <Form.Control.Feedback type="invalid">
            {errors["name"]}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Enter email"
            value={inputValues.email}
            isInvalid={errors["email"]}
            onChange={(e) => handleChange(e)}
          />
          <Form.Control.Feedback type="invalid">
            {errors["email"]}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Enter Password"
            value={inputValues.password}
            isInvalid={errors["password"]}
            onChange={(e) => handleChange(e)}
          />
          <Form.Control.Feedback type="invalid">
            {errors["password"]}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="formConfirmPassword">
          <Form.Label>Confirm Password :</Form.Label>
          <Form.Control
            type="password"
            name="confirm_password"
            class="form-control"
            placeholder="Enter confirm password"
            isInvalid={errors["confirm_password"]}
            value={inputValues.confirm_password}
            onChange={(e) => handleChange(e)}
          />
          <Form.Control.Feedback type="invalid">
            {errors["confirm_password"]}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.File
            id="exampleFormControlFile1"
            label="Select an profile image"
            isInvalid={errors["file"]}
            feedback={errors.file}
            onChange={(e) => handleChange(e)}
          />
        </Form.Group>
        <Button variant="primary" type="submit" class="btn btn-success">
          Register
        </Button>
      </Form>
    </div>
  );
}
