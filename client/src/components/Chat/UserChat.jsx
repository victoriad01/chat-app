import { Stack } from "react-bootstrap";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipent";
import Avatar from "../../assets/avatar.svg";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
// eslint-disable-next-line react/prop-types
const UserChat = ({ chat, user }) => {
  const {
    recipientUser,
    // error
  } = useFetchRecipientUser(chat, user);

  const { onlineUsers } = useContext(ChatContext);

  const isOnline = onlineUsers?.some(
    (eachuser) => eachuser?.userId === recipientUser?.id
  );

  return (
    <Stack
      direction="horizontal"
      gap={3}
      role="button"
      className=" user-card align-items-center p-2 justify-content-between"
    >
      <div className="d-flex align-items-center justify-content-center ">
        <div className="me-2">
          <img src={Avatar} alt="profile avatar" height="35px" />
        </div>
        <div className="text-content">
          <p className="name">{recipientUser?.name}</p>
          <p className="text">Text Message</p>
        </div>
      </div>

      <div className="d-flex flex-column">
        <div className="date">12/12/2024</div>
        <div className="this-user-notifications">2</div>
        <div className={isOnline ? "user-online" : ""}></div>
      </div>
    </Stack>
  );
};

export default UserChat;
