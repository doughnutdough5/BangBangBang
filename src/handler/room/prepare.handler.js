import { cardDeck } from '../../constants/cardDeck.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { Packets } from '../../init/loadProtos.js';
import { findGameById } from '../../sessions/game.session.js';
import { getUserBySocket } from '../../sessions/user.session.js';
import { gamePrepareNotification } from '../../utils/notification/gamePrepare.notification.js';
import { createResponse } from '../../utils/response/createResponse.js';
import shuffle from '../../utils/shuffle.js';

export const gamePrepareHandler = (socket, payload) => {
  try {
    const ownerUser = getUserBySocket(socket);
    // 방장 존재 여부
    if (!ownerUser) {
      const errorResponse = {
        gamePrepareResponse: {
          success: false,
          failCode: Packets.GlobalFailCode.NOT_ROOM_OWNER,
        },
      };
      socket.write(createResponse(PACKET_TYPE.GAME_PREPARE_RESPONSE, 0, errorResponse));
      return;
    }

    // 게임 존재 여부
    const currentGame = findGameById(ownerUser.roomId);
    if (!currentGame) {
      const errorResponse = {
        gamePrepareResponse: {
          success: false,
          failCode: Packets.GlobalFailCode.INVALID_ROOM_STATE,
        },
      };
      socket.write(createResponse(PACKET_TYPE.GAME_PREPARE_RESPONSE, 0, errorResponse));
      return;
    }

    currentGame.gameStart();

    const inGameUsers = currentGame.users;

    // 캐릭터 셔플
    const characterList = [
      { type: Packets.CharacterType.RED },
      { type: Packets.CharacterType.SHARK },
      { type: Packets.CharacterType.MALANG },
      { type: Packets.CharacterType.FROGGY },
      { type: Packets.CharacterType.PINK },
      { type: Packets.CharacterType.SWIM_GLASSES },
      { type: Packets.CharacterType.MASK },
      { type: Packets.CharacterType.DINOSAUR },
      { type: Packets.CharacterType.PINK_SLIME },
    ];

    const shuffledCharacter = shuffle(characterList).splice(0, inGameUsers.length);
    inGameUsers.forEach((user, i) => {
      user.setCharacter(shuffledCharacter[i].type);
    });

    // 1.RoleTypes[inGameUsers.length]
    // 2.셔플(RoleType)
    // 3.플레이어한테 부여 array.shift
    const roleTypes = {
      //타겟 - 보안관, 보디가드 - 부관, 히트맨 - 무법자, 싸이코패스 - 배신자
      2: [Packets.RoleType.TARGET, Packets.RoleType.HITMAN],
      3: [Packets.RoleType.TARGET, Packets.RoleType.HITMAN, Packets.RoleType.PSYCHOPATH],
      4: [
        Packets.RoleType.TARGET,
        Packets.RoleType.HITMAN,
        Packets.RoleType.HITMAN,
        Packets.RoleType.PSYCHOPATH,
      ],
      5: [
        Packets.RoleType.TARGET,
        Packets.RoleType.BODYGUARD,
        Packets.RoleType.HITMAN,
        Packets.RoleType.HITMAN,
        Packets.RoleType.PSYCHOPATH,
      ],
      6: [
        Packets.RoleType.TARGET,
        Packets.RoleType.BODYGUARD,
        Packets.RoleType.HITMAN,
        Packets.RoleType.HITMAN,
        Packets.RoleType.HITMAN,
        Packets.RoleType.PSYCHOPATH,
      ],
      7: [
        Packets.RoleType.TARGET,
        Packets.RoleType.BODYGUARD,
        Packets.RoleType.BODYGUARD,
        Packets.RoleType.HITMAN,
        Packets.RoleType.HITMAN,
        Packets.RoleType.HITMAN,
        Packets.RoleType.PSYCHOPATH,
      ],
    };

    // roleType 배분
    const roleTypeClone = roleTypes[inGameUsers.length];
    const shuffledRoleType = shuffle(roleTypeClone);
    inGameUsers.forEach((user, i) => {
      user.setCharacterRoleType(shuffledRoleType[i]);
      if (user.characterData.roleType === Packets.RoleType.TARGET) {
        user.increaseHp();
      }
    });

    const deck = shuffle(cardDeck);

    // 카드 배분
    inGameUsers.forEach((user) => {
      // 1. 임시로 사람별 덱 구성
      const tmp = [];

      for (let i = 0; i < user.characterData.hp; i++) {
        const card = deck.shift();
        tmp.push(card);
        user.addHandCard(card); // card === type
      }
      // 2. 한 번에 추가
      const result = transformData(tmp);
      user.characterData.handCards = result;
      // WARN: Test code
      // user.characterData.handCards = [
      // { type: Packets.CardType.BIG_BBANG, count: 2 },
      //   { type: Packets.CardType.ABSORB, count: 2 },
      // { type: Packets.CardType.HALLUCINATION, count: 2 },
      // { type: Packets.CardType.SHIELD, count: 2 },
      //   { type: Packets.CardType.FLEA_MARKET, count: 1 },
      //   { type: Packets.CardType.AUTO_RIFLE, count: 1 },
      //   { type: Packets.CardType.GUERRILLA, count: 1 },
      //   { type: Packets.CardType.CALL_119, count: 1 },
      //   { type: Packets.CardType.HAND_GUN, count: 1 },
      //   { type: Packets.CardType.DESERT_EAGLE, count: 1 },
      //   { type: Packets.CardType.LASER_POINTER, count: 1 },
      //   { type: Packets.CardType.RADAR, count: 1 },
      //   { type: Packets.CardType.AUTO_SHIELD, count: 1 },
      //   { type: Packets.CardType.CONTAINMENT_UNIT, count: 1 },
      //   { type: Packets.CardType.SATELLITE_TARGET, count: 1 },
      //   { type: Packets.CardType.BOMB, count: 1 },
      // ];
      // user.characterData.handCardsCount = 4;
    });

    // 유저들한테 손패 나눠주고 게임 객체에 덱 저장
    currentGame.deck = deck;

    // Notification에서 보내면 안되는 것: 본인이 아닌 handCards, target을 제외한 roleType
    // 카드 배분은 정상적으로 하고, 보내지만 않기
    // 방 유저에게 알림
    inGameUsers.forEach((user) => {
      user.maxHp = user.characterData.hp;
      const notificationPayload = gamePrepareNotification(currentGame, user);
      user.socket.write(
        createResponse(PACKET_TYPE.GAME_PREPARE_NOTIFICATION, 0, notificationPayload),
      );
    });

    const preparePayload = {
      gamePrepareResponse: {
        success: true,
        failCode: Packets.GlobalFailCode.NONE_FAILCODE,
      },
    };

    socket.write(createResponse(PACKET_TYPE.GAME_PREPARE_RESPONSE, 0, preparePayload));
  } catch (err) {
    console.error(err);
  }
};

const transformData = (data) => {
  const typeCountMap = new Map();

  // 각 타입의 개수를 Map에 집계
  data.forEach((type) => {
    if (typeCountMap.has(type)) {
      typeCountMap.set(type, typeCountMap.get(type) + 1);
    } else {
      typeCountMap.set(type, 1);
    }
  });

  // Map 데이터를 { type, count } 형태의 객체 배열로 변환
  const result = Array.from(typeCountMap, ([type, count]) => ({ type, count }));

  return result;
};