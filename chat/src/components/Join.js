import React, { useState } from "react";
import { Link } from "react-router-dom";
import {v4 as uuid} from 'uuid'


export default function Join() {
  const [name, setName] = useState("");
  
  return (
    <div className='join-component'>
      <h1>Join</h1>
      <input
        type="text"
        placeholder="Name"
        onChange={(event) => {
          setName(event.target.value);
        }}
      />
      <Link
        onClick={(event) => (!name ? event.preventDefault() : null)}
        to={`/chat?name=${name}&room=${(uuid())}`}
      >
        <button type="submit">Join</button>
      </Link>
    </div>
  );
}
