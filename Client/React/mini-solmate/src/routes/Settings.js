import React from 'react';
import { Form, Button } from 'react-bootstrap';
import user_pic from '../images/profile_pic.jpg';
import '../styles/Settings.css';

const Settings = () => {
    return (
        <div className="settings-wrapper">
            <div className="picture-area">
                <img src={user_pic} />
            </div>
            <div className="preferences-wrapper">
                <h4>Edit Settings</h4>
                <Form>
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="email" placeholder="Sassy Guitar Artist" />
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlSelect2">
                        <Form.Label>Favorite Artists</Form.Label>
                        <Form.Control as="select" multiple>
                            <option>Billie Eilish</option>
                            <option>Arctic Monkeys</option>
                            <option>Tame Impala</option>
                            <option>Mac Miller</option>
                            <option>Feng Suave</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Profile Description</Form.Label>
                        <Form.Control className="description" as="textarea" rows={3} maxLength={300} />
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