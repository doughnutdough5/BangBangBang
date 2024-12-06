import { getStateAbsorbing, getStateAbsorbTarget } from '../../../constants/stateType.js';

export const absorbCardHandler = (cardUsingUser, targetUser, currentGame, useCardType) => {
  if(targetUser.characterData.weapon !== 0 || targetUser.characterData.equips.length !== 0 || targetUser.characterData.debuffs.length !== 0 || targetUser.getHandCardsCount() > 0){
    cardUsingUser.setCharacterState(getStateAbsorbing(targetUser.id));
    targetUser.setCharacterState(getStateAbsorbTarget(cardUsingUser.id));
  }
};
