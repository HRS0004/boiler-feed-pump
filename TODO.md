# TODO: Create Group 2 (Inner Cartridge / Hydraulic Assembly) for Boiler Feed Pump

## Tasks
- [ ] Create Impeller1stStageModel.tsx: Axial-flow 3-bladed impeller (polished aluminium, custom geometry).
- [ ] Create ImpellerNStageModel.tsx: Reusable axial-flow 3-bladed impeller for Impeller_NStage_1-7 (polished aluminium).
- [ ] Create SuctionGuideModel.tsx: Funnel shape (cast steel).
- [ ] Create DiffuserModel.tsx: Vaned ring (cast steel).
- [ ] Create StageCasingModel.tsx: Ring with bolt holes (cast steel).
- [ ] Create WearRingImpellerModel.tsx: Thin ring (bronze/stainless).
- [ ] Create WearRingCasingModel.tsx: Thin ring (bronze/stainless).
- [ ] Create ShaftSleeveInterstageModel.tsx: Hollow cylindrical sleeve for interstage (stainless steel).
- [ ] Create ShaftSleeveSealModel.tsx: Hollow cylindrical sleeve for seal (stainless steel, similar to existing).
- [ ] Create Group2InnerCartridgeModel.tsx: Instantiates all 67 components, positions along X-axis with 15-unit spacing starting at X=0.
- [ ] Edit ImpellerKeyModel.tsx: Add props for multiple instances (ImpellerKey_1-8).
- [x] Create export_group2.js: Builds scene with all components positioned, exports to Group2_InnerCartridge.obj and metadata.json using OBJExporter (GLTFExporter had issues with FileReader in Node.js).
- [x] Update SceneCanvas.tsx: Add 'group2' model option to render Group2InnerCartridgeModel.
- [x] Run export_group2.js to generate OBJ and metadata.
- [ ] Verify output in a viewer (positioning, naming, 67 meshes).
