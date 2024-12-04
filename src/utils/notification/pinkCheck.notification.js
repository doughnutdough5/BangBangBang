import { Packets } from '../../init/loadProtos.js';
import userUpdateNotification from './userUpdate.notification.js';

export const pinkCheck = (game) => {
  const characterPink = game.users.find(
    (user) => user.characterData.characterType === Packets.CharacterType.PINK,
  );
  if (characterPink) {
    if (characterPink.characterData.handCardsCount === 0) {
      const card = game.deck.shift();
      characterPink.addHandCard(card);
      userUpdateNotification(game.users);
    }
  }
};
