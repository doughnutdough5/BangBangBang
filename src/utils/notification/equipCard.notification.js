const equipCardNotification = (cardType, cardUsingUserId) => {
  const responsePayload = {
    equipCardNotification: {
      cardType: cardType,
      userId: cardUsingUserId,
    },
  };

  return responsePayload;
};

export default equipCardNotification;