import {
  getStateBigBbangShooter,
  getStateBigBbangTarget,
  getStateNormal,
} from '../../constants/stateType.js';
import { Packets } from '../../init/loadProtos.js';
import userUpdateNotification from '../../utils/notification/userUpdate.notification.js';

export const bigBbangCardHandler = (cardUsingUser, targetUser, currentGame) => {
  currentGame.users.forEach((user) => {
    if (cardUsingUser.id !== user.id && 0 < user.characterData.hp) {
      //나를 제외한 살아있는 모두에게
      //대상자 상태 변경
      cardUsingUser.setCharacterState(getStateBigBbangShooter(user.id));
      user.setCharacterState(getStateBigBbangTarget(cardUsingUser.id));
      currentGame.events.scheduleEvent(user.id, 'finishShieldWaitOnBigBbang', 5000, {
        user,
        cardUsingUser,
        stateNormal: getStateNormal(),
        userUpdateNotification,
        currentGameUsers: currentGame.users,
      });
      console.log('난사 당한 사람:', user.id);
    }
  });
};