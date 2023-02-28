import React, { useState } from "react";
import { db, storage } from "../firebase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "@firebase/storage";

const Nweet = ({ nweet, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweet.text);
  const NweetTextRef = doc(db, "nweets", `${nweet.id}`);
  const urlRef = ref(storage, nweet.attachmentURL);

  const onDeleteClick = async () => {
    await deleteDoc(NweetTextRef);
    if (nweet.attachmentUrl !== "") await deleteObject(urlRef);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    await updateDoc(NweetTextRef, {
      text: newNweet,
    });
    setEditing(false);
  };

  const onChange = (event) => {
    const { value } = event.target;
    setNewNweet(value);
  };
  const editingToggle = () => {
    setEditing((curr) => !curr);
  };

  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input value={newNweet} onChange={onChange} type="text" />
            <input type="submit" value="Save" />
          </form>
          <button onClick={editingToggle}>Cancel</button>
        </>
      ) : (
        <>
          <li>{nweet.text}</li>
          {nweet.attachmentUrl && (
            <img src={nweet.attachmentUrl} width="100px" height="auto" alt="" />
          )}
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete Nweet</button>
              <button onClick={editingToggle}>Edit Nweet</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Nweet;
