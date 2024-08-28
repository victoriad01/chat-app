import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, postRequest, getRequest } from "../utils/service";
import { io } from "socket.io-client";

export const ChatContext = createContext();

// eslint-disable-next-line react/prop-types
export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [isUserChatsLoading, setIsUserChatLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChatPartner, setPotentialChatPartner] = useState(null);
  const [potentialChatPartnerError, setPotentialChatPartnerError] =
    useState(null);
  const [currentChat, setCurrentChat] = useState(null);

  const [messages, setMessages] = useState(null);
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);

  // eslint-disable-next-line no-unused-vars
  const [sendTextMessageError, setSendTextMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);

  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const socket = io("http://localhost:3000");
    setSocket(socket);
    // clean-up
    return () => {
      socket.disconnect();
    };
  }, [user]);

  // Add online users
  useEffect(() => {
    if (socket === null || user === null) return;
    // eslint-disable-next-line react/prop-types
    socket.emit("addNewUser", user?.data.id);
    socket.on("getOnlineUsers", (result) => {
      setOnlineUsers(result);
    });
    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket, user]);

  // Send message Socket
  useEffect(() => {
    if (socket === null || user === null) return;

    const recipientId = currentChat?.members?.find(
      // eslint-disable-next-line react/prop-types
      (id) => id !== user?.data.id
    );
    socket.emit("sendMessage", { ...newMessage, recipientId });
  }, [currentChat, newMessage, socket, user]);

  // Receive Message Socket
  useEffect(() => {
    if (socket === null || user === null) return;
    // socket.onAny((event, ...args) => {
    //   console.log(`Caught event: ${event}`, args);
    // });
    socket.on("getMessage", (message) => {
      if (currentChat._id !== message.chatId) return;
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("getMessage");
    };
  }, [currentChat?._id, userChats, socket, user]);

  useEffect(() => {
    const getuserChats = async () => {
      // eslint-disable-next-line react/prop-types
      if (user?.data.id) {
        setIsUserChatLoading(true);
        setUserChatsError(null);
        const response = await getRequest(
          // eslint-disable-next-line react/prop-types
          `${baseUrl}/chats/find/${user?.data.id}`
        );
        setIsUserChatLoading(false);
        if (response.error) {
          return setUserChatsError(response);
        }
        setUserChats(response);
      }
    };
    getuserChats();
  }, [user]);

  useEffect(() => {
    const getUser = async () => {
      const response = await getRequest(`${baseUrl}/users`);

      if (response.error) {
        setPotentialChatPartnerError(response.error);
        return console.log("Error fetching users: " + response.error);
      }

      const possibleChatPartners = response?.data.filter((eachUser) => {
        let isChatCreated = false;
        // eslint-disable-next-line react/prop-types
        if (user?.data.id === eachUser._id) return false;
        if (userChats) {
          isChatCreated = userChats?.some((chat) => {
            return (
              chat.members[0] === eachUser._id ||
              chat.members[1] === eachUser._id
            );
          });
        }
        return !isChatCreated;
      });
      setPotentialChatPartner(possibleChatPartners);
    };
    getUser();
    // eslint-disable-next-line react/prop-types
  }, [user?.data.id, userChats]);

  const createChatFn = useCallback(async (firstId, secondId) => {
    const response = await postRequest(
      `${baseUrl}/chats`,
      JSON.stringify({
        firstId,
        secondId,
      })
    );

    if (response.error) {
      return console.log("Error creatin chat: " + response.error);
    }
    setUserChats((prev) => [...prev, response]);
  }, []);

  const updateCurrentChatFn = useCallback((chat) => {
    setCurrentChat(chat);
  }, []);

  // get and set messages
  useEffect(() => {
    const getMessages = async () => {
      setIsMessageLoading(true);
      setMessagesError(null);

      const response = await getRequest(
        `${baseUrl}/messages/${currentChat?._id}`
      );
      setIsMessageLoading(false);
      if (response.error) {
        return setMessagesError(response);
      }
      setMessages(response);
    };
    getMessages();
  }, [currentChat?._id]);

  const sendMessageFn = useCallback(
    async (message, sender, currentChatId, setTextMessage) => {
      if (!message) return console.log("You must type a message");
      const response = await postRequest(
        `${baseUrl}/messages`,
        JSON.stringify({
          chatId: currentChatId,
          senderId: sender.id,
          text: message,
        })
      );
      if (response.error) {
        return setSendTextMessageError(response);
      }
      setNewMessage(response);
      setMessages((prev) => [...prev, response]);
      setTextMessage("");
    },
    []
  );

  return (
    <ChatContext.Provider
      value={{
        userChats,
        setUserChats,
        isUserChatsLoading,
        setIsUserChatLoading,
        userChatsError,
        setUserChatsError,
        potentialChatPartner,
        potentialChatPartnerError,
        createChatFn,
        updateCurrentChatFn,
        messages,
        isMessageLoading,
        messagesError,
        currentChat,
        sendMessageFn,
        onlineUsers,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
