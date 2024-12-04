import { fleaMarketNotification } from '../../utils/notification/fleaMarket.notification.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { Packets } from '../../init/loadProtos.js';
import { findGameById } from '../../sessions/game.session.js';
import { getUserBySocket } from '../../sessions/user.session.js';
import {
  getStateNormal,
  getStatefleaMarketTurnEnd,
  getStatefleaMarketTurnOver,
} from '../../constants/stateType.js';
import { createResponse } from '../../utils/response/createResponse.js';
import userUpdateNotification from '../../utils/notification/userUpdate.notification.js';

export const fleaMarketPickHandler = (socket, payload) => {
  const gainCardUser = getUserBySocket(socket);
  const currentGame = findGameById(gainCardUser.roomId);
  const fleaMarketDeck = currentGame.fleaMarketDeck;
  const fleaMarketUsers = currentGame.fleaMarketUsers;
  const pickIndex = payload.fleaMarketPickRequest.pickIndex;

  // 현재 턴인 사람과 request로 날아온 사람의 id가 다를 때 === 현재
  if (fleaMarketUsers[currentGame.fleaMarketTurn].id !== gainCardUser.id) {
    const errorResponse = {
      fleaMarketPickResponse: {
        success: false,
        failCode: Packets.GlobalFailCode.INVALID_REQUEST,
      },
    };

    socket.write(createResponse(PACKET_TYPE.FLEA_MARKET_PICK_RESPONSE, 0, errorResponse));
    return;
  }

  const alreadyPicked = currentGame.fleaMarketPickIndex.findIndex((pick) => pick === pickIndex);
  if (alreadyPicked !== -1) {
    console.error('이미 선택된 카드');
    const errorResponse = {
      fleaMarketPickResponse: {
        success: false,
        failCode: Packets.GlobalFailCode.INVALID_REQUEST,
      },
    };

    socket.write(createResponse(PACKET_TYPE.FLEA_MARKET_PICK_RESPONSE, 0, errorResponse));
    return;
  }

  currentGame.fleaMarketPickIndex.push(pickIndex); // push된 이후에 해당 배열의 length를 반환
  currentGame.fleaMarketTurn++;
  // 왼쪽 카드의 순서는 0부터 시작
  gainCardUser.addHandCard(fleaMarketDeck[pickIndex]);

  gainCardUser.setCharacterState(getStatefleaMarketTurnOver()); // 플리마켓 카드 선택한 유저 상태 정상화

  if (currentGame.fleaMarketTurn === fleaMarketUsers.length) {
    // 마지막 선택 이전에 normal --> 마지막 선택 이후에
    fleaMarketUsers.forEach((user) => {
      user.setCharacterState(getStateNormal());
    });
  } else {
    fleaMarketUsers[currentGame.fleaMarketTurn].setCharacterState(getStatefleaMarketTurnEnd()); // 플리마켓 대기 배열에 남아있는 첫번째 유저 상태 변경
  }

  fleaMarketNotification(fleaMarketDeck, currentGame.fleaMarketPickIndex, fleaMarketUsers);
  userUpdateNotification(fleaMarketUsers);

  const responsePayload = {
    fleaMarketPickResponse: {
      success: true,
      failCode: Packets.GlobalFailCode.NONE_FAILCODE,
    },
  };
  socket.write(createResponse(PACKET_TYPE.FLEA_MARKET_PICK_RESPONSE, 0, responsePayload));
};
// 노티피케이션을 먼저 보내주고(게임 인원수 만큼
// 카드 뽑아서 배열에 넣고 카드 타입으로 보내주고
// 인덱스 숫자 만큼 배열을 새로 만들어서 픽인덱스에 넣어서 보내보기)
// 핸들러 리퀘스트가 오면 해당 핸들러에서 픽인덱스 숫자 뽑아서 카드와 인덱스
// 배열에서 제거하고 다시 노티피케이션 바로 보내고 리스폰로
