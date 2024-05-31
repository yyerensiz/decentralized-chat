import React, { useState, useEffect } from 'react';
import { Form, Button, ListGroup } from 'react-bootstrap';

const Chat = ({ contract, account }) => {
  const [receiver, setReceiver] = useState("");
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    if (receiver) {
      loadChatHistory();
    }
  }, [receiver]);

  const loadChatHistory = async () => {
    const messages = await contract.methods.getChatHistory(account, receiver).call();
    setChatHistory(messages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await contract.methods.sendMessage(receiver, message).send({ from: account });
    loadChatHistory();
    setMessage("");
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formReceiver">
          <Form.Label>Receiver Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter receiver address"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formMessage">
          <Form.Label>Message</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Send
        </Button>
      </Form>
      <ListGroup>
        {chatHistory.map((msg, index) => (
          <ListGroup.Item key={index}>{msg}</ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default Chat;
