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
  layer: number;
}

interface Props {
  mouseX?: MotionValue<number>;
  mouseY?: MotionValue<number>;
  isDark?: boolean;
}

const LAYER_PARALLAX = { 1: 6, 2: 16, 3: 32, 4: 55 };

// Dark theme — vivid blue/slate particles
const LAYER_COLOR_DARK: Record<number, [number, number, number]> = {
  1: [70,  110, 180],
  2: [90,  140, 210],
  3: [110, 165, 235],
  4: [150, 200, 255],
};
// Light theme — subtle steel-blue particles (barely visible)
const LAYER_COLOR_LIGHT: Record<number, [number, number, number]> = {
  1: [130, 150, 185],
  2: [115, 135, 175],
  3: [100, 120, 165],
  4: [85,  105, 155],
};

const LAYER_SIZE: Record<number, [number, number]> = {
  1: [0.3, 0.5],
  2: [0.5, 0.6],
  3: [0.8, 1.0],
  4: [1.3, 1.1],
};

const LAYER_OPACITY_MAX_DARK:  Record<number, number> = { 1: 0.28, 2: 0.38, 3: 0.48, 4: 0.6 };
const LAYER_OPACITY_MAX_LIGHT: Record<number, number> = { 1: 0.05, 2: 0.08, 3: 0.11, 4: 0.16 };

const LAYER_WEIGHT = { 1: 4, 2: 2.5, 3: 1.2, 4: 0.3 };

const NEBULAE = [
  { cx: 0.15, cy: 0.2,  r: 0.4,  color: '30, 70, 160',  opacity: 0.045, parallax: 0.25 },
  { cx: 0.82, cy: 0.7,  r: 0.45, color: '20, 55, 140',  opacity: 0.038, parallax: 0.18 },
  { cx: 0.5,  cy: 0.88, r: 0.32, color: '15, 50, 130',  opacity: 0.032, parallax: 0.3  },
  { cx: 0.88, cy: 0.12, r: 0.3,  color: '35, 75, 155',  opacity: 0.028, parallax: 0.12 },
  { cx: 0.22, cy: 0.78, r: 0.28, color: '25, 60, 145',  opacity: 0.028, parallax: 0.35 },
];

export default function ParticleBackground({ mouseX, mouseY, isDark = true }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDarkRef = useRef(isDark);

  // Track isDark changes so the draw loop picks them up without restarting
  useEffect(() => { isDarkRef.current = isDark; }, [isDark]);

  const fallbackX = useMotionValue(0);
  const fallbackY = useMotionValue(0);
  const rawX = mouseX ?? fallbackX;
  const rawY = mouseY ?? fallbackY;

  const smoothX = useSpring(rawX, { stiffness: 60, damping: 25 });
  const smoothY = useSpring(rawY, { stiffness: 60, damping: 25 });

  const mouseRef = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const unsubX = smoothX.on('change', (v) => { mouseRef.current.x = v; });
    const unsubY = smoothY.on('change', (v) => { mouseRef.current.y = v; });
    return () => { unsubX(); unsubY(); };
  }, [smoothX, smoothY]);

  // Nebula parallax transforms (hooks must stay at top level)
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
    { x: n0x, y: n0y }, { x: n1x, y: n1y }, { x: n2x, y: n2y },
    { x: n3x, y: n3y }, { x: n4x, y: n4y },
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
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createParticles() {
      if (!canvas) return;
      particles = [];
      const base = Math.floor((canvas.width * canvas.height) / 5000);
      const opMax = isDarkRef.current ? LAYER_OPACITY_MAX_DARK : LAYER_OPACITY_MAX_LIGHT;
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
            opacity: Math.random() * opMax[layer] * 0.6 + 0.01,
            opacityDelta: (Math.random() - 0.5) * 0.003,
            layer,
          });
        }
      }
    }

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const dark  = isDarkRef.current;
      const color = dark ? LAYER_COLOR_DARK : LAYER_COLOR_LIGHT;
      const opMax = dark ? LAYER_OPACITY_MAX_DARK : LAYER_OPACITY_MAX_LIGHT;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (let layer = 1; layer <= 4; layer++) {
        const offsetX = mx * LAYER_PARALLAX[layer as keyof typeof LAYER_PARALLAX];
        const offsetY = my * LAYER_PARALLAX[layer as keyof typeof LAYER_PARALLAX];
        const [r, g, b] = color[layer];
        const maxOp = opMax[layer];

        ctx.save();
        ctx.translate(offsetX, offsetY);

        particles
          .filter((p) => p.layer === layer)
          .forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;
            p.opacity += p.opacityDelta;

            if (p.opacity <= 0.01 || p.opacity >= maxOp) p.opacityDelta *= -1;
            if (p.x < -100) p.x = canvas.width  + 100;
            if (p.x > canvas.width  + 100) p.x = -100;
            if (p.y < -100) p.y = canvas.height + 100;
            if (p.y > canvas.height + 100) p.y = -100;

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
      {/* Nebula blobs — dark themes only (look bad on light backgrounds) */}
      {isDark && NEBULAE.map((n, i) => (
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

      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      />
    </>
  );
}
