import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import user_pic from '../images/profile_pic.jpg';
import '../styles/Settings.css';
import axios from 'axios';

const Settings = () => {

    // TODO: Replace this with the connected user's id and email.
    const USER_ID = "604639ae4ad4fa1dcc6822e5";
    const USER_EMAIL = "tom.eru.98@gmail.com";

    // State declaration.
    const [description, setDescription] = useState("");
    const [artists, setArtists] = useState([]);
    const [firstName, setFirstName] = useState("");

    useEffect(() => {
        axios.get('http://localhost:3001/user?UserId=' + USER_EMAIL)
        .then((response) => {
            console.log("Response arrived");
            console.log(response);
            if (response.data === null)
                return;

            setDescription(response.data[0].description);
            setFirstName(response.data[0].firstName);
            setArtists(response.data[0].Artists);
        });
    }, []);

    const onSubmit = (e) => {
        e.preventDefault();

        const user = {
            _id: USER_ID,
            firstName: firstName,
            description: description,
            Artists: artists
        }
        axios.put('http://localhost:3001/user', user)
            .then((a, b) => {
                console.log("Successful update.");
                console.log(a);
                console.log(b);
            });
    }

    return (
        <div className="settings-wrapper">
            <div className="picture-area">
                <img src={user_pic} />
            </div>
            <div className="preferences-wrapper">
                <h4>Edit Settings</h4>
                <Form onSubmit={onSubmit}>
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Name</Form.Label>
                        <Form.Control value={firstName} onChange={e => setFirstName(e.target.value.map())} type="text" placeholder="Sassy Guitar Artist" />
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlSelect2">
                        <Form.Label>Favorite Artists</Form.Label>
                        <Form.Control onChange={e => setArtists([...e.target.selectedOptions].map(option => option.value))} as="select" multiple>
                            <option>Billie Eilish</option>
                            <option>Arctic Monkeys</option>
                            <option>Tame Impala</option>
                            <option>Mac Miller</option>
                            <option>Feng Suave</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Profile Description</Form.Label>
                        <Form.Control value={description} onChange={e => setDescription(e.target.value)} className="description" as="textarea" rows={3} maxLength={300} />
                    </Form.Group>
                    <Form.Group controlId="formBasicRange">
                        <Form.Label>Search Range</Form.Label>
                        <Form.Control type="range" custom />
                    </Form.Group>
                    <Form.Group>
                        <Form.File
                            id="custom-file"
                            label="Profile Picture"
                            custom
                        />
                    </Form.Group>
                    <Form.Group className="submit-button-group">
                        <Button variant="secondary" type="submit">
                            Save
                        </Button>
                    </Form.Group>
                </Form>
            </div>
        </div>
    );
}

export default Settings;