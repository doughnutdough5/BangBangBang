import { Packets } from '../../../init/loadProtos.js';

export const containmentUnitCardHandler = (cardUsingUser, targetUser, currentGame, useCardType) => {
  targetUser.characterData.debuffs.push(Packets.CardType.CONTAINMENT_UNIT);
};
