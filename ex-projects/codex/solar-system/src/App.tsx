import { useState, Suspense, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei'
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun } from './components/Sun'
import { Planet } from './components/Planet'
import { AIAgent } from './components/AIAgent'
import { Satellite, Target } from 'lucide-react'

const PLANETS = [
    { name: 'Mercury', color: '#A5A5A5', distance: 10, size: 0.8, speed: 0.04 },
    { name: 'Venus', color: '#E3BB76', distance: 15, size: 1.2, speed: 0.015 },
    { name: 'Earth', color: '#2233FF', distance: 20, size: 1.2, speed: 0.01 },
    { name: 'Mars', color: '#E27B58', distance: 25, size: 1, speed: 0.008 },
    { name: 'Jupiter', color: '#D39C7E', distance: 35, size: 3, speed: 0.002 },
    { name: 'Saturn', color: '#C5AB6E', distance: 45, size: 2.5, speed: 0.0009, hasRings: true },
    { name: 'Uranus', color: '#B5E3E3', distance: 55, size: 1.8, speed: 0.0004 },
    { name: 'Neptune', color: '#6081FF', distance: 65, size: 1.8, speed: 0.0001 },
]

export default function App() {
    const [activePlanet, setActivePlanet] = useState<string | null>(null)

    const handlePlanetSelect = useCallback((name: string) => {
        setActivePlanet(name)
    }, [])

    return (
        <div className="w-full h-screen bg-black">
            {/* UI Overlay */}
            <div className="absolute top-8 left-8 z-10 pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 mb-2"
                >
                    <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
                        <Satellite className="text-blue-400 w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-white/90">Solar Explorer</h1>
                        <p className="text-xs text-white/40 uppercase tracking-[0.2em]">Codex Experiment v1.0</p>
                    </div>
                </motion.div>
            </div>

            <AnimatePresence>
                {activePlanet && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute top-8 right-8 z-10 pointer-events-auto"
                    >
                        <div className="glass p-6 rounded-2xl w-64 shadow-2xl">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold">{activePlanet}</h2>
                                    <span className="text-[10px] text-blue-400 font-semibold tracking-widest uppercase">Target Locked</span>
                                </div>
                                <button
                                    onClick={() => setActivePlanet(null)}
                                    className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <Target size={16} className="text-white/40" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-blue-500"
                                            initial={{ width: 0 }}
                                            animate={{ width: '100%' }}
                                            transition={{ duration: 1 }}
                                        />
                                    </div>
                                </div>
                                <p className="text-xs text-white/60 leading-relaxed">
                                    Real-time telemetry established. Scanning planetary surface...
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Canvas shadows gl={{ antialias: false }}>
                <Suspense fallback={null}>
                    <PerspectiveCamera makeDefault position={[30, 30, 30]} fov={50} />
                    <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} fade speed={1} />
                    <ambientLight intensity={0.2} />
                    <Sun />
                    {PLANETS.map((planet) => (
                        <Planet
                            key={planet.name}
                            {...planet}
                            active={activePlanet === planet.name}
                            onClick={() => handlePlanetSelect(planet.name)}
                        />
                    ))}
                    <OrbitControls enablePan={false} minDistance={10} maxDistance={200} autoRotate={!activePlanet} autoRotateSpeed={0.5} makeDefault />
                    <EffectComposer>
                        <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.5} radius={0.4} />
                        <Noise opacity={0.05} />
                        <Vignette eskil={false} offset={0.1} darkness={1.1} />
                    </EffectComposer>
                </Suspense>
            </Canvas>
            <AIAgent onPlanetSelect={handlePlanetSelect} />
        </div>
    )
}
