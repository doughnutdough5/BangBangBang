import { PACKET_TYPE } from '../../constants/header.js';
import { createResponse } from '../response/createResponse.js';

export const fleaMarketNotification = (cardTypes, pickIndex, currentGameUsers) => {
  const responsePayload = {
    fleaMarketNotification: {
      cardTypes: cardTypes,
      pickIndex: pickIndex,
    },
  };

  currentGameUsers.forEach((user) => {
    user.socket.write(createResponse(PACKET_TYPE.FLEA_MARKET_NOTIFICATION, 0, responsePayload));
  });
};
