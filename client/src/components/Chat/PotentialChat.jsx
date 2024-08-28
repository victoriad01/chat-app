import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const PotentialChat = () => {
  const {
    potentialChatPartner,
    //  potentialChatPartnerError,
    createChatFn,
    onlineUsers,
  } = useContext(ChatContext);

  const { user } = useContext(AuthContext);

  return (
    <div className="all-users">
      {potentialChatPartner &&
        potentialChatPartner.map((pchat) => {
          return (
            <div
              onClick={() => createChatFn(user?.data.id, pchat._id)}
              className="single-user"
              key={pchat._id}
            >
              {pchat.name}
              <span
                className={
                  onlineUsers?.some(
                    (eachuser) => eachuser?.userId === pchat._id
                  )
                    ? "user-online"
                    : ""
                }
              ></span>
            </div>
          );
        })}
    </div>
  );
};

export default PotentialChat;
