import React from "react";
import { Popup } from "semantic-ui-react";

export default function Message({ time, username, text }) {
  return (
    <div>
      <Popup
        content={time}
        trigger={
          <p className="message">
            {username} :<span className="text"> {text}</span>
          </p>
        }
      ></Popup>
    </div>
  );
}
