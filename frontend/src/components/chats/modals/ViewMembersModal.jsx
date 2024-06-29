import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, ListGroup, Image } from "react-bootstrap";
import { Link } from "react-router-dom";

const ViewMembersModal = ({ show, handleClose, chatId }) => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (show) {
      axios
        .get(`/api/chats/${chatId}`)
        .then((response) => {
          setMembers(response.data.users);
        })
        .catch((error) => {
          console.error("Failed to fetch members", error);
        });
    }
  }, [show, chatId]);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Membri del Gruppo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup>
          {members.map((member) => (
            <ListGroup.Item key={member.id}>
              <Link
                to={`/profile/${member.id}`}
                className="text-black"
                style={{
                  textDecoration: "none",
                }}
              >
                <Image src={member.profile_img || "default-profile-image-url"} roundedCircle width={30} height={30} />
                <span className="ms-2">{member.username}</span>
              </Link>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
    </Modal>
  );
};

export default ViewMembersModal;
