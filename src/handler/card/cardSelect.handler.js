import { getStateNormal } from '../../constants/stateType.js';
import { PACKET_TYPE } from "../../constants/header.js"
import { characterPositions } from "../../init/loadPositions.js"
import { Packets } from "../../init/loadProtos.js"
import { findGameById } from "../../sessions/game.session.js"
import { getUserBySocket } from "../../sessions/user.session.js"
import { gameStartNotification } from "../../utils/notification/gameStart.notification.js"
import { createResponse } from "../../utils/response/createResponse.js"
import userUpdateNotification from "../../utils/notification/userUpdate.notification.js"

export const cardSelectHandler = (socket, payload) => {
    // socket으로 들어온 유저는 흡수 또는 신기루 카드를 쓴 유저
    // payload.cardSelectRequest.selectType은 흡수 또는 신기루를 "당한" 유저의 카드 위치(화살표 부분)
    // payload.cardSelectRequest.selectCardType은 흡수 또는 신기루로 날아온 카드 선택 리퀘스트에 담긴 카드
    // 이를 socket으로 들어온 유저의 손패에 넣어주거나 파괴하면 될 듯?
    // 그 전에 흡수 또는 신기루를 "당한" 유저의 해당 위치에 있는 카드를 먼저 제거
    const cardSelectUser = getUserBySocket(socket);
    const currentGame = findGameById(cardSelectUser.roomId);
    const targetUser = currentGame.findInGameUserByState(Packets.CharacterStateType.ABSORB_TARGET);
    console.log("타켓 유저 불러오기 성공: " + targetUser.id);
    console.log(payload.cardSelectRequest.selectType);
    const selectType = payload.cardSelectRequest.selectType;
    const absorbedCard = payload.cardSelectRequest.selectCardType;

    console.log('흡수 대상 유저의 흡수 전 장착된 무기 상태: ' + targetUser.characterData.weapon);
    if (selectType === Packets.SelectCardType.WEAPON) {
        targetUser.unequipWepon(); // <-- 클라에서는 장착된 상태로 표시됨(기능도 작동됨)
        cardSelectUser.addHandCard(absorbedCard);
    } else if (selectType === Packets.SelectCardType.EQUIP) {
        targetUser.removeEquipCard(absorbedCard);
        cardSelectUser.addHandCard(absorbedCard);
    } else if (selectType === Packets.SelectCardType.DEBUFF) {
        targetUser.removeDebuffCard(absorbedCard);
        cardSelectUser.addHandCard(absorbedCard);
    } else {
        const randomHandCard = targetUser.selectRandomHandCard();
        console.log(randomHandCard);
        targetUser.removeHandCard(randomHandCard);
        cardSelectUser.addHandCard(randomHandCard);
    };

    cardSelectUser.setCharacterState(getStateNormal());
    targetUser.setCharacterState(getStateNormal());
    userUpdateNotification(currentGame.users)
    console.log('흡수 대상 유저의 장착된 무기 상태: ' + targetUser.characterData.weapon);
    // useCardNotification

    const responsePayload = {
        cardSelectResponse: {
            success: true,
            failCode: Packets.GlobalFailCode.NONE_FAILCODE
        }
    }

    socket.write(createResponse(PACKET_TYPE.CARD_SELECT_RESPONSE, 0, responsePayload))
};


/**
 * 마지막 순서
 * 플리마켓과 흡수, 신기루, 
 * message C2SCardSelectRequest {
    SelectCardType selectType = 1; // 0: 핸드, 1: 장비, 2: 무기, 3: 디버프 (<--)
    CardType selectCardType = 2; // selectType이  0일 경우 0, / 1, 2, 3일 경우 원하는 장비의 cardType
} => selectType 0 (핸드)

 * PACKET_TYPE.CARD_SELECT_REQUEST

 * message S2CCardSelectResponse {
    bool success = 1;
    GlobalFailCode failCode = 2;
}
 *   C2SCardSelectRequest cardSelectRequest = 40;
        S2CCardSelectResponse cardSelectResponse = 41;
 * 
 * enum SelectCardType {
    HAND = 0;
    EQUIP = 1;
    WEAPON = 2;
    DEBUFF = 3;
}
 */