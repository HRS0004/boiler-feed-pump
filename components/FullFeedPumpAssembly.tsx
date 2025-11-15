'use client';
import { useRef } from 'react';
import * as THREE from 'three';
import SuctionGuideModel from './SuctionGuideModel';

import DiffuserModel from './DiffuserModel';
import Impeller1stStageModel from './Impeller1stStageModel';
import ImpellerNStageModel from './ImpellerNStageModel';
import PumpShaftModel from './PumpShaftModel';
import ShaftSleeveSealModel from './ShaftSleeveSealModel';
import ShaftSleeveInterstageModel from './ShaftSleeveInterstageModel';
import { MechanicalSealCartridgeModel } from './MechanicalSealCartridgeModel';
import BaseplateSkidModel from './BaseplateSkidModel';
import CouplingGuardModel from './CouplingGuardModel';
import WearRingImpellerModel from './WearRingImpellerModel';
import WearRingCasingModel from './WearRingCasingModel';
import DischargeCoverModel from './DischargeCoverModel';
import ImpellerKeyModel from './ImpellerKeyModel';
import GlandStudsAndNutsModel from './GlandStudsAndNutsModel';
import NutsAndBoltsModel from './NutsAndBoltsModel';

interface FullFeedPumpAssemblyProps {
  wireframe?: boolean;
  exploded?: boolean;
}

export default function FullFeedPumpAssembly({ wireframe = false, exploded = false }: FullFeedPumpAssemblyProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Scaling: 1 unit = 10mm
  const stageSpacing = 4; // 40mm per stage
  const suctionPos = 0;
  const dischargePos = 8 * stageSpacing; // 320mm
  const explodedOffset = exploded ? 2 : 0; // 20mm offset for exploded view

  // Positions along X-axis
  const positions = {
    suction: suctionPos,
    stages: Array.from({ length: 8 }, (_, i) => suctionPos + (i + 0.5) * stageSpacing + i * explodedOffset),
    discharge: dischargePos + explodedOffset,
    shaft: 0,
    baseplate: 0,
    couplingGuard: dischargePos + 10 + explodedOffset, // After discharge
  };

  return (
    <group ref={groupRef} name="FullFeedPumpAssembly">
      {/* Baseplate */}
      <group position={[positions.baseplate, -5, 0]} name="Baseplate">
        <BaseplateSkidModel wireframe={wireframe} />
      </group>

      {/* Suction Casing */}
      <group position={[positions.suction, 0, 0]} name="SuctionCasing">
        <SuctionGuideModel wireframe={wireframe} />
      </group>



      {/* Discharge Casing */}
      <group position={[positions.discharge, 0, 0]} name="DischargeCasing">
        <DischargeCoverModel wireframe={wireframe} />
      </group>

      {/* Diffusers (8) */}
      {Array.from({ length: 8 }, (_, i) => (
        <group key={`Diffuser_${i + 1}`} position={[positions.stages[i], 0, 0]} name={`Diffuser_${i + 1}`}>
          <DiffuserModel wireframe={wireframe} stage={i + 1} />
        </group>
      ))}

      {/* Impellers (8) */}
      <group position={[positions.stages[0], 0, 0]} name="Impeller_1stStage">
        <Impeller1stStageModel wireframe={wireframe} />
      </group>
      {Array.from({ length: 7 }, (_, i) => (
        <group key={`Impeller_NStage_${i + 1}`} position={[positions.stages[i + 1], 0, 0]} name={`Impeller_NStage_${i + 1}`}>
          <ImpellerNStageModel wireframe={wireframe} stage={i + 1} />
        </group>
      ))}

      {/* Main Shaft */}
      <group position={[positions.shaft, 0, 0]} name="PumpShaft">
        <PumpShaftModel wireframe={wireframe} />
      </group>

      {/* Shaft Sleeves - Seal (2) */}
      <group position={[positions.suction - 2, 0, 0]} name="ShaftSleeve_Seal_1">
        <ShaftSleeveSealModel wireframe={wireframe} index={1} />
      </group>
      <group position={[positions.discharge + 2, 0, 0]} name="ShaftSleeve_Seal_2">
        <ShaftSleeveSealModel wireframe={wireframe} index={2} />
      </group>

      {/* Shaft Sleeves - Interstage (7) */}
      {Array.from({ length: 7 }, (_, i) => (
        <group key={`ShaftSleeve_Interstage_${i + 1}`} position={[positions.stages[i] + 2, 0, 0]} name={`ShaftSleeve_Interstage_${i + 1}`}>
          <ShaftSleeveInterstageModel wireframe={wireframe} index={i + 1} />
        </group>
      ))}

      {/* Mechanical Seal */}
      <group position={[positions.suction - 5, 0, 0]} name="MechanicalSeal">
        <MechanicalSealCartridgeModel wireframe={wireframe} />
      </group>

      {/* Bearing Housings - Simplified as cylinders */}
      <group position={[positions.suction - 10, 0, 0]} name="BearingHousing_DE">
        <mesh material={new THREE.MeshStandardMaterial({ color: 0x666666, metalness: 0.5, roughness: 0.5, wireframe })}>
          <cylinderGeometry args={[2, 2, 3, 32]} />
        </mesh>
      </group>
      <group position={[positions.discharge + 10, 0, 0]} name="BearingHousing_NDE">
        <mesh material={new THREE.MeshStandardMaterial({ color: 0x666666, metalness: 0.5, roughness: 0.5, wireframe })}>
          <cylinderGeometry args={[2, 2, 3, 32]} />
        </mesh>
      </group>

      {/* Coupling - Simplified */}
      <group position={[positions.discharge + 5, 0, 0]} name="Coupling">
        <mesh material={new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8, roughness: 0.2, wireframe })}>
          <cylinderGeometry args={[1.5, 1.5, 2, 32]} />
        </mesh>
      </group>

      {/* Coupling Guard */}
      <group position={[positions.couplingGuard, 0, 0]} name="CouplingGuard">
        <CouplingGuardModel wireframe={wireframe} />
      </group>

      {/* Wear Rings - Impeller (16, 2 per stage) */}
      {Array.from({ length: 16 }, (_, i) => (
        <group key={`WearRing_Impeller_${i + 1}`} position={[positions.stages[Math.floor(i / 2)] + (i % 2 - 0.5) * 0.5, 0, 0]} name={`WearRing_Impeller_${i + 1}`}>
          <WearRingImpellerModel wireframe={wireframe} index={i + 1} />
        </group>
      ))}

      {/* Wear Rings - Casing (8) */}
      {Array.from({ length: 8 }, (_, i) => (
        <group key={`WearRing_Casing_${i + 1}`} position={[positions.stages[i], 0, 0]} name={`WearRing_Casing_${i + 1}`}>
          <WearRingCasingModel wireframe={wireframe} index={i + 1} />
        </group>
      ))}

      {/* Impeller Keys (8) */}
      {Array.from({ length: 8 }, (_, i) => (
        <group key={`ImpellerKey_${i + 1}`} position={[positions.stages[i], 0, 0]} name={`ImpellerKey_${i + 1}`}>
          <ImpellerKeyModel wireframe={wireframe} index={i + 1} />
        </group>
      ))}

      {/* Gland Studs and Nuts */}
      <group position={[positions.suction - 3, 0, 0]} name="GlandStudsAndNuts">
        <GlandStudsAndNutsModel />
      </group>

      {/* Tie Bolts / Stay Rods (8-16) - Simplified */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 5; // Around casing
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <group key={`TieBolt_${i + 1}`} position={[positions.suction + (dischargePos - suctionPos) / 2, x, z]} rotation={[0, 0, angle]} name={`TieBolt_${i + 1}`}>
            <NutsAndBoltsModel />
          </group>
        );
      })}
    </group>
  );
}
