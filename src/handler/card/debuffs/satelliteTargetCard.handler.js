import { Packets } from '../../../init/loadProtos.js';

// 하루 시작 시 3% 확률로 체력3을 소모. 미발동 시 다음 차례의 유저에게 이전
export const satelliteTargetCardHandler = (cardUsingUser, targetUser, currentGame, useCardType) => {
  targetUser.characterData.debuffs.push(Packets.CardType.SATELLITE_TARGET);
};
