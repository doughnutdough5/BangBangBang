import { PACKET_TYPE } from '../../constants/header.js';
import { Packets } from '../../init/loadProtos.js';
import { findGameById } from '../../sessions/game.session.js';
import { findUserById, getUserBySocket } from '../../sessions/user.session.js';
import userUpdateNotification from '../../utils/notification/userUpdate.notification.js';
import warningNotification from '../../utils/notification/warning.notification.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { bombCardHandler } from '../card/debuffs/bombCard.handler.js';

export const passDebuffHandler = (socket, payload) => {
  const passer = getUserBySocket(socket);
  const debuffCard = payload.passDebuffRequest.debuffCardType;
  const debuffUser = findUserById(payload.passDebuffRequest.targetUserId.low);
  const currentGame = findGameById(passer.roomId);

  currentGame.events.cancelEvent(passer.id, 'warningTimer');
  currentGame.events.cancelEvent(passer.id, 'bombTimer');

  passer.characterData.debuffs = passer.characterData.debuffs.filter(
    (debuff) => debuff !== debuffCard,
  );
  bombCardHandler(passer, debuffUser, currentGame, Packets.CardType.BOMB);
  warningNotification(passer, Packets.WarningType.NO_WARNING, Date.now());

  userUpdateNotification(currentGame.users);

  const responsePayload = {
    passDebuffResponse: {
      success: true,
      failCode: Packets.GlobalFailCode.NONE_FAILCODE,
    },
  };

  socket.write(createResponse(PACKET_TYPE.PASS_DEBUFF_RESPONSE, 0, responsePayload));
};
