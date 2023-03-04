import React, { useState } from "react";
import { db, storage } from "../firebase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "@firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

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
    <div className="nweet">
      {editing ? (
        <>
          <form onSubmit={onSubmit} className="container nweetEdit">
            <input
              value={newNweet}
              autofocus
              className="formInput"
              onChange={onChange}
              type="text"
            />
            <input type="submit" value="Save" className="formBtn" />
          </form>
          <button onClick={editingToggle} className="formBtn cancelBtn">
            Cancel
          </button>
        </>
      ) : (
        <>
          <img src={nweet.photoURL} className="profileImg" alt="" />
          <h4>{nweet.text}</h4>
          {nweet.attachmentUrl && (
            <img src={nweet.attachmentUrl} className="uploadImg" alt="" />
          )}
          {isOwner && (
            <div className="nweet__actions">
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={editingToggle}>
                {" "}
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Nweet;
