'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { useState } from 'react';
import NutsAndBoltsModel from './NutsAndBoltsModel';
import FeedPumpSectionModel from './FeedPumpSectionModel';
import DischargeCoverModel from './DischargeCoverModel';
import ImpellerKeyModel from './ImpellerKeyModel';
import CouplingGuardModel from './CouplingGuardModel';
import BalanceLeakoffPipeModel from './BalanceLeakoffPipeModel';
import ThrustCollarModel from './ThrustCollarModel';
import BalancingDrumBushModel from './BalancingDrumBushModel';
import LubeOilSkidModel from './LubeOilSkidModel';
import BaseplateSkidModel from './BaseplateSkidModel';
import { MechanicalSealCartridgeModel } from './MechanicalSealCartridgeModel';
import PumpShaftModel from './PumpShaftModel';
import ShaftSleeveModel from './ShaftSleeveModel';
import Group2InnerCartridgeModel from './Group2InnerCartridgeModel';
import DiffuserModel from './DiffuserModel';
import Impeller1stStageModel from './Impeller1stStageModel';
import ImpellerNStageModel from './ImpellerNStageModel';
import SuctionGuideModel from './SuctionGuideModel';

import WearRingImpellerModel from './WearRingImpellerModel';
import WearRingCasingModel from './WearRingCasingModel';
import ShaftSleeveInterstageModel from './ShaftSleeveInterstageModel';
import ShaftSleeveSealModel from './ShaftSleeveSealModel';
import GlandStudsAndNutsModel from './GlandStudsAndNutsModel';
import FullFeedPumpAssembly from './FullFeedPumpAssembly';

export default function SceneCanvas() {
  const [model, setModel] = useState<'nuts' | 'pump' | 'cover' | 'key' | 'guard' | 'pipe' | 'collar' | 'bush' | 'skid' | 'baseplate' | 'seal' | 'shaft' | 'sleeve' | 'group2' | 'diffuser' | 'impeller1st' | 'impellern' | 'suction' | 'wearimpeller' | 'wearcasing' | 'sleeveinter' | 'sleeveseal' | 'gland' | 'fullassembly'>('fullassembly');
  const [wireframe, setWireframe] = useState(false);
  const [exploded, setExploded] = useState(false);

  return (
    <div className="w-screen h-screen bg-black relative">
      {/* UI Controls */}
      <div className="absolute top-4 left-4 z-10 bg-gray-800 p-4 rounded">
        <div className="mb-2">
          <label className="text-white mr-2">Model:</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value as 'nuts' | 'pump' | 'cover' | 'key' | 'guard' | 'pipe' | 'collar' | 'bush' | 'skid' | 'baseplate' | 'seal' | 'shaft' | 'sleeve' | 'group2' | 'diffuser' | 'impeller1st' | 'impellern' | 'suction' | 'wearimpeller' | 'wearcasing' | 'sleeveinter' | 'sleeveseal' | 'gland' | 'fullassembly')}
            className="bg-gray-700 text-white"
          >
            <option value="nuts">Nuts and Bolts</option>
            <option value="pump">Feed Pump</option>
            <option value="cover">Discharge Cover</option>
            <option value="key">Impeller Key</option>
            <option value="guard">Coupling Guard</option>
            <option value="pipe">Balance Leak-off Pipe</option>
            <option value="collar">Thrust Collar</option>
            <option value="bush">Balancing Drum Bush</option>
            <option value="skid">Lube Oil Skid</option>
            <option value="baseplate">Baseplate Skid</option>
            <option value="seal">Mechanical Seal Cartridge</option>
            <option value="shaft">Pump Shaft</option>
            <option value="sleeve">Shaft Sleeve</option>
            <option value="group2">Group 2 Inner Cartridge</option>
            <option value="diffuser">Diffuser</option>
            <option value="impeller1st">Impeller 1st Stage</option>
            <option value="impellern">Impeller N Stage</option>
            <option value="suction">Suction Guide</option>

            <option value="wearimpeller">Wear Ring Impeller</option>
            <option value="wearcasing">Wear Ring Casing</option>
            <option value="sleeveinter">Shaft Sleeve Interstage</option>
            <option value="sleeveseal">Shaft Sleeve Seal</option>
            <option value="gland">Gland Studs and Nuts</option>
            <option value="fullassembly">Full Feed Pump Assembly</option>
          </select>
        </div>
        <div className="mb-2">
          <label className="text-white mr-2">Wireframe:</label>
          <input
            type="checkbox"
            checked={wireframe}
            onChange={(e) => setWireframe(e.target.checked)}
          />
        </div>
        {model === 'fullassembly' && (
          <div>
            <label className="text-white mr-2">Exploded View:</label>
            <input
              type="checkbox"
              checked={exploded}
              onChange={(e) => setExploded(e.target.checked)}
            />
          </div>
        )}
      </div>

      <Canvas
        shadows
        camera={{ position: [0, 0, model === 'fullassembly' ? 400 : 100], fov: 45 }}
        style={{ width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[8, 10, 5]} intensity={1.2} castShadow />
        <Environment preset="studio" />
        {model === 'nuts' ? (
          <NutsAndBoltsModel />
        ) : model === 'pump' ? (
          <FeedPumpSectionModel wireframe={wireframe} />
        ) : model === 'cover' ? (
          <DischargeCoverModel wireframe={wireframe} />
        ) : model === 'key' ? (
          <ImpellerKeyModel wireframe={wireframe} />
        ) : model === 'guard' ? (
          <CouplingGuardModel wireframe={wireframe} />
        ) : model === 'collar' ? (
          <ThrustCollarModel wireframe={wireframe} />
        ) : model === 'bush' ? (
          <BalancingDrumBushModel wireframe={wireframe} />
        ) : model === 'skid' ? (
          <LubeOilSkidModel wireframe={wireframe} />
        ) : model === 'baseplate' ? (
          <BaseplateSkidModel wireframe={wireframe} />
        ) : model === 'seal' ? (
          <MechanicalSealCartridgeModel wireframe={wireframe} />
        ) : model === 'shaft' ? (
          <group position={[0, 0, 0]}>
            <PumpShaftModel wireframe={wireframe} />
          </group>
        ) : model === 'sleeve' ? (
          <ShaftSleeveModel wireframe={wireframe} />
        ) : model === 'group2' ? (
          <Group2InnerCartridgeModel wireframe={wireframe} />
        ) : model === 'diffuser' ? (
          <DiffuserModel wireframe={wireframe} stage={1} />
        ) : model === 'impeller1st' ? (
          <Impeller1stStageModel wireframe={wireframe} />
        ) : model === 'impellern' ? (
          <ImpellerNStageModel wireframe={wireframe} stage={1} />
        ) : model === 'suction' ? (
          <SuctionGuideModel wireframe={wireframe} />
        ) : model === 'wearimpeller' ? (
          <WearRingImpellerModel wireframe={wireframe} index={1} />
        ) : model === 'wearcasing' ? (
          <WearRingCasingModel wireframe={wireframe} index={1} />
        ) : model === 'sleeveinter' ? (
          <ShaftSleeveInterstageModel wireframe={wireframe} index={1} />
        ) : model === 'sleeveseal' ? (
          <ShaftSleeveSealModel wireframe={wireframe} index={1} />
        ) : model === 'gland' ? (
          <GlandStudsAndNutsModel />
        ) : model === 'fullassembly' ? (
          <FullFeedPumpAssembly wireframe={wireframe} exploded={exploded} />
        ) : (
          <BalanceLeakoffPipeModel wireframe={wireframe} />
        )}
        <OrbitControls
          enableRotate={true}
          enablePan={true}
          enableZoom={true}
          minDistance={10}
          maxDistance={200}
          target={[0, 0, 0]}
          makeDefault
        />
      </Canvas>
    </div>
  );
}
