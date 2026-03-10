'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useStore } from '@/lib/store';
import { useSeedData } from '@/hooks/useSeedData';
import GraphCanvas from '@/components/graph/GraphCanvas';
import ParticleBackground from '@/components/graph/ParticleBackground';
import DetailPanel from '@/components/panels/DetailPanel';
import SummaryPanel from '@/components/panels/SummaryPanel';
import Header from '@/components/layout/Header';
import Legend from '@/components/layout/Legend';

export default function Home() {
  const [hydrated, setHydrated] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

  // Subtle 3D tilt effect tracking mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20 });
  const rotateX = useTransform(springY, [-1, 1], [1.5, -1.5]);
  const rotateY = useTransform(springX, [-1, 1], [-1.5, 1.5]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height } = (currentTarget as HTMLElement).getBoundingClientRect();
    mouseX.set((clientX / width - 0.5) * 2);
    mouseY.set((clientY / height - 0.5) * 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  useEffect(() => {
    const unsub = useStore.persist?.onFinishHydration?.(() => setHydrated(true));
    const t = setTimeout(() => setHydrated(true), 80);
    return () => { clearTimeout(t); unsub?.(); };
  }, []);

  useSeedData();

  if (!hydrated) {
    return (
      <div
        className="w-screen h-screen flex items-center justify-center"
        style={{ background: 'radial-gradient(ellipse at center, #1a0a2e 0%, #080612 100%)' }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="text-4xl animate-pulse" style={{ filter: 'drop-shadow(0 0 20px rgba(234,179,8,0.5))' }}>
            ⚔️
          </div>
          <div className="text-sm tracking-widest" style={{ color: '#6b5028' }}>
            Loading Skill Matrix...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 20% 20%, #1a0a2e 0%, #0f0a1a 40%, #080612 100%)' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Animated particle background — parallax layer */}
      <ParticleBackground mouseX={springX} mouseY={springY} />

      {/* Header — above everything, always interactive */}
      <Header onToggleSummary={() => setSummaryOpen((v) => !v)} summaryOpen={summaryOpen} />

      {/* Summary panel dropdown */}
      <SummaryPanel open={summaryOpen} onClose={() => setSummaryOpen(false)} />

      {/* Graph canvas with subtle 3D tilt */}
      <motion.div
        className="absolute inset-0 pt-12"
        style={{
          zIndex: 1,
          rotateX,
          rotateY,
          perspective: 1200,
          transformStyle: 'preserve-3d',
        }}
      >
        <GraphCanvas />
      </motion.div>

      {/* Detail panel — positioned to the right, no full-screen wrapper blocking clicks */}
      <DetailPanel />

      {/* Legend */}
      <Legend />
    </div>
  );
}
