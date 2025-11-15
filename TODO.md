# TODO: Update Group 2 Inner Cartridge Model

## Overview
Update the Group2InnerCartridgeModel to accurately represent a 3-stage boiler feed pump inner cartridge based on provided specifications. This includes modifying the shaft, adding new components, and assembling them in the correct sequence.

## Tasks

### 1. Update PumpShaftModel.tsx
- [ ] Modify shaft geometry to match new dimensions: Length 860 mm (86 units), diameters 48→42→38→32→28 mm (4.8, 4.2, 3.8, 3.2, 2.8 units), with smooth chamfers.
- [ ] Ensure material is polished steel.
- [ ] Add keyway slot for mechanical seal area: 6 mm width, 3 mm depth at 32 mm diameter section.

### 2. Create StageBushingModel.tsx
- [ ] New component for stage bushings (3 instances).
- [ ] Inner diameter: +0.2 mm clearance over shaft (e.g., 48.2 mm for base).
- [ ] Outer diameter: 72 mm.
- [ ] Length: 55 mm.
- [ ] Bush collar: 10 mm long, 76 mm OD.
- [ ] Material: silver/steel.
- [ ] Press-fit seating with ±0.05 mm tolerance.

### 3. Update BalancingDrumBushModel.tsx
- [ ] Modify to match specs: Drum OD 90 mm, length 160 mm, bush ID 48 mm.
- [ ] Add axial ribs: 6 ribs, 8 mm thickness.
- [ ] Add copper sealing ring on downstream side.

### 4. Modify MechanicalSealAreaModel.tsx (or update existing)
- [ ] Shaft seal diameter: 32 mm.
- [ ] Housing OD: 78 mm.
- [ ] Slot for keyway: 6 mm width, 3 mm depth.
- [ ] If not existing, create new component.

### 5. Adjust ImpellerKeyModel.tsx
- [ ] Ensure 3 keys with dimensions 8 mm × 3.5 mm.
- [ ] Uniform spacing, distance between stages 120 mm.

### 6. Create LockNutSpacerModel.tsx
- [ ] End nut: hex 32 mm AF, thread M30 × 2.0 pitch.
- [ ] Spacer sleeve: 60 mm long, 34 mm OD.

### 7. Update Group2InnerCartridgeModel.tsx
- [ ] Reduce to 3 stages.
- [ ] Assemble components in exact sequence: Shaft, Bushings, Balancing Drum, Seal Area, Keys, Lock Nut.
- [ ] Ensure tight axial alignment, no gaps, realistic dimensions.
- [ ] Set background to pure black, metallic materials.

### 8. Testing and Verification
- [ ] Verify alignment and dimensions in 3D view.
- [ ] Ensure no stretching or duplication.
- [ ] Check metallic appearance with subtle reflections.

## Notes
- Scaling: 1 unit = 10 mm.
- All components must be positioned on central shaft.
- Use existing components where possible, create new ones as needed.
