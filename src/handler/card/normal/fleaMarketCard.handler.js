import { getStatefleaMarketTurnEnd, getStatefleaMarketWait } from '../../../constants/stateType.js';
import { fleaMarketNotification } from '../../../utils/notification/fleaMarket.notification.js';
import userUpdateNotification from '../../../utils/notification/userUpdate.notification.js';

export const fleaMarketCardHandler = (cardUsingUser, targetUser, currentGame, useCardType) => {
  const cardUsingUserIndex = currentGame.users.findIndex((user) => user.id === cardUsingUser.id);
  const aliveUsers = currentGame.getAliveUsers();
  currentGame.fleaMarketUsers = aliveUsers
    .splice(cardUsingUserIndex)
    .concat(aliveUsers.splice(0, cardUsingUserIndex));
  currentGame.fleaMarketDeck = [];
  currentGame.fleaMarketPickIndex = [];
  currentGame.fleaMarketTurn = 0;

  // 카드 사용 유저는 첫 번째 유저니까
  const drawCard = currentGame.deck.shift();
  currentGame.fleaMarketDeck.push(drawCard);
  const len = currentGame.fleaMarketUsers.length;
  for (let i = 1; i < len; i++) {
    const drawCard = currentGame.deck.shift();
    currentGame.fleaMarketDeck.push(drawCard);
    currentGame.fleaMarketUsers[i].setCharacterState(getStatefleaMarketWait());
  }

  cardUsingUser.setCharacterState(getStatefleaMarketTurnEnd());
  fleaMarketNotification(
    currentGame.fleaMarketDeck,
    currentGame.fleaMarketPickIndex,
    currentGame.fleaMarketUsers,
  );
  userUpdateNotification(currentGame.fleaMarketUsers);
};
