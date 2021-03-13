import React, { useContext, useEffect, useState } from 'react';
import { MenuItem, Slider, FormControl, FormGroup, Input, InputLabel, Select, TextField, Button, FormLabel, Radio, FormControlLabel, RadioGroup, TextareaAutosize } from '@material-ui/core';
import user_pic from '../images/profile_pic.jpg';
import '../styles/Settings.css';
import axios from 'axios';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import AddAPhotoRoundedIcon from '@material-ui/icons/AddAPhotoRounded';
import { userContext } from "../context/userContext";
import moment from "moment";
import useToken from '../hooks/useToken';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

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
    const [profilePic, setProfilePic] = useState("");
    const [open, setOpen] = React.useState(false);
    const uCon = useContext(userContext);
    const { state, dispatch } = useContext(userContext);

    useEffect(() => {
        uCon.fetch(uCon.state.user.email);
        getSongsAccordingToParams("", "", "");
    }, []);

    useEffect(() => {
        if (uCon.data !== null && uCon.data !== undefined && uCon.data != {}) {
            setDescription(uCon.data.description);
                    setFirstName(uCon.data.firstName);
                    setLastName(uCon.data.lastName);

                    // This is done because in order fpr the selected songs to be checked in the select
                    // they must have the same object reference.
                    setSongs(uCon.data.Songs.map(song => {
                         var foundOption = songOptions.find(option => option['_id'] == song['_id']);

                         if (!foundOption) {
                             foundOption = song;
                         }

                         return foundOption;
                    }));
                    setAgeRange([uCon.data.interestedAgeMin, uCon.data.interestedAgeMax]);
                    setUserGender(uCon.data.sex);;
                    setBirthDate(moment(uCon.data.birthday).format('YYYY-MM-DD'));
                    setDistanceRange(uCon.data.radiusSearch);
                    setPrefGender(uCon.data.interestedSex);
                    setProfilePic(uCon.data.picture);
        }

    }, [uCon]);

    const onPhotoButtonClicked = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("myImage", e.target.files[0]);
        formData.append("userId", uCon.state.user['email']);

        const config = {
            headers: {
                "content-type": "multipart/form-data",
            },
        };
        axios
            .post("http://localhost:3001/user/uploadProfile", formData, config)
            .then((response) => {
                uCon.fetch(uCon.state.user.email);
            })
            .catch((error) => { });
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

        axios.put('http://localhost:3001/user', user)
            .then((obj) => {
                
            });
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteUser = () => {
        const userId = uCon.state.user['_id'];

        setOpen(false);
        window.location.reload();
        // dispatch({ type: "LOGOUT" });
        // axios.delete('http://localhost:3001/user?userId=' + userId)
        //     .then((obj) => {
        //         console.log("Successful delete of user " + userId);
        // });
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

                setSongOptions(response.data);
            });
    }

    useEffect(() => {
        
        // This is done because in order fpr the selected songs to be checked in the select
        // they must have the same object reference.
        if (!uCon.data) {
            setSongs([]);
            
            return;
        }
        setSongs(uCon.data?.Songs.map(song => {
            var resOption = songOptions.find(option => option['_id'] == song['_id']);
            if (!resOption) {
                resOption = song;
            }

            return resOption;
        }));
    }, [songOptions]);

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

        },
        SaveButton: {
            backgroundColor: '#be65c6'
        },
        DeleteButton: {
            backgroundColor: 'grey'
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
                <img src={`http://localhost:3001/static/${profilePic}`} />
                <input id="profileImageUpload"
                    className="upload-input"
                    type="file"
                    name="profileImageUpload"
                    accept="image/png, image/jpeg"
                    onChange={onPhotoButtonClicked} />
                <label className="file-label" htmlFor="profileImageUpload"><AddAPhotoRoundedIcon /></label>
                <div className="song-params">
                    <h4>Search Songs</h4>
                    <FormControl className={classes.formControl}>
                        <InputLabel>Favorite Songs</InputLabel>
                        <Select
                            labelId="demo-mutiple-name-label"
                            id="demo-mutiple-name"
                            multiple
                            value={songs}
                            onChange={(e, val) => { setSongs(e.target.value) }}
                            input={<Input />}
                            renderValue={values => values.map(o => o.songName).join()} >
                            {renderSongOptions()}
                        </Select>
                    </FormControl>
                    <form className={classes.container} onSubmit={onSubmitSearch}>
                        <TextField name="song-name-param" className={classes.TextField} label="Song Name" value={songNameParam} onChange={(e, val1) => setSongNameParam(e.target.value)} type="text" />
                        <TextField name="song-artist-param" className={classes.TextField} label="Artist Name" value={songArtistParam} onChange={(e, val1) => setSongArtistParam(e.target.value)} type="text" />
                        <TextField name="song-album-param" className={classes.TextField} label="Album Name" value={songAlbumParam} onChange={(e, val1) => setSongAlbumParam(e.target.value)} type="text" />
                        <FormGroup className="search-button-group">
                            <Button variant="contained" type="submit">
                                Search
                            </Button>
                        </FormGroup>
                    </form>

                    <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete your profile?"}</DialogTitle>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                No
                                </Button>
                            <Button onClick={deleteUser} color="primary" autoFocus>
                                Yes
                                </Button>
                        </DialogActions>
                    </Dialog>
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
                        // defaultValue="2017-05-24"
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
                    {/* <FormGroup controlid="formBasicRange">
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
                    </FormGroup> */}
                    <FormGroup controlid="formBasicRange">
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
                        <Button className={classes.SaveButton} variant="contained" color="primary" type="submit">
                            Save
                        </Button>
                        <Button className={classes.DeleteButton} variant="contained" color="secondary" onClick={handleClickOpen}>
                            Delete user
                    </Button>
                    </FormGroup>
                </form>
            </div>
        </div>
    );
}

export default Settings;