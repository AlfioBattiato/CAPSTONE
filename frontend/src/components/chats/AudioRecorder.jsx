import React, { useState, useRef } from "react";
import { HiMicrophone } from "react-icons/hi2";

const AudioRecorder = ({ onAudioRecorded }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);

    mediaRecorder.current.ondataavailable = (event) => {
      audioChunks.current.push(event.data);
    };

    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioURL(audioUrl);
      audioChunks.current = [];
    };

    mediaRecorder.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.current.stop();
    setIsRecording(false);
  };

  const sendAudio = () => {
    const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
    onAudioRecorded(audioBlob);
    setAudioURL("");
  };

  const cancelAudio = () => {
    setAudioURL("");
    audioChunks.current = [];
  };

  return (
    <div>
      <button
        type="button"
        onClick={isRecording ? stopRecording : startRecording}
        className={`btn ${isRecording ? "bg-white" : "bg-blue"} p-2 rounded-circle`}
        style={{
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isRecording ? (
          <div className="spinner-grow text-danger" role="status" style={{ width: "20px", height: "20px" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : (
          <HiMicrophone className="text-white fs-3" />
        )}
      </button>
      {audioURL && (
        <div className="mt-2">
          <audio controls src={audioURL} />
          <button onClick={sendAudio} className="btn btn-success mx-2">
            Send
          </button>
          <button onClick={cancelAudio} className="btn btn-danger">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
