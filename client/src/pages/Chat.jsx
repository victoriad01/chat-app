import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { Container, Stack } from "react-bootstrap";
import UserChat from "../components/Chat/UserChat.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import PotentialChat from "../components/Chat/PotentialChat.jsx";
import ChatBox from "../components/Chat/ChatBox.jsx";

const Chat = () => {
  const {
    userChats,
    setUserChats,
    isUserChatsLoading,
    setIsUserChatLoading,
    userChatsError,
    setUserChatsError,
    updateCurrentChatFn,
  } = useContext(ChatContext);

  const { user } = useContext(AuthContext);

  return (
    <Container>
      <PotentialChat />
      {userChats?.length > 0 ? (
        <Stack direction="horizontal" gap={4} className="align-items-start">
          <Stack className="messages-box flex-grow-0 pe-3" gap={3}>
            {isUserChatsLoading && <p>Loading Chats...</p>}
            {userChats?.map((chat) => {
              return (
                <div key={chat?._id} onClick={() => updateCurrentChatFn(chat)}>
                  <UserChat chat={chat} user={user.data} />
                </div>
              );
            })}
          </Stack>
          <ChatBox />
        </Stack>
      ) : null}
    </Container>
  );
};

export default Chat;
