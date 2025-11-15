'use client';
import { useRef } from 'react';
import * as THREE from 'three';
import PumpShaftModel from './PumpShaftModel';
import ImpellerKeyModel from './ImpellerKeyModel';
import StageBushingModel from './StageBushingModel';
import BalancingDrumBushModel from './BalancingDrumBushModel';
import { MechanicalSealCartridgeModel } from './MechanicalSealCartridgeModel';
import LockNutSpacerModel from './LockNutSpacerModel';

interface Group2InnerCartridgeModelProps {
  wireframe?: boolean;
}

export default function Group2InnerCartridgeModel({ wireframe = false }: Group2InnerCartridgeModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Spacing: 120mm between stages = 12 units (1 unit = 10mm)
  const stageSpacing = 12;

  // Positions along X-axis, starting at X=0 for PumpShaft
  const positions = [
    { component: 'PumpShaft', x: 0 },
    { component: 'StageBushing_1', x: 5 }, // After shaft start
    { component: 'ImpellerKey_1', x: 10 },
    { component: 'StageBushing_2', x: 15 },
    { component: 'ImpellerKey_2', x: stageSpacing * 1 + 10 },
    { component: 'StageBushing_3', x: stageSpacing * 1 + 15 },
    { component: 'ImpellerKey_3', x: stageSpacing * 2 + 10 },
    { component: 'BalancingDrumBush', x: stageSpacing * 3 },
    { component: 'MechanicalSealArea', x: stageSpacing * 3 + 10 },
    { component: 'LockNutSpacer', x: stageSpacing * 3 + 20 },
  ];

  return (
    <group ref={groupRef} name="Group2_InnerCartridge">
      {positions.map((pos, index) => {
        const x = pos.x;
        switch (pos.component) {
          case 'PumpShaft':
            return <group key={index} position={[x, 0, 0]}><PumpShaftModel wireframe={wireframe} /></group>;
          case 'StageBushing_1':
            return <group key={index} position={[x, 0, 0]}><StageBushingModel wireframe={wireframe} index={1} /></group>;
          case 'ImpellerKey_1':
            return <group key={index} position={[x, 0, 0]}><ImpellerKeyModel wireframe={wireframe} index={1} /></group>;
          case 'StageBushing_2':
            return <group key={index} position={[x, 0, 0]}><StageBushingModel wireframe={wireframe} index={2} /></group>;
          case 'ImpellerKey_2':
            return <group key={index} position={[x, 0, 0]}><ImpellerKeyModel wireframe={wireframe} index={2} /></group>;
          case 'StageBushing_3':
            return <group key={index} position={[x, 0, 0]}><StageBushingModel wireframe={wireframe} index={3} /></group>;
          case 'ImpellerKey_3':
            return <group key={index} position={[x, 0, 0]}><ImpellerKeyModel wireframe={wireframe} index={3} /></group>;
          case 'BalancingDrumBush':
            return <group key={index} position={[x, 0, 0]}><BalancingDrumBushModel wireframe={wireframe} /></group>;
          case 'MechanicalSealArea':
            return <group key={index} position={[x, 0, 0]}><MechanicalSealCartridgeModel wireframe={wireframe} /></group>;
          case 'LockNutSpacer':
            return <group key={index} position={[x, 0, 0]}><LockNutSpacerModel wireframe={wireframe} /></group>;
          default:
            return null;
        }
      })}
    </group>
  );
}
