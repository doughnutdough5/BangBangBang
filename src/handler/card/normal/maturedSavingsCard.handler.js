export const maturedSavingsCardHandler = (cardUsingUser, targetUser, currentGame, useCardType) => {
  const gainCards = currentGame.deck.splice(0, 2);
  gainCards.forEach((card) => cardUsingUser.addHandCard(card));
};
