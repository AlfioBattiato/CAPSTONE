import React, { useState } from "react";
import { Form, Button, Col, Image } from "react-bootstrap";
import { MdAttachFile } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
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
    <Form onSubmit={handleSendMessage} className="w-100 bg-trasparent text-end ">
      {filePreview && (
        <div className="mb-3 position-relative pe-5">
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
          <Button
            className="position-absolute d-flex align-items-center justify-content-center rounded-circle top-0 end-0 gradient-orange border-0"
            style={{
              width: "40px",
              height: "40px",
            }}
            onClick={handleCancelFile}
          >
            <FaTrash />
          </Button>
        </div>
      )}
      <Form.Group controlId="messageInput" className="d-flex align-items-center">
        <Col xs={8} md={9} xl={10} className="p-1">
          <Form.Control
            type="text"
            placeholder="Scrivi un messaggio..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="rounded-pill search-input"
            style={{ backgroundColor: "#FFF", color: "#000" }}
          />
        </Col>
        <Col xs={4} md={3} xl={2} className="p-1 d-flex align-items-center justify-content-around">
          <label
            htmlFor="fileInput"
            className="mb-0 d-flex align-items-center justify-content-center fs-3 gradient-orange"
            style={{
              borderRadius: "50%",
              width: "40px",
              height: "40px",
            }}
          >
            <MdAttachFile className="" />
            <input id="fileInput" type="file" onChange={handleFileChange} className="d-none" />
          </label>

          <AudioRecorder onAudioRecorded={handleAudioRecorded} />

          <Button
            variant="light"
            type="submit"
            className="d-flex align-items-center justify-content-center gradient-orange"
            style={{ height: "38px" }}
            disabled={!newMessage.trim() && !file}
          >
            <p className="m-0 text-white fs-5">Invia</p>
          </Button>
        </Col>
      </Form.Group>
    </Form>
  );
};

export default MessageForm;
