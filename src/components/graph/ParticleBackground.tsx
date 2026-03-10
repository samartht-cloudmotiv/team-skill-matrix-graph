'use client';

import { useEffect, useRef } from 'react';
import { motion, MotionValue, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  opacityDelta: number;
  layer: number; // 1=far/tiny, 2=mid, 3=close/large, 4=foreground sparkle
}

interface Props {
  mouseX?: MotionValue<number>;
  mouseY?: MotionValue<number>;
}

// Per-layer parallax multipliers (how far each layer shifts relative to mouse)
const LAYER_PARALLAX = { 1: 8, 2: 22, 3: 48, 4: 80 };
// Per-layer colors [r, g, b]
const LAYER_COLOR: Record<number, [number, number, number]> = {
  1: [120, 90, 200],  // far: cool purple-blue
  2: [160, 110, 240], // mid: soft violet
  3: [220, 150, 40],  // close: warm amber
  4: [255, 220, 80],  // foreground: bright gold
};
// Per-layer size ranges [min, range]
const LAYER_SIZE: Record<number, [number, number]> = {
  1: [0.3, 0.5],
  2: [0.6, 0.7],
  3: [1.0, 1.2],
  4: [1.8, 1.4],
};
// Per-layer opacity ranges [max]
const LAYER_OPACITY_MAX: Record<number, number> = { 1: 0.35, 2: 0.45, 3: 0.55, 4: 0.75 };
// Per-layer count weight
const LAYER_WEIGHT = { 1: 5, 2: 3, 3: 1.5, 4: 0.4 };

// Nebula blobs config
const NEBULAE = [
  { cx: 0.15, cy: 0.2,  r: 0.38, color: '80, 20, 160',  opacity: 0.055, parallax: 0.3 },
  { cx: 0.78, cy: 0.65, r: 0.42, color: '160, 60, 10',  opacity: 0.04,  parallax: 0.2 },
  { cx: 0.5,  cy: 0.85, r: 0.3,  color: '20, 60, 160',  opacity: 0.04,  parallax: 0.35 },
  { cx: 0.85, cy: 0.15, r: 0.28, color: '100, 20, 180', opacity: 0.035, parallax: 0.15 },
  { cx: 0.25, cy: 0.75, r: 0.25, color: '200, 80, 20',  opacity: 0.03,  parallax: 0.4  },
];

export default function ParticleBackground({ mouseX, mouseY }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Always call hooks unconditionally
  const fallbackX = useMotionValue(0);
  const fallbackY = useMotionValue(0);
  const rawX = mouseX ?? fallbackX;
  const rawY = mouseY ?? fallbackY;

  // Smooth the mouse movement with spring physics
  const smoothX = useSpring(rawX, { stiffness: 60, damping: 25 });
  const smoothY = useSpring(rawY, { stiffness: 60, damping: 25 });

  // Store smoothed value in a ref for the canvas draw loop to read
  const mouseRef = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const unsubX = smoothX.on('change', (v) => { mouseRef.current.x = v; });
    const unsubY = smoothY.on('change', (v) => { mouseRef.current.y = v; });
    return () => { unsubX(); unsubY(); };
  }, [smoothX, smoothY]);

  // Nebula layer parallax via CSS transforms
  const nebulaX = (parallax: number) => useTransform(smoothX, [-1, 1], [-50 * parallax, 50 * parallax]);
  const nebulaY = (parallax: number) => useTransform(smoothY, [-1, 1], [-35 * parallax, 35 * parallax]);

  // Pre-compute all nebula transforms (hooks must be at top level)
  const n0x = useTransform(smoothX, [-1, 1], [-50 * NEBULAE[0].parallax, 50 * NEBULAE[0].parallax]);
  const n0y = useTransform(smoothY, [-1, 1], [-35 * NEBULAE[0].parallax, 35 * NEBULAE[0].parallax]);
  const n1x = useTransform(smoothX, [-1, 1], [-50 * NEBULAE[1].parallax, 50 * NEBULAE[1].parallax]);
  const n1y = useTransform(smoothY, [-1, 1], [-35 * NEBULAE[1].parallax, 35 * NEBULAE[1].parallax]);
  const n2x = useTransform(smoothX, [-1, 1], [-50 * NEBULAE[2].parallax, 50 * NEBULAE[2].parallax]);
  const n2y = useTransform(smoothY, [-1, 1], [-35 * NEBULAE[2].parallax, 35 * NEBULAE[2].parallax]);
  const n3x = useTransform(smoothX, [-1, 1], [-50 * NEBULAE[3].parallax, 50 * NEBULAE[3].parallax]);
  const n3y = useTransform(smoothY, [-1, 1], [-35 * NEBULAE[3].parallax, 35 * NEBULAE[3].parallax]);
  const n4x = useTransform(smoothX, [-1, 1], [-50 * NEBULAE[4].parallax, 50 * NEBULAE[4].parallax]);
  const n4y = useTransform(smoothY, [-1, 1], [-35 * NEBULAE[4].parallax, 35 * NEBULAE[4].parallax]);

  const nebulaTransforms = [
    { x: n0x, y: n0y },
    { x: n1x, y: n1y },
    { x: n2x, y: n2y },
    { x: n3x, y: n3y },
    { x: n4x, y: n4y },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createParticles() {
      if (!canvas) return;
      particles = [];
      const base = Math.floor((canvas.width * canvas.height) / 5000);
      for (let layer = 1; layer <= 4; layer++) {
        const count = Math.floor(base * LAYER_WEIGHT[layer as keyof typeof LAYER_WEIGHT]);
        const speed = layer * 0.035;
        for (let i = 0; i < count; i++) {
          const [sMin, sRange] = LAYER_SIZE[layer];
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * speed,
            vy: (Math.random() - 0.5) * speed - layer * 0.015,
            size: sMin + Math.random() * sRange,
            opacity: Math.random() * LAYER_OPACITY_MAX[layer] * 0.6 + 0.03,
            opacityDelta: (Math.random() - 0.5) * 0.003,
            layer,
          });
        }
      }
    }

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mx = mouseRef.current.x; // -1 to 1
      const my = mouseRef.current.y;

      // Draw each layer with its own parallax offset
      for (let layer = 1; layer <= 4; layer++) {
        const offsetX = mx * LAYER_PARALLAX[layer as keyof typeof LAYER_PARALLAX];
        const offsetY = my * LAYER_PARALLAX[layer as keyof typeof LAYER_PARALLAX];
        const [r, g, b] = LAYER_COLOR[layer];
        const maxOp = LAYER_OPACITY_MAX[layer];

        ctx.save();
        ctx.translate(offsetX, offsetY);

        particles
          .filter((p) => p.layer === layer)
          .forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;
            p.opacity += p.opacityDelta;

            if (p.opacity <= 0.02 || p.opacity >= maxOp) p.opacityDelta *= -1;
            if (p.x < -100) p.x = canvas.width + 100;
            if (p.x > canvas.width + 100) p.x = -100;
            if (p.y < -100) p.y = canvas.height + 100;
            if (p.y > canvas.height + 100) p.y = -100;

            // Larger particles get a glow
            if (layer >= 3) {
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity * 0.15})`;
              ctx.fill();
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity})`;
            ctx.fill();
          });

        ctx.restore();
      }

      animationId = requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    draw();

    const onResize = () => { resize(); createParticles(); };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <>
      {/* Nebula blobs — each with independent parallax via CSS */}
      {NEBULAE.map((n, i) => (
        <motion.div
          key={i}
          className="fixed pointer-events-none"
          style={{
            zIndex: 0,
            left: `${n.cx * 100}%`,
            top:  `${n.cy * 100}%`,
            width:  `${n.r * 100}vw`,
            height: `${n.r * 100}vw`,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(${n.color}, ${n.opacity}) 0%, transparent 70%)`,
            filter: 'blur(40px)',
            x: nebulaTransforms[i].x,
            y: nebulaTransforms[i].y,
          }}
        />
      ))}

      {/* Particle canvas — no whole-canvas shift; per-layer shift is done in draw() */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      />
    </>
  );
}
