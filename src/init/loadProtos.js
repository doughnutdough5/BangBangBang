import path from 'path';
import protobuf from 'protobufjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const protoPath = path.resolve(__dirname, '../protobuf/game.proto');

// TODO: 이거 객체로 관리하게 리팩토링
export const Packets = {};

export const loadProto = async () => {
  try {
    const root = await protobuf.load(protoPath);
    Packets.GamePacket = root.lookupType('GamePacket');

    Packets.GlobalFailCode = root.lookupEnum('GlobalFailCode').values
    Packets.WarningType = root.lookupEnum('WarningType').values;
    Packets.WinType = root.lookupEnum('WinType').values;
    Packets.CharacterType = root.lookupEnum('CharacterType').values;
    Packets.CharacterStateType = root.lookupEnum('CharacterStateType').values;
    Packets.CardType = root.lookupEnum('CardType').values;
    Packets.RoleType = root.lookupEnum('RoleType').values;
    Packets.RoomStateType = root.lookupEnum('RoomStateType').values;
    Packets.PhaseType = root.lookupEnum('PhaseType').values;
    Packets.ReactionType = root.lookupEnum('ReactionType').values;
    Packets.SelectCardType = root.lookupEnum('SelectCardType').values;
    Packets.AnimationType = root.lookupEnum('AnimationType').values;
  } catch (err) {
    console.error(`proto 파일 로드 중 오류 발생: ${err}`);
    process.exit(1);
  }
};

// const protoMessages = {};

// export const loadProtos = async () => {
//   try {
//     const root = new protobuf.Root();

//     await Promise.all(protoFiles.map((file) => root.load(file)));

//     for (const [namespace, types] of Object.entries(packetNames)) {
//       protoMessages[namespace] = {};
//       for (const [type, typeName] of Object.entries(types)) {
//         protoMessages[namespace][type] = root.lookupType(typeName);
//       }
//     }

//     console.log('Protobuf 파일이 로드되었습니다.');
//   } catch (error) {
//     console.error('Protobuf 파일 로드 중 오류가 발생했습니다:', error);
//   }
// };