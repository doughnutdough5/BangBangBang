import { bbangCardHandler } from './normal/bbangCard.handler.js';
import { bigBbangCardHandler } from './normal/bigBbangCard.handler.js';
import { call119CardHandler } from './normal/call119Card.handler.js';
import { guerrillaCardHandler } from './normal/guerrillaCard.handler.js';
import { maturedSavingsCardHandler } from './normal/maturedSavingsCard.handler.js';
import { shieldCardHandler } from './normal/shieldCard.handler.js';
import { vaccineCardHandler } from './normal/vaccineCard.handler.js';
import { winLotteryCardHandler } from './normal/winLotteryCard.handler.js';
import { deathMatchCardHandler } from './normal/deathMatchCard.handler.js';
import { hallucinationCardHandler } from './normal/hallucinationCard.handler.js';
import { fleaMarketCardHandler } from './normal/fleaMarketCard.handler.js';
import { absorbCardHandler } from './normal/absorbCard.handler.js';
import { containmentUnitCardHandler } from './debuffs/containmentUnitCard.handler.js';
import { bombCardHandler } from './debuffs/bombCard.handler.js';
import { satelliteTargetCardHandler } from './debuffs/satelliteTargetCard.handler.js';
import { handGunCardHandler } from './weapons/handGunCard.handler.js';
import { desertEagleCardHandler } from './weapons/desertEagleCard.handler.js';
import { autoRifleCardHandler } from './weapons/autoRifleCard.handler.js';
import { sniperGunCardHandler } from './weapons/sniperGunCard.handler.js';
import { laserPointerHandler } from './equips/laserPointer.handler.js';
import { radarHandler } from './equips/radarCard.handler.js';
import { autoShieldHandler } from './equips/autoShieldCard.handler.js';
import { stealthSuitHandler } from './equips/stealthSuitCard.handler.js';

const cardHandlers = {
  // BBANG 1
  [1]: bbangCardHandler,
  // BIG_BBANG 2
  [2]: bigBbangCardHandler,
  // SHIELD 3
  [3]: shieldCardHandler,
  // VACCINE 4
  [4]: vaccineCardHandler,
  // CALL_119 5
  [5]: call119CardHandler,
  // DEATH_MATCH 6
  [6]: deathMatchCardHandler,
  // GUERRILLA 7
  [7]: guerrillaCardHandler,
  // ABSORB 8
  [8]: absorbCardHandler,
  // HALLUCINATION 9
  [9]: hallucinationCardHandler,
  // FLEA_MARKET 10
  [10]: fleaMarketCardHandler,
  // MATURED_SAVINGS 11
  [11]: maturedSavingsCardHandler,
  // WIN_LOTTERY 12
  [12]: winLotteryCardHandler,
  // SNIPER_GUN 13
  [13]: sniperGunCardHandler,
  // HAND_GUN 14
  [14]: handGunCardHandler,
  // DESERT_EAGLE 15
  [15]: desertEagleCardHandler,
  // AUTO_RIFLE 16
  [16]: autoRifleCardHandler,
  // LASER_POINTER 17
  [17]: laserPointerHandler,
  // RADAR 18
  [18]: radarHandler,
  // AUTO_SHIELD 19
  [19]: autoShieldHandler,
  // STEALTH_SUIT 20
  [20]: stealthSuitHandler,
  // CONTAINMENT_UNIT 21
  [21]: containmentUnitCardHandler,
  // SATELLITE_TARGET 22
  [22]: satelliteTargetCardHandler,
  // BOMB 23
  [23]: bombCardHandler,
};

const getCardHandlerByCardType = (useCardType) => cardHandlers[useCardType];

export default getCardHandlerByCardType;
