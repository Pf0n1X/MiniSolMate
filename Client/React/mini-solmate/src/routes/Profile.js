import React, { useState, useRef, useEffect } from "react";
import profile_pic from "../images/profile_pic.jpg";
import "../styles/Profile.css";
import { Tabs, Tab } from "react-bootstrap";
import billie_eilish from "../images/billie_eilish.jpg";
import { FiEdit2 } from "react-icons/fi";
import { FiUpload } from "react-icons/fi";
import axios from "axios";

const Profile = () => {
  // TODO: Replace with the actual id of the connected user.
  const CONNECTED_USER_ID = "adibigler@gmail.com";

  const inputEl = useRef(null);
  const uploadEl = useRef(null);
  const [key, setKey] = useState("Top Artists");
  const [desc, setDesc] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:3001/user", {
        params: {
          UserId: CONNECTED_USER_ID,
        },
      });
      setUser(res.data[0]);
      setDesc(res.data[0].description);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    console.log("begin");
    fetchData();
  }, []);

  const onMediaChange = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("myImage", e.target.files[0]);
    formData.append("userId", CONNECTED_USER_ID);

    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    axios
      .post("http://localhost:3001/user/uploadMedia", formData, config)
      .then((response) => {
        fetchData();
      })
      .catch((error) => {});
  };

  const onProfileChange = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("myImage", e.target.files[0]);
    formData.append("userId", CONNECTED_USER_ID);

    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    axios
      .post("http://localhost:3001/user/uploadProfile", formData, config)
      .then((response) => {
        fetchData();
      })
      .catch((error) => {});
  };
  const renderMedia = () => {
    let domMedia = [];
    if (user?.Media.length == 0) {
      domMedia.push(<div>no media yet</div>);
    }
    for (var i = 0; i < user?.Media.length; i++) {
      domMedia.push(
        <section>
          <div className="media">
            <img
              className="media-img"
              src={`http://localhost:3001/static/${user.Media[i]}`}
              alt=""
            />
          </div>
        </section>
      );
    }

    return domMedia;
  };
  const renderArtists = () => {
    var domArtists = [];

    for (var i = 0; i < user?.Artists.length || i < 3; i++) {
      domArtists.push(
        <div className="artist">
          <img src={user?.Artists[i]?.img} alt="" className="artist-img" />
          <span>{user?.Artists[i]?.name}</span>
        </div>
      );
    }

    return domArtists;
  };
  const onEditClicked = () => {
    // `current` points to the mounted text input element
    inputEl.current.focus();
  };

  const onDescChange = async (e) => {
    setDesc(e.target.value);

    axios.put("http://localhost:3001/user/", {
      ...user,
      description: e.target.value + "",
    });
  };

  return (
    !loading && (
      <div>
        <div className="profile-container">
          <div className="avatar-upload">
            <div>
              <img
                className="profile_img"
                src={`http://localhost:3001/static/${user.picture}`}
              />
              <input
                id="profileImageUpload"
                className="uplaod-input"
                type="file"
                name="profileImageUpload"
                accept="image/png, image/jpeg"
                onChange={onProfileChange}
              ></input>
              <label for="profileImageUpload" className="upload-profile-label">
                <FiUpload className="upload-profile-icon" />
              </label>
            </div>
          </div>

          <h3>{user !== null ? `${user.firstName} ${user.lastName}` : ""}</h3>
          <input
            ref={inputEl}
            name="desc"
            class="change-desc"
            type="input"
            value={desc}
            onChange={onDescChange}
          />
          <label>
            <FiEdit2 className="edit-icon" onClick={onEditClicked} />
          </label>

          <div>
            <Tabs id="profile-tabs" activeKey={key} onSelect={(k) => setKey(k)}>
              <Tab eventKey="Top Artists" title="Top Artists">
                <div className="scroll-data">
                  <div className="my-artists">
                    <section>{renderArtists()}</section>
                    {/* <section>
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
                  </section> */}
                  </div>
                </div>
              </Tab>
              <Tab eventKey="Media" title="Media">
                <div className="scroll-data">
                  <div className="my-media">{renderMedia()}</div>
                </div>
                <input
                  id="imageUpload"
                  className="uplaod-input"
                  type="file"
                  name="imageUpload"
                  accept="image/png, image/jpeg"
                  onChange={onMediaChange}
                ></input>
                <label for="imageUpload">
                  <FiUpload className="edit-icon" />
                </label>
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    )
  );
};

export default Profile;
