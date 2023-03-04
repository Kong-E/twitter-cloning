import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "@firebase/auth";
import { v4 as uuidv4 } from "uuid";

const Profile = ({ refreshUser, userObj }) => {
  const [myNweets, setMyNweets] = useState([]);
  const [newName, setNewName] = useState(userObj.displayName);

  const navigate = useNavigate();
  const onLogOutClick = () => {
    auth.signOut();
    navigate("/");
  };

  const getMyNweets = async () => {
    const querySnapshot = await getDocs(
      query(
        collection(db, "nweets"),
        where("creatorId", "==", `${userObj.uid}`)
      )
    );
    const myNweetsData = querySnapshot.docs.map((doc) => doc.data());
    setMyNweets(myNweetsData);
  };
  useEffect(() => {
    getMyNweets();
  }, []);

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewName(value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (userObj.displayName !== newName) {
      await updateProfile(auth.currentUser, { displayName: newName });
      refreshUser();
    }
  };

  return (
    <div className="container">
      <form onSubmit={onSubmit} className="progileForm">
        <input
          type="text"
          value={newName}
          onChange={onChange}
          placeholder="Display name"
          autoFocus
          className="formInput"
        />
        <input
          type="submit"
          value="Update Profile"
          className="formBtn"
          style={{
            marginTop: 10,
          }}
        />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
      {myNweets ? (
        <ul>
          {myNweets.map((element) => (
            <>
              <div className="nweet" style={{ marginTop: "30px" }}>
                <h4 key={element.createdAt}>{element.text}</h4>
                {element.attachmentUrl && (
                  <img
                    alt=""
                    key={uuidv4()}
                    src={element.attachmentUrl}
                    width="100px"
                    height="auto"
                    className="uploadImg"
                  />
                )}
              </div>
            </>
          ))}
        </ul>
      ) : (
        <p style={{ color: "white" }}>No nweets found.</p>
      )}
    </div>
  );
};

export default Profile;
