import {
  getStateNormal,
  getStateDeathInitShooter,
  getStateDeathInitTarget,
} from '../../../constants/stateType.js';
import userUpdateNotification from '../../../utils/notification/userUpdate.notification.js';

// 플레이어 한명을 지정하여 번갈아가며 빵야!카드를 낸다. 빵야!를 못내면 체력 1 소모  타겟 : 목록에서 선택  방어 카드 : 빵야!
export const deathMatchCardHandler = (cardUsingUser, targetUser, currentGame, useCardType) => {
  // 시전자 state 변경
  cardUsingUser.setCharacterState(getStateDeathInitShooter(targetUser.id));
  // 대상자 state 변경
  targetUser.setCharacterState(getStateDeathInitTarget(cardUsingUser.id));

  // 현피 대상자 5초 대기
  currentGame.events.scheduleEvent(targetUser.id, 'onDeathMatch', 5000, {
    cardUsingUser,
    targetUser,
    stateNormal: getStateNormal(),
    userUpdateNotification,
    currentGameUsers: currentGame.users,
  });
};
