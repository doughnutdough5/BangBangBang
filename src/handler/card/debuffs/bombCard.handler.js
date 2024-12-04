import { Packets } from '../../../init/loadProtos.js';
import { animationNotification } from '../../../utils/notification/animation.notification.js';
import userUpdateNotification from '../../../utils/notification/userUpdate.notification.js';
import warningNotification from '../../../utils/notification/warning.notification.js';

export const bombCardHandler = (cardUsingUser, targetUser, currentGame, useCardType) => {
  const currentGameUsers = currentGame.users;
  targetUser.characterData.debuffs.push(Packets.CardType.BOMB);
  const bombAni = () =>
    animationNotification(currentGameUsers, targetUser, Packets.AnimationType.BOMB_ANIMATION);

  // TODO: 개선사항 폭탄 관리물 npc한테 주는거 아니게 or 시간 초기화 -> 지금은 의문사
  // 워닝 노티를 5초 남았을 때 보내야함... 25초 뒤
  const warningNoti = () =>
    warningNotification(targetUser, Packets.WarningType.BOMB_WANING, Date.now() + 30000);
  // 나한테 폭탄이 왔다는 알림 => warningNotification (25초동안 실행) => 폭탄이 터지는 scheduleEvent (5초 후 실행) => 패스를 했을경우 -> 초기화하면서 다시 30초부터 시작
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
