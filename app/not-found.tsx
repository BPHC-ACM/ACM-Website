'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import AnimatedTechBackground from '@/components/animated-tech-background';
import { motion } from 'framer-motion';
import { Ghost, Bug, TerminalSquare } from 'lucide-react';

const memeMessages = [
  'This page went out for milk and never returned.',
  'Undefined route - much like your last variable.',
  'This URL was last seen on GitHub Issues.',
  'Page not found. Commit history shows it got lost along the way.',
  'Lost somewhere in recursion. Try breaking out of the matrix.',
  'This link expired faster than your free trial.',
  'Oops, wrong URL path. This page lives on a different street.',
  'Like your WiFi at 3 AM, this page is missing.',
  "SIGSEGV: Segmentation fault. Nah just kidding! We wouldn't do that.",
  'This endpoint is sleeping, like your backend intern.',
  'This request timed out waiting for inner peace.',
  'This route was stolen away by the compiler.',
  'Page not found. But did you check npm install?',
  'This page rage-quit the project.',
  'Looks like you branched, but never merged back.',
  'Page not found. Retry after coffee upgrade.',
];

export default function NotFoundPage() {
  const randomMsg = memeMessages[Math.floor(Math.random() * memeMessages.length)];

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-card overflow-hidden">
      <AnimatedTechBackground />
      <div className="container relative z-10 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, type: 'spring' }}
          className="mb-8"
        >
          <div className="flex justify-center gap-4 mb-4">
            <motion.div
              whileHover={{ rotate: 20, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Ghost className="h-12 w-12 text-primary" />
            </motion.div>
            <motion.div
              whileHover={{ rotate: -20, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Bug className="h-12 w-12 text-teal-500" />
            </motion.div>
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <TerminalSquare className="h-12 w-12 text-pink-500" />
            </motion.div>
          </div>
          <motion.h1
            className="text-6xl md:text-8xl font-extrabold heading-gradient mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            404
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-muted-foreground font-mono mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {randomMsg}
          </motion.p>
          <motion.p
            className="text-base text-muted-foreground mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            But hey, at least you found our cool background. <br />
            Maybe try debugging your URL?
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            <Button asChild size="lg" className="hover-lift hover-glow">
              <Link href="/">Back to Home</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
