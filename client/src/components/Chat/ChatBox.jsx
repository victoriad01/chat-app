import { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipent";
import { Stack } from "react-bootstrap";
import moment from "moment";
import InputEmoji from "react-input-emoji";

const ChatBox = () => {
  const {
    currentChat,
    messages,
    isMessageLoading,
    messagesError,
    sendMessageFn,
  } = useContext(ChatContext);

  const { user } = useContext(AuthContext);

  const { recipientUser } = useFetchRecipientUser(currentChat, user.data);

  const [textMessage, setTextMessage] = useState("");
  
  if (!recipientUser)
    return (
      <p style={{ textAlign: "center", width: "100%" }}>
        No Conversation Selected!
      </p>
    );

  if (isMessageLoading)
    return (
      <p style={{ textAlign: "center", width: "100%" }}>loading chat...</p>
    );

  if (messagesError)
    return (
      <p style={{ textAlign: "center", width: "100%" }}>
        Unable to load chats. Please refresh!
      </p>
    );

  return (
    <Stack gap={4} className="chat-box">
      <div className="chat-header">
        <strong>{recipientUser?.name}</strong>
      </div>
      <Stack gap={3} className="messages">
        {messages.length > 0 ? (
          messages.map((message) => (
            <Stack
              className={`${
                message.senderId === user.data.id
                  ? "message self align-self-end flex-grow-0"
                  : "message align-self-start flex-grow-0"
              }`}
              key={message._id}
            >
              <span>{message.text}</span>
              <span className="message-footer">
                {moment(message.createdAt).calendar()}
              </span>
            </Stack>
          ))
        ) : (
          <p className="align-self-center " style={{ color: "gray" }}>
            You have no chat history with this user, start chatting now!
          </p>
        )}
      </Stack>

      <Stack direction="horizontal" gap={3} className="chat-input flex-grow-0">
        <InputEmoji
          value={textMessage}
          onChange={setTextMessage}
          fontFamily="nunito"
          borderColor="rgba(72,112,223, 0.2"
        />
        <button
          className="send-btn"
          onClick={() =>
            sendMessageFn(
              textMessage,
              user.data,
              currentChat._id,
              setTextMessage
            )
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-send-fill"
            viewBox="0 0 16 16"
          >
            <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z" />
          </svg>
        </button>
      </Stack>
    </Stack>
  );
};

export default ChatBox;
