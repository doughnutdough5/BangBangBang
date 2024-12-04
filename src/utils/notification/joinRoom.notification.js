export const joinRoomNotification = (user) => {
    const responsePayload = {
        joinRoomNotification: {
            joinUser: {
                id: user.id,
                nickname: user.nickname,
                character: user.characterData
            },
        }
    };

    return responsePayload;
}