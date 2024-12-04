const useCardNotification = (cardType, cardUsingUserId, targetUserId = 0) => {
  const responsePayload = {
    useCardNotification: {
      cardType: cardType,
      userId: cardUsingUserId,
      targetUserId: targetUserId,
    },
  };

  return responsePayload;
};

export default useCardNotification;