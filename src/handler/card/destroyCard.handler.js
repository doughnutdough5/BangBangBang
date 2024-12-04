import { PACKET_TYPE } from '../../constants/header.js';
import { findGameById } from '../../sessions/game.session.js';
import { getUserBySocket } from '../../sessions/user.session.js';
import userUpdateNotification from '../../utils/notification/userUpdate.notification.js';
import { createResponse } from '../../utils/response/createResponse.js';

// 페이로드: {"destroyCardRequest":{"destroyCards":}}
// phaseUpdate에서 한번더 삭제 로직을 넣으면? <-- 어차피 이 리퀘가 날라오면 피보다 카드수가 적을 것이기 때문에, 노티에서 hp에 따라 랜덤으로 카드를 삭제해주면 로직 겹칠일은 없음
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

  // response
  const responsePayload = {
    destroyCardResponse: {
      handCards: cardDestroyUser.characterData.handCards.map((card) => {
        return { type: card.type, count: card.count };
      }),
    },
  };

  socket.write(createResponse(PACKET_TYPE.DESTROY_CARD_RESPONSE, 0, responsePayload));
};
