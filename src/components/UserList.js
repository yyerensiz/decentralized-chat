import React from 'react';
import { ListGroup } from 'react-bootstrap';

const UserList = ({ users }) => {
  return (
    <ListGroup>
      {users.map((user, index) => (
        <ListGroup.Item key={index}>
          {user.nickname} ({user.wallet})
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default UserList;
