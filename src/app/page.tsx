'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useStore } from '@/lib/store';
import { useSeedData } from '@/hooks/useSeedData';
import GraphCanvas from '@/components/graph/GraphCanvas';
import DetailPanel from '@/components/panels/DetailPanel';
import SummaryPanel from '@/components/panels/SummaryPanel';
import Header from '@/components/layout/Header';
import Legend from '@/components/layout/Legend';
import MatrixView from '@/components/views/MatrixView';

export default function Home() {
  const [hydrated, setHydrated] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [activeView, setActiveView] = useState<'graph' | 'matrix'>('graph');

  // Subtle 3D tilt effect tracking mouse position (graph view only)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20 });
  const rotateX = useTransform(springY, [-1, 1], [1.5, -1.5]);
  const rotateY = useTransform(springX, [-1, 1], [-1.5, 1.5]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (activeView !== 'graph') return;
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
          <div
            className="animate-pulse"
            style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.4)' }}
          />
          <div className="text-sm tracking-widest" style={{ color: '#334155', letterSpacing: '0.12em' }}>
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 25% 25%, #0a1628 0%, #060e1c 45%, #030810 100%)' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Header */}
      <Header
        onToggleSummary={() => setSummaryOpen((v) => !v)}
        summaryOpen={summaryOpen}
        activeView={activeView}
        onViewChange={(v) => {
          setActiveView(v);
          setSummaryOpen(false);
        }}
      />

      {/* Summary panel dropdown */}
      <SummaryPanel open={summaryOpen} onClose={() => setSummaryOpen(false)} />

      <AnimatePresence mode="wait">
        {activeView === 'graph' ? (
          <motion.div
            key="graph"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0"
            style={{ zIndex: 1 }}
          >
            {/* Graph canvas with subtle 3D tilt */}
            <motion.div
              className="absolute inset-0 pt-12"
              style={{
                rotateX,
                rotateY,
                perspective: 1200,
                transformStyle: 'preserve-3d',
              }}
            >
              <GraphCanvas />
            </motion.div>

            {/* Detail panel */}
            <DetailPanel />

            {/* Legend */}
            <Legend />
          </motion.div>
        ) : (
          <motion.div
            key="matrix"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
            style={{ zIndex: 1 }}
          >
            <MatrixView />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
