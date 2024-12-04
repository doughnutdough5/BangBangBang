export const call119CardHandler = (cardUsingUser, targetUser, currentGame, useCardType) => {
  // 타겟이 나 일 때
  if (cardUsingUser === targetUser) {
    cardUsingUser.increaseHp();
    return;
  }

  // 타겟이 나빼고 모두 일 때
  currentGame.users.forEach((user) => {
    if (
      cardUsingUser.id !== user.id &&
      0 < user.characterData.hp &&
      user.characterData.hp < user.maxHp
    ) {
      user.increaseHp();
    }
  });
};
