'use client';

import { motion } from 'framer-motion';
import { Skeleton } from '@kit/ui/skeleton';
import { Card, CardContent } from '@kit/ui/card';

export function InvitationLoading() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut' as const
      }
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Floating Background Elements */}
      <motion.div 
        className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-rose-200/30 to-pink-200/30 rounded-full blur-2xl"
        animate={{ 
          y: [0, -20, 0],
          x: [0, 15, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
      <motion.div 
        className="absolute bottom-32 left-20 w-40 h-40 bg-gradient-to-br from-pink-200/20 to-rose-200/20 rounded-full blur-2xl"
        animate={{ 
          y: [0, 25, 0],
          x: [0, -10, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2
        }}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-2xl relative z-10">
        <motion.div 
          className="mb-8"
          variants={itemVariants}
        >
          <motion.div
            animate={{ 
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 1.02, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <Skeleton className="h-96 w-full rounded-2xl" />
          </motion.div>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="mb-8 backdrop-blur-sm bg-white/80 border-white/20">
            <CardContent className="p-6">
              <motion.div 
                className="space-y-4"
                variants={containerVariants}
              >
                <motion.div variants={itemVariants}>
                  <motion.div
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: 0
                    }}
                  >
                    <Skeleton className="h-6 w-32 rounded-lg" />
                  </motion.div>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <motion.div
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: 0.2
                    }}
                  >
                    <Skeleton className="h-4 w-48 rounded-lg" />
                  </motion.div>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <motion.div
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: 0.4
                    }}
                  >
                    <Skeleton className="h-6 w-24 rounded-lg" />
                  </motion.div>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <motion.div
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: 0.6
                    }}
                  >
                    <Skeleton className="h-4 w-64 rounded-lg" />
                  </motion.div>
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <motion.div
            animate={{ 
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 1.01, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.8
            }}
          >
            <Skeleton className="h-12 w-full mb-4 rounded-xl" />
          </motion.div>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ 
              duration: 1.8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1
            }}
            className="flex justify-center"
          >
            <Skeleton className="h-4 w-48 rounded-lg" />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
} 