import React, { useContext, useEffect, useState } from 'react';
import { MenuItem, Slider, FormControl, FormGroup, Input, InputLabel, Select, TextField, Button, FormLabel, Radio, FormControlLabel, RadioGroup, TextareaAutosize } from '@material-ui/core';
import user_pic from '../images/profile_pic.jpg';
import '../styles/Settings.css';
import axios from 'axios';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import AddAPhotoRoundedIcon from '@material-ui/icons/AddAPhotoRounded';
import { userContext } from "../context/userContext";
import moment from "moment";

const Settings = () => {

    // State declaration.
    const [description, setDescription] = useState("");
    const [songs, setSongs] = useState([]);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userGender, setUserGender] = useState(0);
    const [prefGender, setPrefGender] = useState(0);
    const [ageRange, setAgeRange] = useState([20, 30]);
    const [distanceRange, setDistanceRange] = useState(30);
    const [birthDate, setBirthDate] = useState("");
    const [songOptions, setSongOptions] = useState([]);
    const [songNameParam, setSongNameParam] = useState("");
    const [songArtistParam, setSongArtistParam] = useState("");
    const [songAlbumParam, setSongAlbumParam] = useState("");
    // const [originalSongs, setOriginalSongs] = useState([]);
    const uCon = useContext(userContext);

    useEffect(() => {
        axios.get('http://localhost:3001/user?UserId=' + uCon.state.user.email)
            .then((response) => {
                console.log("Response arrived");
                console.log(response.data[0]);
                if (response.data === null)
                    return;

                setDescription(response.data[0].description);
                setFirstName(response.data[0].firstName);
                setLastName(response.data[0].lastName);
                setSongs(response.data[0].Songs);
                // setOriginalSongs(response.data[0].Songs);
                setAgeRange([response.data[0].interestedAgeMin, response.data[0].interestedAgeMax]);
                setUserGender(response.data[0].sex);
                console.log("The date is ");
                console.log(moment(response.data[0].birthday).format('YYYY-MM-DD'));
                setBirthDate(moment(response.data[0].birthday).format('YYYY-MM-DD'));
                setDistanceRange(response.data[0].radiusSearch);
                setPrefGender(response.data[0].interestedSex);
            });

            getSongsAccordingToParams("", "", "");
    }, []);

    const onPhotoButtonClicked = () => {
        const onFileChange = (e) => {
            e.preventDefault();
            const formData = new FormData();
            formData.append("myImage", e.target.files[0]);
            const config = {
              headers: {
                "content-type": "multipart/form-data",
              },
            };
            axios
              .post("http://localhost:3001/user/upload", formData, config)
              .then((response) => {
                alert("The file is successfully uploaded");
              })
              .catch((error) => {});
          };
    }

    const renderSongOptions = () => {
        return songOptions.map(option => (
            <MenuItem key={option['_id']} value={option} name={option['_id']}>{option.songName}</MenuItem>
        ))
    };

    const onSubmit = (e) => {
        e.preventDefault();

        const user = {
            _id: uCon.state.user['_id'],
            firstName: firstName,
            lastName: lastName,
            description: description,
            Songs: songs.map(song => song['_id']),
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

    const onSubmitSearch = (e) => {
        e.preventDefault();

        getSongsAccordingToParams(songNameParam, songArtistParam, songAlbumParam);
    }

    const getSongsAccordingToParams = (name, artist, album) => {

        // Get the songs from the server.
        axios.get(`http://localhost:3001/song?name=${name}&artist=${artist}&album=${album}`)
            .then((response) => {
                if (response.data === null)
                    return;

                console.log("Song Search response")
                console.log(response.data)
                setSongOptions(response.data);
                // setSongs(originalSongs);
            });
    }

    const useStyles = makeStyles((theme) => ({
        formControl: {
            //   margin: theme.spacing(1),
            minWidth: 250,
            maxWidth: 400,
        },
        TextField: {
            margin: "16px 0",
            minWidth: 250,
            maxWidth: 400
        },
        Slider: {
                margin: "16px 0",
                minWidth: 250,
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
                <input id="profileImageUpload"
                    className="upload-input"
                        type="file"
                        name="profileImageUpload"
                        accept="image/png, image/jpeg"
                        onChange={onPhotoButtonClicked} />
                <label className="file-label" for="profileImageUpload"><AddAPhotoRoundedIcon fontSize='20px'/></label>
                <div className="song-params">
                    <h4>Search Songs</h4>
                    <form className={classes.container} onSubmit={onSubmitSearch}>
                        <TextField name="song-name-param" className={classes.TextField} label="Song Name" value={songNameParam} onChange={(e, val1) => setSongNameParam(e.target.value)} type="text" />
                        <TextField name="song-artist-param" className={classes.TextField} label="Artist Name" value={songArtistParam} onChange={(e, val1) => setSongArtistParam(e.target.value)} type="text" />
                        <TextField name="song-album-param" className={classes.TextField} label="Album Name" value={songAlbumParam} onChange={(e, val1) => setSongAlbumParam(e.target.value)} type="text" />
                        <FormGroup className="submit-button-group">
                            <Button variant="secondary" type="submit">
                                Search
                            </Button>
                        </FormGroup>
                    </form>
                </div>
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
                        <InputLabel>Favorite Songs</InputLabel>
                        <Select
                            labelId="demo-mutiple-name-label"
                            id="demo-mutiple-name"
                            multiple
                            value={songs}
                            onChange={(e, val) => {setSongs(e.target.value)}}
                            input={<Input />}
                            renderValue={values => values.map(o => o.songName).join()} >
                            {renderSongOptions()}
                        </Select>
                    </FormControl>
                    <TextField className={classes.TextField} label="Description" variant="outlined" multiline value={description} onChange={(e) => { setDescription(e.target.value); }} />
                    <FormGroup controlId="formBasicRange">
                        <InputLabel>Search Range</InputLabel>
                        <Slider
                            className={classes.Slider}
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
                            className={classes.Slider}
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