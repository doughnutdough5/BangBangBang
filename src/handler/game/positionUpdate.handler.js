import { PACKET_TYPE } from '../../constants/header.js';
import { findGameById } from '../../sessions/game.session.js';
import { getUserBySocket } from '../../sessions/user.session.js';
import positionUpdateNotification from '../../utils/notification/positionUpdate.notification.js';
import { createResponse } from '../../utils/response/createResponse.js';

export const positionUpdateHandler = (socket, payload) => {
  const { x, y } = payload.positionUpdateRequest;

  const user = getUserBySocket(socket);

  const prevX = user.position.x;
  const prevY = user.position.y;

  // Throttling 처리: 250ms 이상 경과해야 함
  const now = Date.now();
  if (user.lastUpdateTime && now - user.lastUpdateTime < 250) {
    return;
  }

  // 거리 조건: 0.25 이상 움직여야 함
  const distance = Math.sqrt(Math.pow(x - prevX, 2) + Math.pow(y - prevY, 2));
  if (distance < 0.25) {
    return;
  }

  // 좌표 업데이트 및 시간 갱신
  user.updatePosition(x, y);
  user.lastUpdateTime = now;

  // 범위 내 유저 필터링 및 알림 전송
  const currentGame = findGameById(user.roomId);
  if (!currentGame) {
    return;
  }

  const inGameUsers = currentGame.users;

  const notificationPayload = positionUpdateNotification(inGameUsers);
  inGameUsers.forEach((user) => {
    user.socket.write(
      createResponse(PACKET_TYPE.POSITION_UPDATE_NOTIFICATION, 0, notificationPayload),
    );
  });
};
