import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export const CommandCenterBackground: React.FC = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 120 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const layer1X = useTransform(smoothX, [-500, 500], [-25, 25]);
  const layer1Y = useTransform(smoothY, [-500, 500], [-15, 15]);
  
  const layer2X = useTransform(smoothX, [-500, 500], [35, -35]);
  const layer2Y = useTransform(smoothY, [-500, 500], [25, -25]);

  const layer3X = useTransform(smoothX, [-500, 500], [-20, 20]);
  const layer3Y = useTransform(smoothY, [-500, 500], [18, -18]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set(clientX - innerWidth / 2);
    mouseY.set(clientY - innerHeight / 2);
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    >
      {/* Ribbon 1: Deep Blue + Indigo */}
      <motion.div
        style={{ x: layer1X, y: layer1Y }}
        animate={{
          rotate: [0, 6, -5, 0],
          scale: [1, 1.05, 0.96, 1],
          borderRadius: ['40% 60% 70% 30% / 40% 50% 60% 50%', '60% 40% 30% 70% / 50% 60% 40% 60%', '40% 60% 70% 30% / 40% 50% 60% 50%']
        }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-32 right-0 w-[700px] h-[550px] bg-gradient-to-br from-[#173B8F]/20 via-[#4F46E5]/15 to-transparent blur-[100px] rounded-full opacity-60"
      />

      {/* Ribbon 2: Cyan + Teal Flowing Wave */}
      <motion.div
        style={{ x: layer2X, y: layer2Y }}
        animate={{
          rotate: [-8, 4, -10, -8],
          scale: [0.95, 1.08, 1, 0.95],
          borderRadius: ['50% 50% 30% 70% / 60% 40% 60% 40%', '30% 70% 60% 40% / 40% 60% 50% 50%', '50% 50% 30% 70% / 60% 40% 60% 40%']
        }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/3 left-1/3 w-[800px] h-[500px] bg-gradient-to-r from-[#22D3EE]/15 via-[#14B8A6]/12 to-[#34D399]/10 blur-[120px] rounded-full opacity-50"
      />

      {/* Ribbon 3: Soft Blue + Indigo Ambient Aurora */}
      <motion.div
        style={{ x: layer3X, y: layer3Y }}
        animate={{
          rotate: [4, -8, 6, 4],
          scale: [1.04, 0.92, 1.04],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-0 -left-40 w-[650px] h-[450px] bg-gradient-to-tr from-[#3B82F6]/15 via-[#6366F1]/12 to-transparent blur-[110px] rounded-full opacity-50"
      />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_70%,transparent_100%)]" />
    </div>
  );
};
