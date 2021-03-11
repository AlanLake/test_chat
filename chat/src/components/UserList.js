import React from "react";
import { Menu } from "semantic-ui-react";

export default function UserList({ usersArray }) {
  return (
    <div className="userList">
      <Menu.Item>Online</Menu.Item>
      {usersArray.map((elem, i) => {
        return (
          <Menu.Item key={i}>
            <div key={i}>{elem}</div>
          </Menu.Item>
        );
      })}
    </div>
  );
}
