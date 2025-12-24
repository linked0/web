import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const sunVertexShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`

const sunFragmentShader = `
    uniform float time;
    varying vec2 vUv;
    varying vec3 vNormal;

    void main() {
        float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
        vec3 color = vec3(1.0, 0.4, 0.1) * (1.0 + 0.5 * sin(time * 0.5 + vUv.y * 10.0));
        color += vec3(1.0, 0.9, 0.3) * intensity;
        gl_FragColor = vec4(color, 1.0);
    }
`

export function Sun() {
    const meshRef = useRef<THREE.Mesh>(null!)
    const materialRef = useRef<THREE.ShaderMaterial>(null!)

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.time.value = state.clock.getElapsedTime()
        }
        meshRef.current.rotation.y += 0.002
    })

    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[5, 64, 64]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={sunVertexShader}
                fragmentShader={sunFragmentShader}
                uniforms={{
                    time: { value: 0 }
                }}
            />
            {/* Volumetric Halo */}
            <mesh scale={[1.2, 1.2, 1.2]}>
                <sphereGeometry args={[5, 64, 64]} />
                <meshBasicMaterial
                    color="#ff6600"
                    transparent
                    opacity={0.15}
                    side={THREE.BackSide}
                />
            </mesh>
            <pointLight intensity={2.5} distance={100} color="#ffaa00" />
        </mesh>
    )
}
