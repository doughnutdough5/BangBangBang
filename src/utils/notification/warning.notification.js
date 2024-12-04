import { PACKET_TYPE } from '../../constants/header.js';
import { createResponse } from '../response/createResponse.js';

const warningNotification = (user, warningType, time) => {
  const responsePayload = {
    warningNotification: {
      warningType: warningType,
      expectedAt: time,
    },
  };

  user.socket.write(createResponse(PACKET_TYPE.WARNING_NOTIFICATION, 0, responsePayload));
};

export default warningNotification;