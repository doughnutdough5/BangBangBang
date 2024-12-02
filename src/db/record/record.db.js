import pools from '../database.js';
import { SQL_QUERIES } from './record.queries.js';

export const saveRecord = async (userId, isWin, roleType) => {
  await pools.USER_DB.query(SQL_QUERIES.SAVE_RECORD, [userId, isWin, roleType]);
};
