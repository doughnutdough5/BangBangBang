import { getStateNormal } from '../../constants/stateType.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { Packets } from '../../init/loadProtos.js';
import { findGameById } from '../../sessions/game.session.js';
import { getUserBySocket } from '../../sessions/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';
import userUpdateNotification from '../../utils/notification/userUpdate.notification.js';

export const cardSelectHandler = (socket, payload) => {
  const cardSelectUser = getUserBySocket(socket);
  const currentGame = findGameById(cardSelectUser.roomId);
  const targetUser = currentGame.findInGameUserById(
    cardSelectUser.characterData.stateInfo.stateTargetUserId,
  );
  const usedCardType =
    cardSelectUser.getCharacterState() === Packets.CharacterStateType.ABSORBING
      ? Packets.CardType.ABSORB
      : Packets.CardType.HALLUCINATION;

  const selectType = payload.cardSelectRequest.selectType;
  let absorbedCard = payload.cardSelectRequest.selectCardType;

  // 신기루, 흡수 공통로직
  if (selectType === Packets.SelectCardType.WEAPON) {
    targetUser.unequipWepon();
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
  }

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
