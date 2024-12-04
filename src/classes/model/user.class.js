import { PACKET_TYPE } from '../../constants/header.js';
import { Packets } from '../../init/loadProtos.js';
import userUpdateNotification from '../../utils/notification/userUpdate.notification.js';
import { createResponse } from '../../utils/response/createResponse.js';
import CharacterData from './characterData.class.js';
import Position from './position.class.js';

// TODO: 완성
class User {
  constructor(id, nickname, socket) {
    // proto가 수정되었고, 따로 세션에서 해당 id를 발급해주는 식으로 처리, getUserByNickName 대신 getUserById를 사용 가능
    this.id = id;
    this.nickname = nickname;
    this.socket = socket;

    this.characterData = new CharacterData();

    this.position = new Position();
    this.lastUpdateTime = Date.now();
    this.roomId = null;
    this.maxHp = null;

    this.maxBbangCount = 0;
    this.damage = 1;
  }

  // getStateTargetUserId() {
  //   return this.characterData.stateInfo.stateTargetUserId;
  // }

  isAlive() {
    return this.characterData.alive;
  }

  equipWepon(weapon) {
    switch (weapon) {
      case Packets.CardType.HAND_GUN:
        this.characterData.bbangCount -= 1;
        this.maxBbangCount -= 1;
        break;
      case Packets.CardType.DESERT_EAGLE:
        this.damage = 2;
        break;
      case Packets.CardType.AUTO_RIFLE:
        this.characterData.bbangCount -= 10;
        this.maxBbangCount -= 10;
        break;
      case Packets.CardType.SNIPER_GUN:
        break;
    }
    this.setWeapon(weapon);
  }

  unequipWepon() {
    switch (this.characterData.weapon) {
      case Packets.CardType.HAND_GUN:
        this.characterData.bbangCount += 1;
        this.maxBbangCount += 1;
        break;
      case Packets.CardType.DESERT_EAGLE:
        this.damage = 1;
        break;
      case Packets.CardType.AUTO_RIFLE:
        this.characterData.bbangCount += 10;
        this.maxBbangCount += 10;
        break;
      case Packets.CardType.SNIPER_GUN:
        break;
    }
    this.setWeapon(0);
  }

  overHandedCount() {
    return this.characterData.handCardsCount - this.characterData.hp;
  }

  resetBbangCount() {
    this.characterData.bbangCount = this.maxBbangCount;
  }

  canUseBbang() {
    // true를 반환했을때 빵 가능
    return (
      0 >= this.characterData.bbangCount && this.characterData.bbangCount >= this.maxBbangCount
    );
  }

  setMaxBbangCount(count) {
    this.maxBbangCount = count;
  }

  updatePosition(x, y) {
    this.position.x = x;
    this.position.y = y;
  }

  getX() {
    return this.position.x;
  }

  getY() {
    return this.position.y;
  }

  setCharacterType(characterType) {
    this.characterData.characterType = characterType;
  }

  setCharacterRoleType(roleType) {
    this.characterData.roleType = roleType;
  }
  // 캐릭터 설정
  setCharacter(characterType) {
    switch (characterType) {
      case Packets.CharacterType.RED:
        this.characterData.characterType = characterType;
        this.characterData.bbangCount = -40;
        this.characterData.hp = 4;
        this.setMaxBbangCount(-40); // max치 빵야 횟수 설정
        break;
      case Packets.CharacterType.SHARK:
        this.characterData.characterType = characterType;
        this.characterData.bbangCount = 0;
        this.characterData.hp = 4;
        this.setMaxBbangCount(-1);
        break;
      case Packets.CharacterType.MALANG:
        this.characterData.characterType = characterType;
        this.characterData.bbangCount = 0;
        this.characterData.hp = 4;
        this.setMaxBbangCount(-1);
        break;
      case Packets.CharacterType.FROGGY:
        this.characterData.characterType = characterType;
        this.characterData.bbangCount = 0;
        this.characterData.hp = 4;
        this.setMaxBbangCount(-1);
        break;
      case Packets.CharacterType.PINK:
        this.characterData.characterType = characterType;
        this.characterData.bbangCount = 0;
        this.characterData.hp = 4;
        this.setMaxBbangCount(-1);
        break;
      // 물안경군 캐릭터 특성은 클라에서 처리
      case Packets.CharacterType.SWIM_GLASSES:
        this.characterData.characterType = characterType;
        this.characterData.bbangCount = 0;
        this.characterData.hp = 4;
        this.setMaxBbangCount(-1);
        break;
      case Packets.CharacterType.MASK:
        this.characterData.characterType = characterType;
        this.characterData.bbangCount = 0;
        this.characterData.hp = 4;
        this.setMaxBbangCount(-1);
        break;
      // 공룡이 캐릭터 특성은 클라에서 처리
      case Packets.CharacterType.DINOSAUR:
        this.characterData.characterType = characterType;
        this.characterData.bbangCount = 0;
        this.characterData.hp = 3;
        this.setMaxBbangCount(-1);
        break;
      case Packets.CharacterType.PINK_SLIME:
        this.characterData.characterType = characterType;
        this.characterData.bbangCount = 0;
        this.characterData.hp = 3;
        this.setMaxBbangCount(-1);
        break;
    }
  }

  setHp(hp) {
    this.characterData.hp = hp;
  }

  increaseHp() {
    if (this.characterData.hp >= this.maxHp) {
      return false;
    }

    this.characterData.hp += 1;
    return true;
  }

  decreaseHp(damage = 1) {
    console.log(`decreaseHp의 damage: ${damage}`);
    this.characterData.hp -= damage;
    if (this.characterData.hp < 0) {
      this.characterData.hp = 0;
    }
  }

  setWeapon(weapon) {
    this.characterData.weapon = weapon;
  }

  getCharacterState() {
    return this.characterData.stateInfo.state;
  }

  setCharacterStateType(characterStateType) {
    this.characterData.stateInfo.state = characterStateType;
  }

  setNextCharacterStateType(characterNextStateType) {
    this.characterData.stateInfo.nextState = characterNextStateType;
  }

  setNextStateAt(nextStateAt) {
    this.characterData.stateInfo.nextStateAt = nextStateAt;
  }

  setStateTargetUserId(stateTargetUserId) {
    this.characterData.stateInfo.stateTargetUserId = stateTargetUserId;
  }

  addEquip(equip) {
    if (this.characterData.equips.includes(equip) || this.characterData.equips.length >= 4) {
      return;
    }
    this.characterData.equips.push(equip);
  }

  addDebuff(debuff) {
    this.characterData.debuffs.push(debuff);
  }

  addHandCard(addCard) {
    const index = this.characterData.handCards.findIndex((card) => card.type === addCard);

    // { type: enum, count: 1} enum값이 handCards에 존재하면 count++
    // 존재하지 않으면 addHandCard({ type: newType, count: 1})
    if (index !== -1) {
      const cnt = this.characterData.handCards[index].count++;
    } else {
      const tmp = {
        type: addCard,
        count: 1,
      };
      this.characterData.handCards.push(tmp);
    }
    this.increaseHandCardsCount();
  }

  selectRandomHandCard() {
    const randomIndex = Math.floor(Math.random() * this.characterData.handCards.length);
    return this.characterData.handCards[randomIndex].type;
  }

  removeHandCard(usingCard) {
    const index = this.characterData.handCards.findIndex((card) => card.type === usingCard);

    // { type: enum, count: 1} enum값이 handCards에 존재하면 count++
    // 존재하지 않으면 addHandCard({ type: newType, count: 1})
    // count-- => count === 0 객체를 아예 삭제
    if (index !== -1) {
      const cnt = --this.characterData.handCards[index].count;
      this.decreaseHandCardsCount();
      if (cnt === 0) {
        // 남은 카드 없음
        this.characterData.handCards.splice(index, 1);
      }
    }
  }

  removeEquipCard(equip) {
    const index = this.characterData.equips.findIndex((card) => card === equip);

    if (index !== -1) {
      this.characterData.equips.splice(index, 1);
    }
  }

  removeDebuffCard(debuff) {
    const index = this.characterData.debuffs.findIndex((element) => element === debuff);
    if (index !== -1) {
      this.characterData.debuffs.splice(index, 1);
    }
  }

  hasShieldCard() {
    const shieldCard = this.characterData.handCards.find((card) => {
      return card.type === Packets.CardType.SHIELD;
    });

    return shieldCard ? true : false;
  }

  hasBbangCard() {
    const shieldCard = this.characterData.handCards.find((card) => {
      return card.type === Packets.CardType.BBANG;
    });

    return shieldCard ? true : false;
  }

  // 이거 안쓰지 않나
  userStateTimeout(state) {
    //nextStateAt
    const { inGameUsers, currentState, nextState, nextStateAt, targetUserId, time } = state;
    setTimeout(() => {
      this.characterData.stateInfo.state = currentState;
      this.characterData.stateInfo.nextState = nextState;
      this.characterData.stateInfo.nextStateAt = Date.now() + nextStateAt;
      this.characterData.stateInfo.stateTargetUserId = targetUserId;
      const userUpdateResponse = userUpdateNotification(inGameUsers); //updateUserData
      this.socket.write(
        createResponse(PACKET_TYPE.USER_UPDATE_NOTIFICATION, 0, userUpdateResponse),
      );
    }, time); // time초 뒤에 callback 실행
  }

  increaseBbangCount() {
    this.characterData.bbangCount += 1;
  }

  decreaseBbangCount() {
    this.characterData.bbangCount -= 1;
  }

  increaseHandCardsCount() {
    this.characterData.handCardsCount += 1;
  }

  decreaseHandCardsCount() {
    this.characterData.handCardsCount -= 1;
  }

  setCharacterState(state) {
    const { currentState, nextState, nextStateAt, targetUserId } = state;

    this.characterData.stateInfo.state = currentState;
    this.characterData.stateInfo.nextState = nextState;
    this.characterData.stateInfo.nextStateAt = nextStateAt;
    this.characterData.stateInfo.stateTargetUserId = targetUserId;
  }

  makeRawObject() {
    return {
      id: this.id,
      nickname: this.nickname,
      character: {
        characterType: this.characterData.characterType,
        roleType: this.characterData.roleType,
        hp: this.characterData.hp,
        weapon: this.characterData.weapon,
        alive: this.characterData.alive,
        stateInfo: {
          state: this.characterData.stateInfo.state,
          nextState: this.characterData.stateInfo.nextState,
          nextStateAt: this.characterData.stateInfo.nextStateAt,
          stateTargetUserId: this.characterData.stateInfo.stateTargetUserId,
        },
        equips: this.characterData.equips,
        debuffs: this.characterData.debuffs,
        handCards: this.characterData.handCards,
        bbangCount: this.characterData.bbangCount,
        handCardsCount: this.characterData.handCardsCount,
      },
    };
  }
}

export default User;
