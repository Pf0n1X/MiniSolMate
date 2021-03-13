import React, { useState, useEffect, useContext } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import "../styles/Register.css";
import axios from "axios";
import { Slider } from "@material-ui/core";
import { userContext } from "../context/userContext";

export default function Register({ setToken }) {
  const [inputValues, setInput] = useState({
    name: "",
    birthday: new Date(),
    sex: "",
    password: "",
    confirm_password: "",
    picture: "",
    ageRange: [20, 30],
    interestedAgeMin: 20,
    interestedAgeMax: 30,
    interestedSex: "",
  });
  const [errors, setErrors] = useState({});
  const { dispatch } = useContext(userContext);

  function handleChange(e) {
    if (e.target.name === "picture") {
      setInput((prevState) => ({
        ...prevState, // keep all other key-value pairs
        [e.target.name]: e.target.files[0].name, // update the value of specific key
        pictureFile: e.target.files[0],
      }));
    } else {
      setInput((prevState) => ({
        ...prevState, // keep all other key-value pairs
        [e.target.name]: e.target.value, // update the value of specific key
      }));
    }
  }

  function handleRangeChange(e) {
    setInput((prevState) => ({
      ...prevState, // keep all other key-value pairs
      ageRange: e, // update the value of specific key
      interestedAgeMin: e[0],
      interestedAgeMax: e[1],
    }));
    console.log(inputValues);
  }

  async function uploadPic(credentials, token) {
    const formData = new FormData();

    formData.append("myImage", credentials.pictureFile);
    formData.append("userId", credentials.email);

    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    axios
      .post("http://localhost:3001/user/uploadProfile", formData, config)
      .then((response) => {
        return response;
      })
      .catch((error) => alert(JSON.stringify(error)));
  }
  async function RegisterUser(credentials) {
    console.log(credentials);

    credentials.firstName = credentials.name.split(" ").slice(0, -1).join(" ");
    credentials.lastName = credentials.name.split(" ").slice(-1).join(" ");
    await axios
      .post("http://localhost:3001/user/register", credentials, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        var res = uploadPic(credentials, response.data.token);
        setToken(response.data.token);
        dispatch({ type: "SET_USER", payload: response.data.user });
      })
      .catch((err) => {
        alert(JSON.stringify(err));
      });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      const res = await RegisterUser(inputValues);
    }
  };

  function validate() {
    let input = inputValues;
    let errors = {};
    let isValid = true;

    if (!input["name"]) {
      isValid = false;
      errors["name"] = "Please enter your name.";
    }
    var pattern = new RegExp(/\b\D*?\b(?:\s+\b\D*?\b)+/);
    if (!pattern.test(input["name"])) {
      isValid = false;
      errors["name"] = "Please enter valid full name .";
    }

    if (!input["email"]) {
      isValid = false;
      errors["email"] = "Please enter your email Address.";
    }

    if (typeof input["email"] !== "undefined") {
      pattern = new RegExp(
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
    if (!input["sex"]) {
      isValid = false;
      errors["sex"] = "Please enter your sex.";
    }

    if (!input["birthday"]) {
      isValid = false;
      errors["birthday"] = "Please enter your birthday.";
    }

    if (!input["picture"]) {
      isValid = false;
      errors["picture"] = "Please choose profile pic.";
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
      {/* <div className="line-text">Register</div> */}
      <Form onSubmit={handleSubmit} style={{ width: "75%" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <div
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Form.Group controlId="name">
              <Form.Label>Full name</Form.Label>
              <Form.Control
                size="md"
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
            <Form.Group controlId="birthday">
              <Form.Label>Birthday</Form.Label>
              <Form.Control
                type="date"
                name="birthday"
                placeholder="Enter birthday"
                value={inputValues.birthday}
                isInvalid={errors["birthday"]}
                onChange={(e) => handleChange(e)}
              />
              <Form.Control.Feedback type="invalid">
                {errors["birthday"]}
              </Form.Control.Feedback>
            </Form.Group>
            <fieldset>
              <Form.Group controlId="sex">
                <Form.Label>Sex</Form.Label>
                <div>
                  <Form.Check
                    inline
                    isInvalid={errors["sex"]}
                    value={0}
                    onChange={(e) => handleChange(e)}
                    type="radio"
                    label="Male"
                    name="sex"
                    id="sex"
                  />
                  <Form.Check
                    value={1}
                    onChange={(e) => handleChange(e)}
                    isInvalid={errors["sex"]}
                    inline
                    type="radio"
                    label="Female"
                    name="sex"
                    id="sex"
                  />
                </div>
                <Form.Control.Feedback type="invalid">
                  {errors["sex"]}
                </Form.Control.Feedback>
              </Form.Group>
            </fieldset>

            <Form.Group controlId="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                size="md"
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
                size="md"
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
              <Form.Label size="md">Confirm Password :</Form.Label>
              <Form.Control
                size="md"
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
                size="md"
                id="exampleFormControlFile1"
                name="picture"
                label="Select an profile image"
                accept="image/png, image/jpeg"
                isInvalid={errors["picture"]}
                feedback={errors.picture}
                onChange={(e) => handleChange(e)}
              />
            </Form.Group>
          </div>
          <div style={{ height: "100%" }}>
            <Form.Group controlId="formConfirmPassword">
              <Form.Label size="md">
                Select the age you are looking for :
              </Form.Label>
              <div style={{ marginTop: 20, marginBottom: 20 }}>
                <Slider
                  style={{
                    root: {
                      minWidth: 300,
                      maxWidth: 400,
                    },
                  }}
                  onChange={(e, val) => handleRangeChange(val)}
                  aria-labelledby="track-inverted-range-slider"
                  getAriaValueText={() => "test"}
                  defaultValue={5}
                  value={inputValues.ageRange}
                  valueLabelDisplay="auto"
                  max={80}
                  min={18}
                />
              </div>
            </Form.Group>

            <Form.Group controlId="sex">
              <Form.Label>Which Sex are you intrested in :</Form.Label>
              <div>
                <Form.Check
                  inline
                  isInvalid={errors["interestedSex"]}
                  value={0}
                  onChange={(e) => handleChange(e)}
                  type="radio"
                  label="Male"
                  name="interestedSex"
                  id="interestedSex"
                />
                <Form.Check
                  value={1}
                  onChange={(e) => handleChange(e)}
                  isInvalid={errors["interestedSex"]}
                  inline
                  type="radio"
                  label="Female"
                  name="interestedSex"
                  id="interestedSex"
                />
              </div>
              <Form.Control.Feedback type="invalid">
                {errors["interestedSex"]}
              </Form.Control.Feedback>
            </Form.Group>
          </div>
        </div>
        <Button
          style={{
            backgroundColor: "purple",
            alignSelf: "center",
            borderColor: "purple",
          }}
          variant="primary"
          type="submit"
          class="btn btn-success"
        >
          Register
        </Button>
      </Form>
    </div>
  );
}
