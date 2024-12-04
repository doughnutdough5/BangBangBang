import { PACKET_TYPE } from '../../constants/header.js';
import { Packets } from '../../init/loadProtos.js';
import { findGameById } from '../../sessions/game.session.js';
import { getUserBySocket } from '../../sessions/user.session.js';
import useCardNotification from '../../utils/notification/useCard.notification.js';
import userUpdateNotification from '../../utils/notification/userUpdate.notification.js';
import { createResponse } from '../../utils/response/createResponse.js';
import getCardHandlerByCardType from './index.js';

export const useCardHandler = (socket, payload) => {
  const useCardType = payload.useCardRequest.cardType;
  const targetUserId = payload.useCardRequest.targetUserId.low;
  const cardUsingUser = getUserBySocket(socket);
  const currentGame = findGameById(cardUsingUser.roomId);
  const targetUser = currentGame.findInGameUserById(targetUserId);

  // 페이즈가 밤이면 에러 리스폰스 반환하기(밤에 카드 사용 막기)
  if (currentGame.currentPhase === Packets.PhaseType.END) {
    const errorPayload = {
      useCardResponse: {
        success: false,
        failCode: Packets.GlobalFailCode.INVALID_PHASE,
      },
    };

    socket.write(createResponse(PACKET_TYPE.USE_CARD_RESPONSE, 0, errorPayload));
    return;
  }

  const cardHandler = getCardHandlerByCardType(useCardType);
  if (!cardHandler) {
    console.error('카드 핸들러를 찾을 수 없습니다.');
    return;
  }

  const errorResponse = cardHandler(cardUsingUser, targetUser, currentGame, useCardType);
  if (errorResponse) {
    console.error('카드 핸들러: 뭔가 문제 있음');
    socket.write(createResponse(PACKET_TYPE.USE_CARD_RESPONSE, 0, errorResponse));
    return;
  }

  // 공통 로직
  cardUsingUser.removeHandCard(useCardType);
  currentGame.returnCardToDeck(useCardType);

  const useCardNotificationResponse = useCardNotification(
    useCardType,
    cardUsingUser.id,
    targetUserId,
  );

  //게임 방 안에 모든 유저들에게 카드 사용알림
  currentGame.users.forEach((user) => {
    user.socket.write(
      createResponse(PACKET_TYPE.USE_CARD_NOTIFICATION, 0, useCardNotificationResponse),
    );
  });

  // 동기화
  userUpdateNotification(currentGame.users);

  // 성공 response 전송
  const responsePayload = {
    useCardResponse: {
      success: true,
      failCode: Packets.GlobalFailCode.NONE_FAILCODE,
    },
  };

  socket.write(createResponse(PACKET_TYPE.USE_CARD_RESPONSE, 0, responsePayload));
};
