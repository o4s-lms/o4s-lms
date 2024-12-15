'use client';
import { useHeaderTheme } from '@/providers/HeaderTheme';
import React, { useEffect } from 'react';

import { HeroHighlight, Highlight } from '@/components/ui/hero-highlight';
import { motion } from 'framer-motion';
import { Media } from '@/components/Media';

interface HighLightProps {
  msg: string;
  highlightMsg: string;
}

export const HighLight: React.FC<HighLightProps> = ({ msg, highlightMsg }) => {
  const media = null;

  return (
    <div className="relative -mt-[10.4rem] flex items-center justify-center">
      <div className="container relative z-10 mb-8 flex justify-center">
        <HeroHighlight>
          <motion.h1
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: [20, -5, 0],
            }}
            transition={{
              duration: 0.5,
              ease: [0.4, 0.0, 0.2, 1],
            }}
            className="mx-auto max-w-3xl px-4 text-center text-2xl font-bold leading-relaxed text-neutral-700 md:text-4xl lg:text-5xl lg:leading-snug dark:text-white"
          >
            {msg}{' '}
            <Highlight className="text-black dark:text-white">
              {highlightMsg}
            </Highlight>
          </motion.h1>
        </HeroHighlight>
      </div>
      <div className="min-h-[80vh] select-none">
        {media && typeof media === 'object' && (
          <Media
            fill
            imgClassName="-z-10 object-cover"
            priority={false}
            loading="lazy"
            resource={media}
          />
        )}
      </div>
    </div>
  );
};
