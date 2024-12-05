import { PACKET_TYPE } from '../../constants/header.js';
import { findGameById } from '../../sessions/game.session.js';
import { getUserBySocket } from '../../sessions/user.session.js';
import userUpdateNotification from '../../utils/notification/userUpdate.notification.js';
import { createResponse } from '../../utils/response/createResponse.js';

export const destroyCardHandler = (socket, payload) => {
  const destroyCards = payload.destroyCardRequest.destroyCards.flatMap(({ type, count }) =>
    new Array(count).fill(type),
  );

  const cardDestroyUser = getUserBySocket(socket);

  destroyCards.forEach((card) => {
    cardDestroyUser.removeHandCard(card);
  });

  const currentGame = findGameById(cardDestroyUser.roomId);
  userUpdateNotification(currentGame.users);

  const responsePayload = {
    destroyCardResponse: {
      handCards: cardDestroyUser.getHandCardsToArray(),
    },
  };

  socket.write(createResponse(PACKET_TYPE.DESTROY_CARD_RESPONSE, 0, responsePayload));
};
