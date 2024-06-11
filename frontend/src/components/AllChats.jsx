import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ListGroup } from "react-bootstrap";
import { setChats, setSelectedChat } from "../redux/actions";

const AllChats = () => {
  const dispatch = useDispatch();
  const chats = useSelector((state) => state.chat.chats);

  useEffect(() => {
    axios.get("/api/chats").then((response) => {
      dispatch(setChats(response.data));
    });
  }, [dispatch]);

  return (
    <ListGroup variant="flush">
      {chats.map((chat) => (
        <ListGroup.Item key={chat.id} action onClick={() => dispatch(setSelectedChat(chat))}>
          {chat.name || `Chat with ${chat.users.map((user) => user.username).join(", ")}`}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default AllChats;
