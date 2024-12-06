import {
  getStateHallucinating,
  getStateHallucinationTarget,
} from '../../../constants/stateType.js';

export const hallucinationCardHandler = (cardUsingUser, targetUser, currentGame, useCardType) => {
  if(targetUser.characterData.weapon !== 0 || targetUser.characterData.equips.length !== 0 || targetUser.characterData.debuffs.length !== 0 || targetUser.getHandCardsCount() > 0){
    cardUsingUser.setCharacterState(getStateHallucinating(targetUser.id));
    targetUser.setCharacterState(getStateHallucinationTarget(cardUsingUser.id));
  }
};
