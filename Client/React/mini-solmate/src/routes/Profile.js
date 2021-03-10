import React, { useState, useRef } from "react";
import profile_pic from "../images/profile_pic.jpg";
import "../styles/Profile.css";
import { Tabs, Tab } from "react-bootstrap";
import billie_eilish from "../images/billie_eilish.jpg";
import { FiEdit2 } from "react-icons/fi";
import { FiUpload } from "react-icons/fi";
import axios from "axios";

const Profile = () => {
  const inputEl = useRef(null);
  const uploadEl = useRef(null);
  const [key, setKey] = useState("Top Artists");
  const [desc, setDesc] = useState("Music is cool");

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

  const onEditClicked = () => {
    // `current` points to the mounted text input element
    inputEl.current.focus();
  };
  return (
    <div>
      <div className="profile-container">
        <div className="avatar-upload">
          <div>
            <img className="profile_img" src={profile_pic} />
            <input
              id="profileImageUpload"
              className="uplaod-input"
              type="file"
              name="profileImageUpload"
              accept="image/png, image/jpeg"
            ></input>
            <label for="profileImageUpload" className="upload-profile-label">
              <FiUpload className="upload-profile-icon" />
            </label>
          </div>
        </div>

        <h3>Tomer Erusalimsky</h3>
        <input
          ref={inputEl}
          name="desc"
          class="change-desc"
          type="input"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <label>
          <FiEdit2 className="edit-icon" onClick={onEditClicked} />
        </label>

        <div>
          <Tabs id="profile-tabs" activeKey={key} onSelect={(k) => setKey(k)}>
            <Tab eventKey="Top Artists" title="Top Artists">
              <div className="scroll-data">
                <div className="my-artists">
                  <section>
                    <div className="artist">
                      <img src={billie_eilish} alt="" className="artist-img" />
                    </div>
                    <div className="artist">
                      <img src={billie_eilish} alt="" className="artist-img" />
                    </div>
                    <div className="artist">
                      <img src={billie_eilish} alt="" className="artist-img" />
                    </div>
                    <div className="artist">
                      <img src={billie_eilish} alt="" className="artist-img" />
                    </div>
                  </section>
                  <section>
                    <div className="artist">
                      <img src={billie_eilish} alt="" className="artist-img" />
                    </div>
                    <div className="artist">
                      <img src={billie_eilish} alt="" className="artist-img" />
                    </div>
                    <div className="artist">
                      <img src={billie_eilish} alt="" className="artist-img" />
                    </div>
                    <div className="artist">
                      <img src={billie_eilish} alt="" className="artist-img" />
                    </div>
                  </section>
                </div>
              </div>
            </Tab>
            <Tab eventKey="Media" title="Media">
              <div className="scroll-data">
                <div className="my-media">
                  <section>
                    <div className="media">
                      <img src={billie_eilish} alt="" className="media-img" />
                    </div>
                    <div className="media">
                      <img src={billie_eilish} alt="" className="media-img" />
                    </div>
                  </section>
                  <section>
                    <div className="media">
                      <img src={billie_eilish} alt="" className="media-img" />
                    </div>
                    <div className="media">
                      <img src={billie_eilish} alt="" className="media-img" />
                    </div>
                  </section>
                </div>
              </div>
              <input
                id="imageUpload"
                className="uplaod-input"
                type="file"
                name="imageUpload"
                accept="image/png, image/jpeg"
                onChange={onFileChange}
              ></input>
              <label for="imageUpload">
                <FiUpload className="edit-icon" />
              </label>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
