import Nweet from "components/Nweet";
import { dbService } from "fbase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useEffect } from "react";
import { useState } from "react/cjs/react.development";

function Home({ userObj }) {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const [attachment, setAttachment] = useState();

  useEffect(() => {
    const querys = query(
      collection(dbService, "nweets"),
      orderBy("createAt", "desc")
    );
    onSnapshot(querys, (snapshot) => {
      const nweetArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(nweetArr);
    });
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(dbService, "nweets"), {
      text: nweet,
      createAt: Date.now(),
      creatorId: userObj.uid,
    });
    setNweet("");
  };
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNweet(value);
  };

  const onFileChange = (e) => {
    const {
      target: { files },
    } = e;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishevent) => {
      console.log(finishevent);
      const {
        currentTarget: { result },
      } = finishevent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };
  const onClearAttachment = () => {
    setAttachment(null);
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type={"text"}
          placeholder="What's on your mind?"
          maxLength={120}
          onChange={onChange}
          value={nweet}
        />
        <input type={"file"} accept="image/*" onChange={onFileChange} />
        <input type={"submit"} value={"Nweet"} />
        {attachment && (
          <div>
            <img src={attachment} width={"50px"} height={"50px"} />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
      </form>
      <div>
        {nweets.map((nweet, index) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
