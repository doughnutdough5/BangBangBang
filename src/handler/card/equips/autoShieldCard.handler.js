import equipCardNotification from '../../../utils/notification/equipCard.notification.js';

export const autoShieldHandler = (cardUsingUser, targetUser, currentGame, useCardType) => {
  const isEquip = cardUsingUser.addEquip(useCardType);
  if (!isEquip) {
    currentGame.returnCardToDeck(useCardType);
    return;
  }

  equipCardNotification(useCardType, cardUsingUser.id);
};
