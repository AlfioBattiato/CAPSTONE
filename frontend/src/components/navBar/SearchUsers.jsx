import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, FormControl, ListGroup, Image } from "react-bootstrap";

const SearchUsers = ({ allUsers, setAllUsers }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const handleFormClick = () => {
    if (allUsers.length === 0) {
      axios
        .get(`/api/users`)
        .then((response) => {
          setAllUsers(response.data);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      const filteredUsers = allUsers.filter((user) => user.username.toLowerCase().includes(query.toLowerCase()));
      setSearchResults(filteredUsers);
    } else {
      setSearchResults([]);
    }
  };

  const handleUserSelect = (userId) => {
    setSearchQuery("");
    setSearchResults([]);
    navigate(`/profile/${userId}`);
  };

  return (
    <Form
      className="d-flex mx-3 position-relative search-users-form"
      onSubmit={(e) => e.preventDefault()}
      onClick={handleFormClick}
    >
      <FormControl
        type="search"
        placeholder="Cerca utenti"
        className="me-2 rounded-pill"
        value={searchQuery}
        onChange={handleSearchChange}
      />
      {searchResults.length > 0 && (
        <ListGroup className="position-absolute w-100 search-results custom-scrollbar">
          {searchResults.map((result) => (
            <ListGroup.Item
              key={result.id}
              action
              onClick={() => handleUserSelect(result.id)}
              className="border-0 search-item d-flex align-items-center"
            >
              <Image src={result.profile_img} roundedCircle width={30} height={30} className="me-2" />
              {result.username}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Form>
  );
};

export default SearchUsers;
