export const maturedSavingsCardHandler = (cardUsingUser, targetUser, currentGame, useCardType) => {
  for (let i = 0; i < 2; i++) {
    const gainCard = currentGame.deck.shift();
    cardUsingUser.addHandCard(gainCard);
  }
};
