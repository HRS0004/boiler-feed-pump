# Boiler Feed Pump 3D Model

This project is an interactive 3D visualization of a boiler feed pump, built using Next.js, React Three Fiber, and Three.js. It provides detailed 3D models of various pump components, allowing users to explore individual parts or the full assembly with options for wireframe view and exploded assembly.

## Features

- **Interactive 3D Models**: Visualize over 20 individual pump components, including impellers, casings, shafts, seals, and more.
- **Full Assembly View**: See the complete boiler feed pump assembly with an option to toggle exploded view for better inspection.
- **Wireframe Mode**: Switch to wireframe rendering to examine internal structures.
- **Orbit Controls**: Navigate the 3D scene with mouse controls for rotation, panning, and zooming.
- **Component Selection**: Use the UI dropdown to switch between different models.
- **Export Scripts**: Includes scripts to export models in various formats (OBJ, GLB) for external use.

### Components Modeled
- Nuts and Bolts
- Feed Pump Section
- Discharge Cover
- Impeller Key
- Coupling Guard
- Balance Leak-off Pipe
- Thrust Collar
- Balancing Drum Bush
- Lube Oil Skid
- Baseplate Skid
- Mechanical Seal Cartridge
- Pump Shaft
- Shaft Sleeve
- Group 2 Inner Cartridge
- Diffuser
- Impeller (1st Stage and N Stage)
- Suction Guide
- Stage Casing
- Wear Rings (Impeller and Casing)
- Shaft Sleeve (Interstage and Seal)
- Gland Studs and Nuts
- Full Feed Pump Assembly

## Technologies Used

- **Next.js**: React framework for building the web application.
- **React Three Fiber**: React renderer for Three.js, enabling 3D graphics in React.
- **Three.js**: JavaScript 3D library for creating and displaying 3D computer graphics.
- **@react-three/drei**: Useful helpers for React Three Fiber, including OrbitControls and Environment.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **TypeScript**: Typed superset of JavaScript for better development experience.

## Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/HRS0004/boiler-feed-pump.git
   cd boiler-feed-pump
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Usage

- Select a model from the dropdown in the top-left corner.
- Toggle wireframe mode using the checkbox.
- For the full assembly, enable exploded view to see components separated.
- Use mouse to orbit, pan, and zoom the 3D scene.

### Exporting Models

The project includes export scripts (e.g., `export_group2.js`) to generate 3D model files in OBJ or GLB formats. Run these scripts using Node.js to export specific components.

Example:
```bash
node export_group2.js
```

## Project Structure

- `app/`: Next.js app directory with main page and layout.
- `components/`: React components for 3D models and scene canvas.
- `public/`: Static assets, including exported 3D models and metadata.
- `export_*.js`: Scripts for exporting 3D models.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.
