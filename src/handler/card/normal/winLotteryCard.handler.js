export const winLotteryCardHandler = (cardUsingUser, targetUser, currentGame, useCardType) => {
  const gainCards = currentGame.deck.splice(0, 3);
  gainCards.forEach((card) => cardUsingUser.addHandCard(card));
};
