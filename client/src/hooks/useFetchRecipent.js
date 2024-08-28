import { useEffect, useState } from "react";
import { baseUrl, getRequest } from "../utils/service";

export const useFetchRecipientUser = (chat, user) => {
  const [recipientUser, setRecipientUser] = useState(null);
  const [error, setError] = useState(null);

  let recipientId;

  if (chat?.members) {
    recipientId = chat?.members?.find((id) => {
      return id !== user?.id;
    });
  }

  useEffect(() => {
    const getUser = async () => {
      if (!recipientId) return null;

      const response = await getRequest(`${baseUrl}/users/find/${recipientId}`);

      if (response.error) {
        return setError(error);
      }

      setRecipientUser(response.data);
    };

    getUser();
  }, [error, recipientId]);

  return { recipientUser, error };
};
