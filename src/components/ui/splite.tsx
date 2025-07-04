'use client'

import { Suspense, lazy, memo } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

interface SplineSceneProps {
  scene: string
  className?: string
}

// Memoize the component to prevent unnecessary re-renders
export const SplineScene = memo(function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <Suspense 
      fallback={
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-400/10 to-blue-500/10 rounded-lg">
          <div className="text-center">
            <div className="text-6xl mb-4 opacity-20">🤖</div>
            <p className="text-white/70">3D Scene Loading...</p>
          </div>
        </div>
      }
    >
      <Spline
        scene={scene}
        className={className}
        style={{ 
          pointerEvents: 'auto',
          willChange: 'transform'
        }}
      />
    </Suspense>
  )
})
