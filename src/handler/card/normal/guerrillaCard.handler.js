import {
  getStateGuerrillaShooter,
  getStateGuerrillaTarget,
  getStateNormal,
} from '../../../constants/stateType.js';
import userUpdateNotification from '../../../utils/notification/userUpdate.notification.js';

export const guerrillaCardHandler = (cardUsingUser, targetUser, currentGame, useCardType) => {
  const aliveUsers = currentGame.getAliveUsers();
  aliveUsers.forEach((user) => {
    if (cardUsingUser.id !== user.id) {
      cardUsingUser.setCharacterState(getStateGuerrillaShooter(user.id));
      user.setCharacterState(getStateGuerrillaTarget(cardUsingUser.id));
      currentGame.events.scheduleEvent(user.id, 'finishBbangWaitOnGuerrilla', 5000, {
        user,
        cardUsingUser,
        stateNormal: getStateNormal(),
        userUpdateNotification,
        currentGameUsers: currentGame.users,
      });
    }
  });
};
