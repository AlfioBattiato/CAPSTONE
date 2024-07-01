import React from "react";
import { Modal, Button } from "react-bootstrap";
import Dashboard from "./Dashboard";

const DashboardModal = ({ show, onClose, onProfileImageUpdate }) => {
  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Modifica Profilo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Dashboard onProfileImageUpdate={onProfileImageUpdate} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Chiudi
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DashboardModal;
