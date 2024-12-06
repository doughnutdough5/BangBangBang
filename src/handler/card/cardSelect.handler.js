import { getStateNormal } from '../../constants/stateType.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { Packets } from '../../init/loadProtos.js';
import { findGameById } from '../../sessions/game.session.js';
import { getUserBySocket } from '../../sessions/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';
import userUpdateNotification from '../../utils/notification/userUpdate.notification.js';

export const cardSelectHandler = (socket, payload) => {
  // socket으로 들어온 유저는 흡수 또는 신기루 카드를 쓴 유저
  // payload.cardSelectRequest.selectType은 흡수 또는 신기루를 "당한" 유저의 카드 위치(화살표 부분)
  // payload.cardSelectRequest.selectCardType은 흡수 또는 신기루로 날아온 카드 선택 리퀘스트에 담긴 카드
  // 이를 socket으로 들어온 유저의 손패에 넣어주거나 파괴하면 될 듯?
  // 그 전에 흡수 또는 신기루를 "당한" 유저의 해당 위치에 있는 카드를 먼저 제거
  const cardSelectUser = getUserBySocket(socket);
  const currentGame = findGameById(cardSelectUser.roomId);
  const targetUser = currentGame.findInGameUserById(
    cardSelectUser.characterData.stateInfo.stateTargetUserId,
  );
  const usedCardType =
    cardSelectUser.getCharacterState() === Packets.CharacterStateType.ABSORBING
      ? Packets.CardType.ABSORB
      : Packets.CardType.HALLUCINATION; // 현재 상태에 따라 어떤 카드인지

  const selectType = payload.cardSelectRequest.selectType;
  let absorbedCard = payload.cardSelectRequest.selectCardType;

  // 신기루, 흡수 공통로직
  if (selectType === Packets.SelectCardType.WEAPON) {
    targetUser.unequipWepon(); // <-- 클라에서는 장착된 상태로 표시됨
  } else if (selectType === Packets.SelectCardType.EQUIP) {
    targetUser.removeEquipCard(absorbedCard);
  } else if (selectType === Packets.SelectCardType.DEBUFF) {
    targetUser.removeDebuffCard(absorbedCard);
    // 디버프 이벤트 등록 해제, 상태 변경
    currentGame.events.cancelEvent(targetUser.id, 'bombTimer');
    currentGame.events.cancelEvent(targetUser.id, 'warningTimer');
  } else {
    const randomHandCard = targetUser.selectRandomHandCard();
    targetUser.removeHandCard(randomHandCard);
    absorbedCard = randomHandCard;
  }

  if (usedCardType === Packets.CardType.ABSORB) {
    cardSelectUser.addHandCard(absorbedCard);
  } else {
    currentGame.returnCardToDeck(absorbedCard);
  };

  cardSelectUser.setCharacterState(getStateNormal());
  targetUser.setCharacterState(getStateNormal());
  userUpdateNotification(currentGame.users);

  const responsePayload = {
    cardSelectResponse: {
      success: true,
      failCode: Packets.GlobalFailCode.NONE_FAILCODE,
    },
  };

  socket.write(createResponse(PACKET_TYPE.CARD_SELECT_RESPONSE, 0, responsePayload));
};
