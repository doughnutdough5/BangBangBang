const positionUpdateNotification = (users) => {
  const responsePayload = {
    positionUpdateNotification: {
      characterPositions: users.map((user) => {
        return { id: user.id, x: user.getX(), y: user.getY() };
      }),
    },
  };

  return responsePayload;
};

export default positionUpdateNotification;
