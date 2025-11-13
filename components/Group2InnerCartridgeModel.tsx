'use client';
import { useRef } from 'react';
import * as THREE from 'three';
import PumpShaftModel from './PumpShaftModel';
import ImpellerKeyModel from './ImpellerKeyModel';
import ShaftSleeveSealModel from './ShaftSleeveSealModel';
import Impeller1stStageModel from './Impeller1stStageModel';
import ImpellerNStageModel from './ImpellerNStageModel';
import SuctionGuideModel from './SuctionGuideModel';
import DiffuserModel from './DiffuserModel';
import StageCasingModel from './StageCasingModel';
import WearRingImpellerModel from './WearRingImpellerModel';
import WearRingCasingModel from './WearRingCasingModel';
import ShaftSleeveInterstageModel from './ShaftSleeveInterstageModel';

interface Group2InnerCartridgeModelProps {
  wireframe?: boolean;
}

export default function Group2InnerCartridgeModel({ wireframe = false }: Group2InnerCartridgeModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Spacing: 0.01mm = 0.001 unit (1 unit = 10mm)
  const spacing = 0.001;

  // Positions along X-axis, starting at X=0 for PumpShaft
  const positions = [
    { component: 'PumpShaft', x: 0 },
    { component: 'ImpellerKey_1', x: spacing * 1 },
    { component: 'ShaftSleeve_Seal_1', x: spacing * 2 },
    { component: 'Impeller_1stStage', x: spacing * 3 },
    { component: 'WearRing_Impeller_1', x: spacing * 4 },
    { component: 'WearRing_Casing_1', x: spacing * 5 },
    { component: 'SuctionGuide', x: spacing * 6 },
    { component: 'Diffuser_1', x: spacing * 7 },
    { component: 'StageCasing_1', x: spacing * 8 },
    { component: 'ImpellerKey_2', x: spacing * 9 },
    { component: 'ShaftSleeve_Interstage_1', x: spacing * 10 },
    { component: 'Impeller_NStage_1', x: spacing * 11 },
    { component: 'WearRing_Impeller_2', x: spacing * 12 },
    { component: 'WearRing_Casing_2', x: spacing * 13 },
    { component: 'Diffuser_2', x: spacing * 14 },
    { component: 'StageCasing_2', x: spacing * 15 },
    { component: 'ImpellerKey_3', x: spacing * 16 },
    { component: 'ShaftSleeve_Interstage_2', x: spacing * 17 },
    { component: 'Impeller_NStage_2', x: spacing * 18 },
    { component: 'WearRing_Impeller_3', x: spacing * 19 },
    { component: 'WearRing_Casing_3', x: spacing * 20 },
    { component: 'Diffuser_3', x: spacing * 21 },
    { component: 'StageCasing_3', x: spacing * 22 },
    { component: 'ImpellerKey_4', x: spacing * 23 },
    { component: 'ShaftSleeve_Interstage_3', x: spacing * 24 },
    { component: 'Impeller_NStage_3', x: spacing * 25 },
    { component: 'WearRing_Impeller_4', x: spacing * 26 },
    { component: 'WearRing_Casing_4', x: spacing * 27 },
    { component: 'Diffuser_4', x: spacing * 28 },
    { component: 'StageCasing_4', x: spacing * 29 },
    { component: 'ImpellerKey_5', x: spacing * 30 },
    { component: 'ShaftSleeve_Interstage_4', x: spacing * 31 },
    { component: 'Impeller_NStage_4', x: spacing * 32 },
    { component: 'WearRing_Impeller_5', x: spacing * 33 },
    { component: 'WearRing_Casing_5', x: spacing * 34 },
    { component: 'Diffuser_5', x: spacing * 35 },
    { component: 'StageCasing_5', x: spacing * 36 },
    { component: 'ImpellerKey_6', x: spacing * 37 },
    { component: 'ShaftSleeve_Interstage_5', x: spacing * 38 },
    { component: 'Impeller_NStage_5', x: spacing * 39 },
    { component: 'WearRing_Impeller_6', x: spacing * 40 },
    { component: 'WearRing_Casing_6', x: spacing * 41 },
    { component: 'Diffuser_6', x: spacing * 42 },
    { component: 'StageCasing_6', x: spacing * 43 },
    { component: 'ImpellerKey_7', x: spacing * 44 },
    { component: 'ShaftSleeve_Interstage_6', x: spacing * 45 },
    { component: 'Impeller_NStage_6', x: spacing * 46 },
    { component: 'WearRing_Impeller_7', x: spacing * 47 },
    { component: 'WearRing_Casing_7', x: spacing * 48 },
    { component: 'Diffuser_7', x: spacing * 49 },
    { component: 'StageCasing_7', x: spacing * 50 },
    { component: 'ImpellerKey_8', x: spacing * 51 },
    { component: 'ShaftSleeve_Interstage_7', x: spacing * 52 },
    { component: 'Impeller_NStage_7', x: spacing * 53 },
    { component: 'WearRing_Impeller_8', x: spacing * 54 },
    { component: 'WearRing_Casing_8', x: spacing * 55 },
    { component: 'Diffuser_8', x: spacing * 56 },
    { component: 'StageCasing_8', x: spacing * 57 },
    { component: 'WearRing_Impeller_9', x: spacing * 58 },
    { component: 'WearRing_Impeller_10', x: spacing * 59 },
    { component: 'WearRing_Impeller_11', x: spacing * 60 },
    { component: 'WearRing_Impeller_12', x: spacing * 61 },
    { component: 'WearRing_Impeller_13', x: spacing * 62 },
    { component: 'WearRing_Impeller_14', x: spacing * 63 },
    { component: 'WearRing_Impeller_15', x: spacing * 64 },
    { component: 'WearRing_Impeller_16', x: spacing * 65 },
    { component: 'ShaftSleeve_Seal_2', x: spacing * 66 },
  ];

  return (
    <group ref={groupRef} name="Group2_InnerCartridge">
      {positions.map((pos, index) => {
        const x = pos.x;
        switch (pos.component) {
          case 'PumpShaft':
            return <group key={index} position={[x, 0, 0]}><PumpShaftModel wireframe={wireframe} /></group>;
          case 'ImpellerKey_1':
            return <group key={index} position={[x, 0, 0]}><ImpellerKeyModel wireframe={wireframe} index={1} /></group>;
          case 'ShaftSleeve_Seal_1':
            return <group key={index} position={[x, 0, 0]}><ShaftSleeveSealModel wireframe={wireframe} index={1} /></group>;
          case 'Impeller_1stStage':
            return <group key={index} position={[x, 0, 0]}><Impeller1stStageModel wireframe={wireframe} /></group>;
          case 'WearRing_Impeller_1':
            return <group key={index} position={[x, 0, 0]}><WearRingImpellerModel wireframe={wireframe} index={1} /></group>;
          case 'WearRing_Casing_1':
            return <group key={index} position={[x, 0, 0]}><WearRingCasingModel wireframe={wireframe} index={1} /></group>;
          case 'SuctionGuide':
            return <group key={index} position={[x, 0, 0]}><SuctionGuideModel wireframe={wireframe} /></group>;
          case 'Diffuser_1':
            return <group key={index} position={[x, 0, 0]}><DiffuserModel wireframe={wireframe} stage={1} /></group>;
          case 'StageCasing_1':
            return <group key={index} position={[x, 0, 0]}><StageCasingModel wireframe={wireframe} stage={1} /></group>;
          case 'ImpellerKey_2':
            return <group key={index} position={[x, 0, 0]}><ImpellerKeyModel wireframe={wireframe} index={2} /></group>;
          case 'ShaftSleeve_Interstage_1':
            return <group key={index} position={[x, 0, 0]}><ShaftSleeveInterstageModel wireframe={wireframe} index={1} /></group>;
          case 'Impeller_NStage_1':
            return <group key={index} position={[x, 0, 0]}><ImpellerNStageModel wireframe={wireframe} stage={1} /></group>;
          case 'WearRing_Impeller_2':
            return <group key={index} position={[x, 0, 0]}><WearRingImpellerModel wireframe={wireframe} index={2} /></group>;
          case 'WearRing_Casing_2':
            return <group key={index} position={[x, 0, 0]}><WearRingCasingModel wireframe={wireframe} index={2} /></group>;
          case 'Diffuser_2':
            return <group key={index} position={[x, 0, 0]}><DiffuserModel wireframe={wireframe} stage={2} /></group>;
          case 'StageCasing_2':
            return <group key={index} position={[x, 0, 0]}><StageCasingModel wireframe={wireframe} stage={2} /></group>;
          case 'ImpellerKey_3':
            return <group key={index} position={[x, 0, 0]}><ImpellerKeyModel wireframe={wireframe} index={3} /></group>;
          case 'ShaftSleeve_Interstage_2':
            return <group key={index} position={[x, 0, 0]}><ShaftSleeveInterstageModel wireframe={wireframe} index={2} /></group>;
          case 'Impeller_NStage_2':
            return <group key={index} position={[x, 0, 0]}><ImpellerNStageModel wireframe={wireframe} stage={2} /></group>;
          case 'WearRing_Impeller_3':
            return <group key={index} position={[x, 0, 0]}><WearRingImpellerModel wireframe={wireframe} index={3} /></group>;
          case 'WearRing_Casing_3':
            return <group key={index} position={[x, 0, 0]}><WearRingCasingModel wireframe={wireframe} index={3} /></group>;
          case 'Diffuser_3':
            return <group key={index} position={[x, 0, 0]}><DiffuserModel wireframe={wireframe} stage={3} /></group>;
          case 'StageCasing_3':
            return <group key={index} position={[x, 0, 0]}><StageCasingModel wireframe={wireframe} stage={3} /></group>;
          case 'ImpellerKey_4':
            return <group key={index} position={[x, 0, 0]}><ImpellerKeyModel wireframe={wireframe} index={4} /></group>;
          case 'ShaftSleeve_Interstage_3':
            return <group key={index} position={[x, 0, 0]}><ShaftSleeveInterstageModel wireframe={wireframe} index={3} /></group>;
          case 'Impeller_NStage_3':
            return <group key={index} position={[x, 0, 0]}><ImpellerNStageModel wireframe={wireframe} stage={3} /></group>;
          case 'WearRing_Impeller_4':
            return <group key={index} position={[x, 0, 0]}><WearRingImpellerModel wireframe={wireframe} index={4} /></group>;
          case 'WearRing_Casing_4':
            return <group key={index} position={[x, 0, 0]}><WearRingCasingModel wireframe={wireframe} index={4} /></group>;
          case 'Diffuser_4':
            return <group key={index} position={[x, 0, 0]}><DiffuserModel wireframe={wireframe} stage={4} /></group>;
          case 'StageCasing_4':
            return <group key={index} position={[x, 0, 0]}><StageCasingModel wireframe={wireframe} stage={4} /></group>;
          case 'ImpellerKey_5':
            return <group key={index} position={[x, 0, 0]}><ImpellerKeyModel wireframe={wireframe} index={5} /></group>;
          case 'ShaftSleeve_Interstage_4':
            return <group key={index} position={[x, 0, 0]}><ShaftSleeveInterstageModel wireframe={wireframe} index={4} /></group>;
          case 'Impeller_NStage_4':
            return <group key={index} position={[x, 0, 0]}><ImpellerNStageModel wireframe={wireframe} stage={4} /></group>;
          case 'WearRing_Impeller_5':
            return <group key={index} position={[x, 0, 0]}><WearRingImpellerModel wireframe={wireframe} index={5} /></group>;
          case 'WearRing_Casing_5':
            return <group key={index} position={[x, 0, 0]}><WearRingCasingModel wireframe={wireframe} index={5} /></group>;
          case 'Diffuser_5':
            return <group key={index} position={[x, 0, 0]}><DiffuserModel wireframe={wireframe} stage={5} /></group>;
          case 'StageCasing_5':
            return <group key={index} position={[x, 0, 0]}><StageCasingModel wireframe={wireframe} stage={5} /></group>;
          case 'ImpellerKey_6':
            return <group key={index} position={[x, 0, 0]}><ImpellerKeyModel wireframe={wireframe} index={6} /></group>;
          case 'ShaftSleeve_Interstage_5':
            return <group key={index} position={[x, 0, 0]}><ShaftSleeveInterstageModel wireframe={wireframe} index={5} /></group>;
          case 'Impeller_NStage_5':
            return <group key={index} position={[x, 0, 0]}><ImpellerNStageModel wireframe={wireframe} stage={5} /></group>;
          case 'WearRing_Impeller_6':
            return <group key={index} position={[x, 0, 0]}><WearRingImpellerModel wireframe={wireframe} index={6} /></group>;
          case 'WearRing_Casing_6':
            return <group key={index} position={[x, 0, 0]}><WearRingCasingModel wireframe={wireframe} index={6} /></group>;
          case 'Diffuser_6':
            return <group key={index} position={[x, 0, 0]}><DiffuserModel wireframe={wireframe} stage={6} /></group>;
          case 'StageCasing_6':
            return <group key={index} position={[x, 0, 0]}><StageCasingModel wireframe={wireframe} stage={6} /></group>;
          case 'ImpellerKey_7':
            return <group key={index} position={[x, 0, 0]}><ImpellerKeyModel wireframe={wireframe} index={7} /></group>;
          case 'ShaftSleeve_Interstage_6':
            return <group key={index} position={[x, 0, 0]}><ShaftSleeveInterstageModel wireframe={wireframe} index={6} /></group>;
          case 'Impeller_NStage_6':
            return <group key={index} position={[x, 0, 0]}><ImpellerNStageModel wireframe={wireframe} stage={6} /></group>;
          case 'WearRing_Impeller_7':
            return <group key={index} position={[x, 0, 0]}><WearRingImpellerModel wireframe={wireframe} index={7} /></group>;
          case 'WearRing_Casing_7':
            return <group key={index} position={[x, 0, 0]}><WearRingCasingModel wireframe={wireframe} index={7} /></group>;
          case 'Diffuser_7':
            return <group key={index} position={[x, 0, 0]}><DiffuserModel wireframe={wireframe} stage={7} /></group>;
          case 'StageCasing_7':
            return <group key={index} position={[x, 0, 0]}><StageCasingModel wireframe={wireframe} stage={7} /></group>;
          case 'ImpellerKey_8':
            return <group key={index} position={[x, 0, 0]}><ImpellerKeyModel wireframe={wireframe} index={8} /></group>;
          case 'ShaftSleeve_Interstage_7':
            return <group key={index} position={[x, 0, 0]}><ShaftSleeveInterstageModel wireframe={wireframe} index={7} /></group>;
          case 'Impeller_NStage_7':
            return <group key={index} position={[x, 0, 0]}><ImpellerNStageModel wireframe={wireframe} stage={7} /></group>;
          case 'WearRing_Impeller_8':
            return <group key={index} position={[x, 0, 0]}><WearRingImpellerModel wireframe={wireframe} index={8} /></group>;
          case 'WearRing_Casing_8':
            return <group key={index} position={[x, 0, 0]}><WearRingCasingModel wireframe={wireframe} index={8} /></group>;
          case 'Diffuser_8':
            return <group key={index} position={[x, 0, 0]}><DiffuserModel wireframe={wireframe} stage={8} /></group>;
          case 'StageCasing_8':
            return <group key={index} position={[x, 0, 0]}><StageCasingModel wireframe={wireframe} stage={8} /></group>;
          case 'WearRing_Impeller_9':
            return <group key={index} position={[x, 0, 0]}><WearRingImpellerModel wireframe={wireframe} index={9} /></group>;
          case 'WearRing_Impeller_10':
            return <group key={index} position={[x, 0, 0]}><WearRingImpellerModel wireframe={wireframe} index={10} /></group>;
          case 'WearRing_Impeller_11':
            return <group key={index} position={[x, 0, 0]}><WearRingImpellerModel wireframe={wireframe} index={11} /></group>;
          case 'WearRing_Impeller_12':
            return <group key={index} position={[x, 0, 0]}><WearRingImpellerModel wireframe={wireframe} index={12} /></group>;
          case 'WearRing_Impeller_13':
            return <group key={index} position={[x, 0, 0]}><WearRingImpellerModel wireframe={wireframe} index={13} /></group>;
          case 'WearRing_Impeller_14':
            return <group key={index} position={[x, 0, 0]}><WearRingImpellerModel wireframe={wireframe} index={14} /></group>;
          case 'WearRing_Impeller_15':
            return <group key={index} position={[x, 0, 0]}><WearRingImpellerModel wireframe={wireframe} index={15} /></group>;
          case 'WearRing_Impeller_16':
            return <group key={index} position={[x, 0, 0]}><WearRingImpellerModel wireframe={wireframe} index={16} /></group>;
          case 'ShaftSleeve_Seal_2':
            return <group key={index} position={[x, 0, 0]}><ShaftSleeveSealModel wireframe={wireframe} index={2} /></group>;
          default:
            return null;
        }
      })}
    </group>
  );
}
