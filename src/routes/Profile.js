import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "@firebase/auth";

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
    <>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={newName}
          onChange={onChange}
          placeholder="Display name"
        />
        <input type="submit" value="Update" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
      {myNweets ? (
        <ul>
          {myNweets.map((element) => (
            <li key={element.createdAt}>{element.text}</li>
          ))}
        </ul>
      ) : (
        <p>No nweets found.</p>
      )}
    </>
  );
};

export default Profile;
