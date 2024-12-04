import { Packets } from '../../../init/loadProtos.js';
import { animationNotification } from '../../../utils/notification/animation.notification.js';
import userUpdateNotification from '../../../utils/notification/userUpdate.notification.js';
import warningNotification from '../../../utils/notification/warning.notification.js';

export const bombCardHandler = (cardUsingUser, targetUser, currentGame, useCardType) => {
  const currentGameUsers = currentGame.users;
  targetUser.characterData.debuffs.push(Packets.CardType.BOMB);
  const bombAni = () =>
    animationNotification(currentGameUsers, targetUser, Packets.AnimationType.BOMB_ANIMATION);

  const warningNoti = () =>
    warningNotification(targetUser, Packets.WarningType.BOMB_WANING, Date.now() + 30000);

  const bombTimer = () =>
    currentGame.events.scheduleEvent(targetUser.id, 'bombTimer', 5000, {
      targetUser,
      bombAni,
      userUpdateNotification,
      currentGameUsers,
      cardType: Packets.CardType.BOMB,
    });

  currentGame.events.scheduleEvent(targetUser.id, 'warningTimer', 25000, {
    warningNoti,
    bombTimer,
  });
};
