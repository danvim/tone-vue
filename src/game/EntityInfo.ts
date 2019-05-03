import LocRot from '@/game/LocRot';

export default interface EntityInfo {
  model: string;
  playerId: number;
  locRot: LocRot;
  nextLocRot: LocRot;
}
