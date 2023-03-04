import React, { useState, useRef } from "react";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import { v4 as uuidv4 } from "uuid";

const NweetFactory = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [attachment, setAttachment] = useState("");

  const fileInput = useRef();
  const onSubmit = async (event) => {
    event.preventDefault();

    let attachmentUrl = "";

    if (attachment !== "") {
      const attachmentRef = ref(storage, `${userObj.uid}/${uuidv4()}`); //파일을 가리키는 참조
      const response = await uploadString(
        attachmentRef,
        attachment,
        "data_url"
      );
      attachmentUrl = await getDownloadURL(response.ref); //다운로드 URL 만들기
      console.log(attachmentUrl);
    }

    await addDoc(collection(db, "nweets"), {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    });

    setNweet("");
    setAttachment("");
    fileInput.current.value = "";
  };

  const onChange = (event) => {
    const { value } = event.target;
    setNweet(value);
  };

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile); //이게 끝나면 finishedEvent를 받음
  };

  const onClearAttachment = () => {
    setAttachment("");
    fileInput.current.value = "";
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        value={nweet}
        onChange={onChange}
        type="text"
        placeholder="What's on your mind?"
        maxLength={120}
      />
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        onChange={onFileChange}
      />
      <input type="submit" value="Nweet" />
      {attachment && (
        <div>
          <img alt="" src={attachment} width="50px" height="50px" />
          <button onClick={onClearAttachment}>Clear</button>
        </div>
      )}
    </form>
  );
};
export default NweetFactory;
