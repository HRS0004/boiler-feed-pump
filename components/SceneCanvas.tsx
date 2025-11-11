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

export default function SceneCanvas() {
  const [model, setModel] = useState<'nuts' | 'pump' | 'cover' | 'key' | 'guard' | 'pipe' | 'collar' | 'bush' | 'skid' | 'baseplate' | 'seal'>('skid');
  const [wireframe, setWireframe] = useState(false);

  return (
    <div className="w-screen h-screen bg-black relative">
      {/* UI Controls */}
      <div className="absolute top-4 left-4 z-10 bg-gray-800 p-4 rounded">
        <div className="mb-2">
          <label className="text-white mr-2">Model:</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value as 'nuts' | 'pump' | 'cover' | 'key' | 'guard' | 'pipe' | 'collar' | 'bush' | 'skid' | 'baseplate' | 'seal')}
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
          </select>
        </div>
        <div>
          <label className="text-white mr-2">Wireframe:</label>
          <input
            type="checkbox"
            checked={wireframe}
            onChange={(e) => setWireframe(e.target.checked)}
          />
        </div>
      </div>

      <Canvas camera={{ position: [2, 2, 3], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
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
        ) : (
          <BalanceLeakoffPipeModel wireframe={wireframe} />
        )}
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  );
}
