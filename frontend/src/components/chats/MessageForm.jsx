import React, { useState } from "react";
import { Form, Button, Col } from "react-bootstrap";
import { MdAttachFile } from "react-icons/md";
import AudioRecorder from "./AudioRecorder";

const MessageForm = ({ chatId, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (file && file.size > 10 * 1024 * 1024) {
      setErrorMessage("File size should be less than 10MB");
      return;
    }

    const formData = new FormData();
    formData.append("chat_id", chatId);
    formData.append("message", newMessage);
    if (file) {
      formData.append("file", file);
    }

    onSendMessage(formData);

    setNewMessage("");
    setFile(null);
    setErrorMessage("");
  };

  const handleAudioRecorded = (audioBlob) => {
    if (audioBlob.size > 10 * 1024 * 1024) {
      setErrorMessage("Audio size should be less than 10MB");
      return;
    }

    const formData = new FormData();
    formData.append("chat_id", chatId);
    formData.append("file", audioBlob, "recording.wav");

    onSendMessage(formData);
  };

  const handleCancel = () => {
    setNewMessage("");
    setFile(null);
    setErrorMessage("");
  };

  return (
    <Form onSubmit={handleSendMessage} className="w-100">
      <Form.Group controlId="messageInput" className="d-flex align-items-center">
        <Col xs={8} md={9} xl={10} className="p-1">
          <Form.Control
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="rounded-pill"
            style={{ backgroundColor: "#FFF", color: "#000" }}
          />
        </Col>
        <Col xs={4} md={3} xl={2} className="p-1 d-flex align-items-center justify-content-around">
          <label htmlFor="fileInput" className="mb-0 d-flex align-items-center fs-3">
            <MdAttachFile style={{ color: "#FFF", cursor: "pointer" }} />
            <input
              id="fileInput"
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="d-none"
              accept="image/*,video/*,audio/*"
            />
          </label>
          <AudioRecorder onAudioRecorded={handleAudioRecorded} />
          <Button
            variant="light"
            type="submit"
            className="d-flex align-items-center justify-content-center"
            style={{ backgroundColor: "#CC0000", borderColor: "#CC0000", height: "38px" }}
            disabled={!newMessage.trim() && !file}
          >
            <p style={{ color: "#FFF" }} className="m-0 fs-5">
              Invia
            </p>
          </Button>
          <Button
            variant="secondary"
            onClick={handleCancel}
            className="d-flex align-items-center justify-content-center"
            style={{ height: "38px" }}
          >
            <p style={{ color: "#FFF" }} className="m-0 fs-5">
              Annulla
            </p>
          </Button>
        </Col>
      </Form.Group>
      {errorMessage && <p className="text-danger mt-2">{errorMessage}</p>}
    </Form>
  );
};

export default MessageForm;
