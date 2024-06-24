import React, { useState } from "react";
import { Form, Button, Col, Image } from "react-bootstrap";
import { MdAttachFile } from "react-icons/md";
import AudioRecorder from "./AudioRecorder";

const MessageForm = ({ chatId, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isAudioPreview, setIsAudioPreview] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("chat_id", chatId);
    formData.append("message", newMessage);
    if (file) {
      formData.append("file", file);
    }

    onSendMessage(formData);

    setNewMessage("");
    setFile(null);
    setFilePreview(null);
    setIsAudioPreview(false);
  };

  const handleAudioRecorded = (audioBlob) => {
    setFile(audioBlob);
    setFilePreview(URL.createObjectURL(audioBlob));
    setIsAudioPreview(true);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFilePreview(URL.createObjectURL(selectedFile));
    setIsAudioPreview(false);
  };

  const handleCancelFile = () => {
    setFile(null);
    setFilePreview(null);
    setIsAudioPreview(false);
  };

  return (
    <Form onSubmit={handleSendMessage} className="w-100">
      {filePreview && (
        <div className="mb-3 position-relative">
          {file.type.startsWith("image/") && <Image src={filePreview} fluid />}
          {file.type.startsWith("video/") && (
            <video controls width="100%">
              <source src={filePreview} type={file.type} />
            </video>
          )}
          {isAudioPreview && (
            <audio controls>
              <source src={filePreview} type="audio/wav" />
            </audio>
          )}
          <Button variant="danger" className="position-absolute top-0 end-0" onClick={handleCancelFile}>
            Annulla
          </Button>
        </div>
      )}
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
            <input id="fileInput" type="file" onChange={handleFileChange} className="d-none" />
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
        </Col>
      </Form.Group>
    </Form>
  );
};

export default MessageForm;
