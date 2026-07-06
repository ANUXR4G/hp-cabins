'use client';

import React, { useRef, useState, useEffect } from 'react';
import { RotateCw, ZoomIn, ZoomOut, Sun, Moon, Eye, ShieldAlert, Maximize2, Minimize2 } from 'lucide-react';

interface Cabin3DViewerProps {
  cabinId?: string;
  baseMaterial?: 'steel' | 'wood' | 'aluminum';
}

export default function Cabin3DViewer({ cabinId, baseMaterial = 'steel' }: Cabin3DViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // State variables for user interaction
  const [rotation, setRotation] = useState({ x: 35, y: 45 }); // pitch and yaw angles in degrees
  const [zoom, setZoom] = useState(1.1);
  const [isNight, setIsNight] = useState(false);
  const [isInterior, setIsInterior] = useState(false);
  const [material, setMaterial] = useState<'steel' | 'wood' | 'aluminum'>(baseMaterial);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const viewerContainerRef = useRef<HTMLDivElement>(null);

  // Sync state if baseMaterial changes
  useEffect(() => {
    setMaterial(baseMaterial);
  }, [baseMaterial]);

  // Canvas Drawing Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI displays
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Clear Canvas with Background Gradient
    ctx.clearRect(0, 0, width, height);
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    if (isNight) {
      bgGrad.addColorStop(0, '#0a0d14');
      bgGrad.addColorStop(1, '#1b2336');
    } else {
      bgGrad.addColorStop(0, '#f1f3f7');
      bgGrad.addColorStop(1, '#ffffff');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Draw Grid Floor (Perspective)
    ctx.save();
    ctx.translate(width / 2, height / 2 + 100);
    
    const yaw = (rotation.y * Math.PI) / 180;
    const pitch = (rotation.x * Math.PI) / 180;

    const project = (x: number, y: number, z: number) => {
      // Rotation around Y axis (yaw)
      let rx = x * Math.cos(yaw) - z * Math.sin(yaw);
      let rz = x * Math.sin(yaw) + z * Math.cos(yaw);
      // Rotation around X axis (pitch)
      let ry = y * Math.cos(pitch) - rz * Math.sin(pitch);
      let finalZ = y * Math.sin(pitch) + rz * Math.cos(pitch);
      
      // Perspective projection
      const distance = 800;
      const scale = (distance / (distance + finalZ)) * zoom * 1.5;
      return {
        x: rx * scale,
        y: ry * scale,
        depth: finalZ
      };
    };

    // Draw grid lines
    ctx.strokeStyle = isNight ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)';
    ctx.lineWidth = 1;
    for (let i = -10; i <= 10; i++) {
      const p1 = project(i * 30, 0, -300);
      const p2 = project(i * 30, 0, 300);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();

      const p3 = project(-300, 0, i * 30);
      const p4 = project(300, 0, i * 30);
      ctx.beginPath();
      ctx.moveTo(p3.x, p3.y);
      ctx.lineTo(p4.x, p4.y);
      ctx.stroke();
    }
    ctx.restore();

    // Define 3D Coordinates of a Modular Cabin
    // Cabin dimensions: Width = 220, Height = 130, Depth = 110
    const w = 110;
    const h = 130;
    const d = 55;

    // Define vertices
    const vertices = {
      // Floor (Base)
      f0: { x: -w, y: 0, z: -d },
      f1: { x: w, y: 0, z: -d },
      f2: { x: w, y: 0, z: d },
      f3: { x: -w, y: 0, z: d },
      // Ceiling (Roof)
      c0: { x: -w, y: -h, z: -d },
      c1: { x: w, y: -h, z: -d },
      c2: { x: w, y: -h, z: d },
      c3: { x: -w, y: -h, z: d }
    };

    // Projected vertices
    const proj: Record<string, { x: number; y: number; depth: number }> = {};
    const centerOffset = { x: width / 2, y: height / 2 + 50 };

    Object.entries(vertices).forEach(([key, pt]) => {
      const p = project(pt.x, pt.y, pt.z);
      proj[key] = {
        x: p.x + centerOffset.x,
        y: p.y + centerOffset.y,
        depth: p.depth
      };
    });

    // Material Styling configuration
    const getMaterialColors = () => {
      switch (material) {
        case 'wood':
          return {
            cladding: isNight ? '#5c3a21' : '#b08257',
            claddingDark: isNight ? '#3d2514' : '#8c6038',
            frame: '#1a1a1a',
            glass: isNight ? 'rgba(255, 230, 160, 0.45)' : 'rgba(160, 220, 255, 0.35)',
            glow: 'rgba(255, 180, 50, 0.3)'
          };
        case 'aluminum':
          return {
            cladding: isNight ? '#666a70' : '#e0e4eb',
            claddingDark: isNight ? '#484a4f' : '#b5bcc7',
            frame: '#333333',
            glass: isNight ? 'rgba(255, 230, 160, 0.45)' : 'rgba(150, 230, 255, 0.4)',
            glow: 'rgba(255, 200, 80, 0.25)'
          };
        case 'steel':
        default:
          return {
            cladding: isNight ? '#262930' : '#3d4450',
            claddingDark: isNight ? '#1b1d22' : '#282d36',
            frame: '#b40325', // THE CABINS Crimson Red framing accent!
            glass: isNight ? 'rgba(255, 225, 150, 0.5)' : 'rgba(120, 200, 255, 0.35)',
            glow: 'rgba(1, 117, 1, 0.2)'
          };
      }
    };

    const colors = getMaterialColors();

    // Helper to draw a shaded face
    const drawFace = (
      p0: { x: number; y: number },
      p1: { x: number; y: number },
      p2: { x: number; y: number },
      p3: { x: number; y: number },
      fillColor: string,
      strokeColor?: string,
      strokeWidth = 1
    ) => {
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.closePath();
      ctx.fillStyle = fillColor;
      ctx.fill();
      if (strokeColor) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth;
        ctx.stroke();
      }
    };

    // Calculate facing vectors or simple depth sorting to draw back-to-front
    // Sorting order depends on yaw angle. Since we rotate around Y:
    // Normalize yaw to [0, 2*PI]
    const normYaw = ((yaw % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);

    // Let's draw the floor chassis deck
    drawFace(proj.f0, proj.f1, proj.f2, proj.f3, '#1f1f1f', '#0d0d0d', 2);

    // Inside furnishings (Draw if Interior is selected)
    const drawInteriorElements = () => {
      // Draw floor inside
      drawFace(proj.f0, proj.f1, proj.f2, proj.f3, '#e5dcd3', 'rgba(0,0,0,0.1)', 1);

      // Draw modern office table in the center
      const tW = 40;
      const tD = 20;
      const tH = 35;
      const tableCenter = { x: 0, y: 0, z: 0 };
      
      const t_vertices = {
        // top surface
        t0: { x: tableCenter.x - tW, y: -tH, z: tableCenter.z - tD },
        t1: { x: tableCenter.x + tW, y: -tH, z: tableCenter.z - tD },
        t2: { x: tableCenter.x + tW, y: -tH, z: tableCenter.z + tD },
        t3: { x: tableCenter.x - tW, y: -tH, z: tableCenter.z + tD }
      };

      const tProj: any = {};
      Object.entries(t_vertices).forEach(([k, pt]) => {
        const p = project(pt.x, pt.y, pt.z);
        tProj[k] = { x: p.x + centerOffset.x, y: p.y + centerOffset.y };
      });

      // Draw table top
      drawFace(tProj.t0, tProj.t1, tProj.t2, tProj.t3, '#6e5038', '#422e1e', 1);

      // Draw table legs
      const drawLeg = (pt: { x: number; y: number; z: number }) => {
        const top = project(pt.x, -tH, pt.z);
        const bot = project(pt.x, 0, pt.z);
        ctx.beginPath();
        ctx.moveTo(top.x + centerOffset.x, top.y + centerOffset.y);
        ctx.lineTo(bot.x + centerOffset.x, bot.y + centerOffset.y);
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 3;
        ctx.stroke();
      };
      drawLeg({ x: tableCenter.x - tW + 5, y: 0, z: tableCenter.z - tD + 5 });
      drawLeg({ x: tableCenter.x + tW - 5, y: 0, z: tableCenter.z - tD + 5 });
      drawLeg({ x: tableCenter.x + tW - 5, y: 0, z: tableCenter.z + tD - 5 });
      drawLeg({ x: tableCenter.x - tW + 5, y: 0, z: tableCenter.z + tD - 5 });

      // Draw computer monitor on table
      const monTop = project(0, -tH - 18, 0);
      const monBot = project(0, -tH, 0);
      ctx.beginPath();
      ctx.moveTo(monTop.x + centerOffset.x, monTop.y + centerOffset.y);
      ctx.lineTo(monBot.x + centerOffset.x, monBot.y + centerOffset.y);
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 4;
      ctx.stroke();

      const screenVertices = [
        project(-15, -tH - 18, 0),
        project(15, -tH - 18, 0),
        project(15, -tH - 6, 0),
        project(-15, -tH - 6, 0)
      ];
      ctx.beginPath();
      ctx.moveTo(screenVertices[0].x + centerOffset.x, screenVertices[0].y + centerOffset.y);
      ctx.lineTo(screenVertices[1].x + centerOffset.x, screenVertices[1].y + centerOffset.y);
      ctx.lineTo(screenVertices[2].x + centerOffset.x, screenVertices[2].y + centerOffset.y);
      ctx.lineTo(screenVertices[3].x + centerOffset.x, screenVertices[3].y + centerOffset.y);
      ctx.closePath();
      ctx.fillStyle = isNight ? '#4ba3e3' : '#111';
      ctx.fill();

      // Draw warm yellow lamp / overhead light rays if night
      if (isNight) {
        ctx.save();
        const lightSource = project(0, -h + 10, 0);
        const lsX = lightSource.x + centerOffset.x;
        const lsY = lightSource.y + centerOffset.y;

        const radial = ctx.createRadialGradient(lsX, lsY, 5, lsX, lsY, 150);
        radial.addColorStop(0, 'rgba(255, 240, 150, 0.6)');
        radial.addColorStop(0.4, 'rgba(255, 220, 100, 0.2)');
        radial.addColorStop(1, 'rgba(255, 220, 100, 0)');
        
        ctx.fillStyle = radial;
        ctx.beginPath();
        ctx.arc(lsX, lsY, 150, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    };

    // Draw logic based on camera angle (yaw) to handle proper occlusions
    // We split into quadrants to draw back-to-front
    const renderOrder = () => {
      // Simple depth calculation for major panels
      // Back wall, left wall, right wall, front glass wall.
      // Back wall is always on z = -d
      // Front wall is always on z = d
      // Left wall is on x = -w
      // Right wall is on x = w

      // Calculate which faces are back faces (pointing away from viewer)
      // and which faces are front faces (pointing towards viewer)
      // For simple rendering:
      const backWallDepth = (proj.f0.depth + proj.f1.depth) / 2;
      const frontWallDepth = (proj.f2.depth + proj.f3.depth) / 2;
      const leftWallDepth = (proj.f0.depth + proj.f3.depth) / 2;
      const rightWallDepth = (proj.f1.depth + proj.f2.depth) / 2;

      const faces = [
        { name: 'back', depth: backWallDepth, draw: () => drawBackWall() },
        { name: 'left', depth: leftWallDepth, draw: () => drawLeftWall() },
        { name: 'right', depth: rightWallDepth, draw: () => drawRightWall() },
        { name: 'interior', depth: 0, draw: () => { if (isInterior) drawInteriorElements(); } },
        { name: 'front', depth: frontWallDepth, draw: () => drawFrontWall() },
        { name: 'roof', depth: (proj.c0.depth + proj.c1.depth + proj.c2.depth + proj.c3.depth) / 4, draw: () => drawRoof() }
      ];

      // Sort by depth descending (deepest coordinates first)
      faces.sort((a, b) => b.depth - a.depth);

      faces.forEach(face => {
        face.draw();
      });
    };

    const drawBackWall = () => {
      // Wall panel from c0, c1, f1, f0
      drawFace(proj.c0, proj.c1, proj.f1, proj.f0, colors.claddingDark, colors.frame, 1.5);
      
      // Draw horizontal cladding board seams if wood/steel
      ctx.strokeStyle = isNight ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.15)';
      ctx.lineWidth = 1;
      for (let y = -20; y > -h; y -= 15) {
        const wl1 = project(-w, y, -d);
        const wl2 = project(w, y, -d);
        ctx.beginPath();
        ctx.moveTo(wl1.x + centerOffset.x, wl1.y + centerOffset.y);
        ctx.lineTo(wl2.x + centerOffset.x, wl2.y + centerOffset.y);
        ctx.stroke();
      }
    };

    const drawLeftWall = () => {
      // Wall panel from c3, c0, f0, f3
      drawFace(proj.c3, proj.c0, proj.f0, proj.f3, colors.cladding, colors.frame, 1.5);
      
      // Draw horizontal cladding board seams
      ctx.strokeStyle = isNight ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.15)';
      ctx.lineWidth = 1;
      for (let y = -20; y > -h; y -= 15) {
        const wl1 = project(-w, y, -d);
        const wl2 = project(-w, y, d);
        ctx.beginPath();
        ctx.moveTo(wl1.x + centerOffset.x, wl1.y + centerOffset.y);
        ctx.lineTo(wl2.x + centerOffset.x, wl2.y + centerOffset.y);
        ctx.stroke();
      }
    };

    const drawRightWall = () => {
      // Wall panel from c1, c2, f2, f1
      drawFace(proj.c1, proj.c2, proj.f2, proj.f1, colors.claddingDark, colors.frame, 1.5);

      // Draw horizontal cladding board seams
      ctx.strokeStyle = isNight ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.15)';
      ctx.lineWidth = 1;
      for (let y = -20; y > -h; y -= 15) {
        const wl1 = project(w, y, -d);
        const wl2 = project(w, y, d);
        ctx.beginPath();
        ctx.moveTo(wl1.x + centerOffset.x, wl1.y + centerOffset.y);
        ctx.lineTo(wl2.x + centerOffset.x, wl2.y + centerOffset.y);
        ctx.stroke();
      }
    };

    const drawFrontWall = () => {
      // If we are looking in Interior mode, we hide/fade the front glass wall
      if (isInterior) {
        // Draw just the skeletal outline frame
        ctx.beginPath();
        ctx.moveTo(proj.c3.x, proj.c3.y);
        ctx.lineTo(proj.c2.x, proj.c2.y);
        ctx.lineTo(proj.f2.x, proj.f2.y);
        ctx.lineTo(proj.f3.x, proj.f3.y);
        ctx.closePath();
        ctx.strokeStyle = 'rgba(1, 117, 1, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();
        return;
      }

      // Draw Premium Glass Front Facade: c3, c2, f2, f3
      drawFace(proj.c3, proj.c2, proj.f2, proj.f3, colors.glass, colors.frame, 2);

      // Draw glass glazing structures / sliding frame separations
      const m1_c = project(-w / 3, -h, d);
      const m1_f = project(-w / 3, 0, d);
      const m2_c = project(w / 3, -h, d);
      const m2_f = project(w / 3, 0, d);

      ctx.strokeStyle = colors.frame;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(m1_c.x + centerOffset.x, m1_c.y + centerOffset.y);
      ctx.lineTo(m1_f.x + centerOffset.x, m1_f.y + centerOffset.y);
      ctx.moveTo(m2_c.x + centerOffset.x, m2_c.y + centerOffset.y);
      ctx.lineTo(m2_f.x + centerOffset.x, m2_f.y + centerOffset.y);
      ctx.stroke();

      // Glare reflections on glass
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 3;
      
      const gl1_s = project(-w + 20, -10, d);
      const gl1_e = project(-w + 50, -h + 20, d);
      ctx.beginPath();
      ctx.moveTo(gl1_s.x + centerOffset.x, gl1_s.y + centerOffset.y);
      ctx.lineTo(gl1_e.x + centerOffset.x, gl1_e.y + centerOffset.y);
      ctx.stroke();

      const gl2_s = project(w - 50, -20, d);
      const gl2_e = project(w - 20, -h + 30, d);
      ctx.beginPath();
      ctx.moveTo(gl2_s.x + centerOffset.x, gl2_s.y + centerOffset.y);
      ctx.lineTo(gl2_e.x + centerOffset.x, gl2_e.y + centerOffset.y);
      ctx.stroke();
      ctx.restore();
    };

    const drawRoof = () => {
      // Roof deck from c0, c1, c2, c3
      drawFace(proj.c0, proj.c1, proj.c2, proj.c3, colors.frame, '#111', 2);
      
      // Draw top logo emblem highlight (Crimson Red triangle logo outline) if steel
      if (material === 'steel') {
        const logoV = [
          project(-15, -h - 2, -10),
          project(15, -h - 2, -10),
          project(0, -h - 2, 20)
        ];
        ctx.beginPath();
        ctx.moveTo(logoV[0].x + centerOffset.x, logoV[0].y + centerOffset.y);
        ctx.lineTo(logoV[1].x + centerOffset.x, logoV[1].y + centerOffset.y);
        ctx.lineTo(logoV[2].x + centerOffset.x, logoV[2].y + centerOffset.y);
        ctx.closePath();
        ctx.fillStyle = 'rgba(1, 117, 1, 0.8)';
        ctx.fill();
      }
    };

    renderOrder();

  }, [rotation, zoom, isNight, isInterior, material]);

  // Drag handlers for 360 rotation
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    
    setRotation(prev => ({
      x: Math.max(10, Math.min(80, prev.x - dy * 0.5)), // limit pitch to avoid extreme flips
      y: prev.y + dx * 0.5
    }));

    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile devices
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length !== 1) return;
    setIsDragging(true);
    dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStart.current.x;
    const dy = e.touches[0].clientY - dragStart.current.y;

    setRotation(prev => ({
      x: Math.max(10, Math.min(80, prev.x - dy * 0.5)),
      y: prev.y + dx * 0.5
    }));

    dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const toggleFullscreen = () => {
    if (!viewerContainerRef.current) return;
    if (!document.fullscreenElement) {
      viewerContainerRef.current.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  return (
    <div 
      ref={viewerContainerRef} 
      className={`relative flex flex-col bg-white rounded-none overflow-hidden border border-gray-200/80 ${
        isFullscreen ? 'w-full h-full p-4' : 'w-full h-[480px]'
      }`}
    >
      {/* 3D Canvas rendering container */}
      <div className="relative flex-grow w-full overflow-hidden cursor-grab active:cursor-grabbing">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="w-full h-full block"
        />

        {/* Ambient Overlay for Night mode */}
        {isNight && (
          <div className="absolute inset-0 bg-blue-950/10 pointer-events-none mix-blend-color-burn" />
        )}

        {/* Quick Instructions badge */}
        <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-md px-3.5 py-1.5 rounded-none border border-white/10 text-white flex items-center gap-2 text-sm">
          <RotateCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
          <span className="font-medium tracking-wide uppercase text-xs">Drag to rotate 360°</span>
        </div>

        {/* Floating Right Side Controls */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2.5 z-20">
          <button 
            onClick={() => setZoom(z => Math.min(2.0, z + 0.15))}
            className="p-3 bg-white hover:bg-crimson hover:text-white rounded-none text-premium-black border border-gray-100 transition-all duration-300 active:scale-90"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setZoom(z => Math.max(0.5, z - 0.15))}
            className="p-3 bg-white hover:bg-crimson hover:text-white rounded-none text-premium-black border border-gray-100 transition-all duration-300 active:scale-90"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button 
            onClick={toggleFullscreen}
            className="p-3 bg-white hover:bg-crimson hover:text-white rounded-none text-premium-black border border-gray-100 transition-all duration-300 active:scale-90"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Floating Left Side Render Mode Toggles */}
        <div className="absolute bottom-4 left-4 flex gap-2 z-20">
          <button 
            onClick={() => setIsNight(!isNight)}
            className={`p-3 rounded-none border transition-all duration-300 flex items-center gap-2 text-sm font-semibold ${
              isNight 
                ? 'bg-crimson border-crimson text-white shadow-crimson/10' 
                : 'bg-white border-gray-100 text-premium-black hover:bg-gray-50'
            }`}
          >
            {isNight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            <span className="text-xs tracking-wider uppercase">{isNight ? 'Night View' : 'Day View'}</span>
          </button>

          <button 
            onClick={() => setIsInterior(!isInterior)}
            className={`p-3 rounded-none border transition-all duration-300 flex items-center gap-2 text-sm font-semibold ${
              isInterior 
                ? 'bg-crimson border-crimson text-white shadow-crimson/10' 
                : 'bg-white border-gray-100 text-premium-black hover:bg-gray-50'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span className="text-xs tracking-wider uppercase">{isInterior ? 'Interior View' : 'Exterior View'}</span>
          </button>
        </div>
      </div>

      {/* Material Cladding Selector Bar */}
      <div className="bg-gray-50/50 border-t border-gray-200/60 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-base font-bold text-premium-black uppercase tracking-wider">Material Cladding System</span>
          <span className="text-xs text-gray-500 mt-0.5">Customize the modular exterior finish</span>
        </div>
        
        <div className="flex gap-2">
          {[
            { id: 'steel', name: 'Charcoal Steel', color: '#3d4450', border: 'border-crimson' },
            { id: 'wood', name: 'Bespoke Timber', color: '#b08257', border: 'border-amber-600' },
            { id: 'aluminum', name: 'White Aluminum', color: '#e0e4eb', border: 'border-gray-400' }
          ].map((mat) => (
            <button
              key={mat.id}
              onClick={() => setMaterial(mat.id as any)}
              className={`px-3 py-2 bg-white rounded-none border text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                material === mat.id 
                  ? 'border-crimson text-crimson font-bold' 
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <span 
                className="w-3.5 h-3.5 rounded-full inline-block border border-gray-300"
                style={{ backgroundColor: mat.color }}
              />
              <span>{mat.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
