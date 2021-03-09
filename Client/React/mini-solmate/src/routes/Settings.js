import React, { useEffect, useState } from 'react';
import { MenuItem, Slider, FormControl, FormGroup, Input, InputLabel, Select, TextField, Button, FormLabel, Radio, FormControlLabel, RadioGroup, TextareaAutosize } from '@material-ui/core';
import user_pic from '../images/profile_pic.jpg';
import '../styles/Settings.css';
import axios from 'axios';
import { makeStyles, withStyles } from '@material-ui/core/styles';

const Settings = () => {

    // TODO: Replace this with the connected user's id and email.
    const USER_ID = "604639ae4ad4fa1dcc6822e5";
    const USER_EMAIL = "tom.eru.98@gmail.com";

    // State declaration.
    const [description, setDescription] = useState("");
    const [artists, setArtists] = useState([]);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userGender, setUserGender] = useState(0);
    const [prefGender, setPrefGender] = useState(0);
    const [ageRange, setAgeRange] = useState([20, 30]);
    const [distanceRange, setDistanceRange] = useState(30);
    const [birthDate, setBirthDate] = useState("");

    useEffect(() => {
        axios.get('http://localhost:3001/user?UserId=' + USER_EMAIL)
            .then((response) => {
                console.log("Response arrived");
                console.log(response.data[0]);
                if (response.data === null)
                    return;

                setDescription(response.data[0].description);
                setFirstName(response.data[0].firstName);
                setLastName(response.data[0].lastName);
                setArtists(response.data[0].Artists);
                setAgeRange([response.data[0].interestedAgeMin, response.data[0].interestedAgeMax]);
                setUserGender(response.data[0].sex);
                setBirthDate(response.data[0].birthday);
                setDistanceRange(response.data[0].radiusSearch);
                setPrefGender(response.data[0].interestedSex);
            });
    }, []);

    const onSubmit = (e) => {
        e.preventDefault();

        const user = {
            _id: USER_ID,
            firstName: firstName,
            lastName: lastName,
            description: description,
            Artists: artists,
            interestedAgeMin: ageRange[0],
            interestedAgeMax: ageRange[1],
            radiusSearch: distanceRange,
            birthday: birthDate,
            sex: userGender,
            interestedSex: prefGender
        }

        console.log("Submitting")
        console.log(user);
        axios.put('http://localhost:3001/user', user)
            .then((a, b) => {
                console.log("Successful update.");
                console.log(a);
                console.log(b);
            });
    };

    const useStyles = makeStyles((theme) => ({
        formControl: {
            //   margin: theme.spacing(1),
            minWidth: 300,
            maxWidth: 400,
        },
        TextField: {
            margin: "16px 0",
            minWidth: 300,
            maxWidth: 400
        }
    }));

    const classes = useStyles();

    const MyRadioButton = withStyles({
        root: {
            color: '#be65c6',
            '&$checked': {
                color: '#be65c6',
            },
        },
        checked: {},
    })(Radio);

    return (

        <div className="settings-wrapper">
            <div className="picture-area">
                <img src={user_pic} />
            </div>
            <div className="preferences-wrapper">
                <h4>Edit Settings</h4>
                <form className={classes.container} onSubmit={onSubmit}>
                    <TextField name="firstName" className={classes.TextField} label="First Name" value={firstName} onChange={(e, val1) => setFirstName(e.target.value)} type="text" />
                    <TextField name="lastName" className={classes.TextField} label="Last Name" value={lastName} onChange={(e, val) => setLastName(val)} type="text" placeholder="Last name" />
                    <TextField
                        className={classes.TextField}
                        value={birthDate}
                        onChange={(e) => { setBirthDate(e.target.value) }}
                        defaultValue="2017-05-24"
                        id="birth-date"
                        label="Birthday"
                        type="date"
                        InputLabelProps={{
                            shrink: true,
                        }} />
                    <FormControl className={classes.formControl}>
                        <InputLabel>Favorite Artists</InputLabel>
                        <Select
                            labelId="demo-mutiple-name-label"
                            id="demo-mutiple-name"
                            multiple
                            value={artists}
                            onChange={(e, val) => setArtists(e.target.value)}
                            input={<Input />} >
                            <MenuItem key="Billie Eilish" value="Billie Eilish">Billie Eilish</MenuItem>
                            <MenuItem key="Arctic Monkeys" value="Arctic Monkeys">Arctic Monkeys</MenuItem>
                            <MenuItem key="Tame Impala" name="Tame Impala">Tame Impala</MenuItem>
                            <MenuItem key="Mac Miller" name="Mac Miller">Mac Miller</MenuItem>
                            <MenuItem key="Feng Suave" name="Feng Suave">Feng Suave</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField className={classes.TextField} label="Description" variant="outlined" multiline value={description} onChange={(e) => { setDescription(e.target.value); }} />
                    <FormGroup controlId="formBasicRange">
                        <InputLabel>Search Range</InputLabel>
                        <Slider
                            onChange={(e, val) => setDistanceRange(val)}
                            aria-labelledby="continuous-slider"
                            getAriaValueText={() => "test"}
                            defaultValue={[20, 37]}
                            value={distanceRange}
                            min={0}
                            max={50}
                        // marks={true}
                        />
                    </FormGroup>
                    <FormGroup controlId="formBasicRange">
                        <InputLabel>Ages</InputLabel>
                        <Slider
                            color={classes.Slider}
                            onChange={(e, val) => setAgeRange(val)}
                            aria-labelledby="track-inverted-range-slider"
                            getAriaValueText={() => "test"}
                            defaultValue={5}
                            value={ageRange}
                            max={80}
                            min={18}
                        />
                    </FormGroup>
                    <RadioGroup name="user-gender" aria-label="user-gender" value={userGender} onChange={(e, val) => { setUserGender(parseInt(val)) }}>
                        <FormLabel component="legend">Gender</FormLabel>
                        <FormControlLabel key={0} value={0} control={<MyRadioButton />} label="Male" />
                        <FormControlLabel key={1} value={1} control={<MyRadioButton />} label="Female" />
                    </RadioGroup>
                    <RadioGroup name="pref-gender" aria-label="pref-gender" value={prefGender} onChange={(e, val) => setPrefGender(parseInt(val))}>
                        <FormLabel component="legend">Preferred Gender</FormLabel>
                        <FormControlLabel key={0} value={0} control={<MyRadioButton />} label="Male" />
                        <FormControlLabel key={1} value={1} control={<MyRadioButton />} label="Female" />
                    </RadioGroup>
                    <FormGroup className="submit-button-group">
                        <Button variant="secondary" type="submit">
                            Save
                            </Button>
                    </FormGroup>
                </form>
            </div>
        </div>
    );
}

export default Settings;