import { Packets } from '../../../init/loadProtos.js';
import equipCardNotification from '../../../utils/notification/equipCard.notification.js';

export const laserPointerHandler = (cardUsingUser, targetUser, currentGame, useCardType) => {
  const isLaserPointer = cardUsingUser.characterData.equips.includes(
    Packets.CardType.LASER_POINTER,
  );
  if (!isLaserPointer) {
    cardUsingUser.addEquip(useCardType);
    equipCardNotification(useCardType, cardUsingUser.id);
  }
};
