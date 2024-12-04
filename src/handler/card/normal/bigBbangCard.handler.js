import {
  getStateBigBbangShooter,
  getStateBigBbangTarget,
  getStateNormal,
} from '../../../constants/stateType.js';
import userUpdateNotification from '../../../utils/notification/userUpdate.notification.js';

export const bigBbangCardHandler = (cardUsingUser, targetUser, currentGame, useCardType) => {
  currentGame.users.forEach((user) => {
    if (cardUsingUser.id !== user.id && 0 < user.characterData.hp) {
      cardUsingUser.setCharacterState(getStateBigBbangShooter(user.id));
      user.setCharacterState(getStateBigBbangTarget(cardUsingUser.id));
      currentGame.events.scheduleEvent(user.id, 'finishShieldWaitOnBigBbang', 5000, {
        user,
        cardUsingUser,
        stateNormal: getStateNormal(),
        userUpdateNotification,
        currentGameUsers: currentGame.users,
      });
    }
  });
};
