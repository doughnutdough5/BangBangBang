export const call119CardHandler = (cardUsingUser, targetUser, currentGame, useCardType) => {
  // 타겟이 나 일 때
  if (cardUsingUser === targetUser) {
    cardUsingUser.increaseHp();
    return;
  }

  const aliveUsers = currentGame.getAliveUsers()
  // 타겟이 나빼고 모두 일 때
  aliveUsers.forEach((user) => {
    if (
      cardUsingUser.id !== user.id &&
      user.characterData.hp < user.maxHp
    ) {
      user.increaseHp();
    }
  });
};
