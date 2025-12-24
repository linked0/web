import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function Human() {
    const groupRef = useRef<THREE.Group>(null!)

    useFrame((state) => {
        // Subtle breathing animation
        groupRef.current.position.y += Math.sin(state.clock.getElapsedTime() * 2) * 0.0005
    })

    return (
        <group ref={groupRef} scale={[0.08, 0.08, 0.08]}>
            {/* Body */}
            <mesh position={[0, 1, 0]} castShadow>
                <capsuleGeometry args={[0.5, 1, 4, 8]} />
                <meshStandardMaterial color="white" />
            </mesh>

            {/* Head / Helmet */}
            <mesh position={[0, 2.2, 0]} castShadow>
                <sphereGeometry args={[0.4, 16, 16]} />
                <meshStandardMaterial color="white" />
            </mesh>

            {/* Visor */}
            <mesh position={[0, 2.3, 0.3]}>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshStandardMaterial color="#333" roughness={0} metalness={1} />
            </mesh>

            {/* Arms */}
            <mesh position={[0.7, 1.2, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow>
                <capsuleGeometry args={[0.15, 0.5, 4, 8]} />
                <meshStandardMaterial color="white" />
            </mesh>
            <mesh position={[-0.7, 1.2, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
                <capsuleGeometry args={[0.15, 0.5, 4, 8]} />
                <meshStandardMaterial color="white" />
            </mesh>

            {/* Backpack (PLSS) */}
            <mesh position={[0, 1.2, -0.4]} castShadow>
                <boxGeometry args={[0.8, 1, 0.4]} />
                <meshStandardMaterial color="#eee" />
            </mesh>
        </group>
    )
}
