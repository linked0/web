import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Float } from '@react-three/drei'
import * as THREE from 'three'

interface PlanetProps {
    name: string
    color: string
    distance: number
    size: number
    speed: number
    hasRings?: boolean
    active?: boolean
    onClick?: () => void
    children?: React.ReactNode
}

export function Planet({ name, color, distance, size, speed, hasRings, active, onClick, children }: PlanetProps) {
    const meshRef = useRef<THREE.Mesh>(null!)
    const orbitRef = useRef<THREE.Group>(null!)

    useFrame((state) => {
        const t = state.clock.getElapsedTime() * speed
        orbitRef.current.rotation.y = t
        meshRef.current.rotation.y += 0.01
    })

    return (
        <group ref={orbitRef}>
            <group position={[distance, 0, 0]}>
                <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                    <group>
                        {children}
                        {/* Planet Mesh */}
                        <mesh ref={meshRef} onClick={onClick} castShadow receiveShadow>
                            <sphereGeometry args={[size, 32, 32]} />
                            <meshStandardMaterial
                                color={color}
                                roughness={0.7}
                                metalness={0.2}
                                emissive={active ? color : 'black'}
                                emissiveIntensity={active ? 0.3 : 0}
                            />
                        </mesh>

                        {/* Atmospheric Glow */}
                        <mesh scale={[1.15, 1.15, 1.15]}>
                            <sphereGeometry args={[size, 32, 32]} />
                            <meshBasicMaterial
                                color={color}
                                transparent
                                opacity={0.1}
                                side={THREE.BackSide}
                            />
                        </mesh>

                        {/* Saturn's Rings */}
                        {hasRings && (
                            <mesh rotation={[Math.PI / 2.5, 0, 0]}>
                                <ringGeometry args={[size * 1.4, size * 2.2, 64]} />
                                <meshStandardMaterial
                                    color={color}
                                    transparent
                                    opacity={0.6}
                                    side={THREE.DoubleSide}
                                    roughness={1}
                                />
                            </mesh>
                        )}
                    </group>
                </Float>
                <Text
                    position={[0, size + 1.5, 0]}
                    fontSize={0.6}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                >
                    {name}
                </Text>
            </group>
            {/* Orbit path */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[distance - 0.05, distance + 0.05, 128]} />
                <meshBasicMaterial color="white" transparent opacity={0.1} side={THREE.DoubleSide} />
            </mesh>
        </group>
    )
}
