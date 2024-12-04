import { Packets } from '../../init/loadProtos.js';
import userUpdateNotification from './userUpdate.notification.js';

export const deadCheck = (game) => {
  const deathUser = game.users.find((user) => user.characterData.hp === 0);
  if (deathUser && deathUser.characterData.alive) {
    deathUser.characterData.alive = false;
    characterTypeGetCard(game, deathUser);
  }
};

//캐릭터 특성 - 마스크
const characterTypeGetCard = (game, deathUser) => {
  const maskUser = game.users.find(
    (user) => user.characterData.characterType === Packets.CharacterType.MASK,
  );

  if (!maskUser) {
    return;
  }
  const deathUserHandCards = deathUser.characterData.handCards;
  const handCardsLength = deathUserHandCards.length;
  const deathUserEquips = deathUser.characterData.equips;
  const equipCardsLength = deathUserEquips.length;
  if (deathUser.characterData.weapon !== 0) {
    maskUser.addHandCard(deathUser.characterData.weapon);
  }
  for (let i = 0; i < equipCardsLength; i++) {
    maskUser.addHandCard(deathUserEquips[i]);
  }

  for (let i = 0; i < handCardsLength; i++) {
    for (let j = 0; j < deathUserHandCards[i].count; j++) {
      maskUser.addHandCard(deathUserHandCards[i].type);
    }
  }

  userUpdateNotification(game.users);
};
