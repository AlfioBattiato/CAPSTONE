import React from "react";
import { Modal, Button } from "react-bootstrap";
import Dashboard from "./Dashboard";

const DashboardModal = ({ show, onClose, onProfileImageUpdate }) => {
  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header className="bg-black text-white">
        <Modal.Title>Modifica Profilo</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-0">
        <Dashboard onProfileImageUpdate={onProfileImageUpdate} />
      </Modal.Body>
      <Modal.Footer>
        <Button className="gradient-orange border-0" onClick={onClose}>
          Chiudi
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DashboardModal;
