import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import useUIStore from '../../store/uiStore';

function AbstractNetwork({ count = 50 }) {
  const groupRef = useRef();

  const { positions, lines } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }

    const lineIndices = [];
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 2.5) {
          lineIndices.push(i, j);
        }
      }
    }

    return { positions: pos, lines: new Uint16Array(lineIndices) };
  }, [count]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={groupRef}>
        {/* Nodes */}
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={count}
              array={positions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.06}
            color="#3b82f6"
            transparent
            opacity={0.8}
            sizeAttenuation
          />
        </points>

        {/* Connections */}
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={count}
              array={positions}
              itemSize={3}
            />
            <bufferAttribute
              attach="index"
              array={lines}
              itemSize={1}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#6366f1" transparent opacity={0.15} />
        </lineSegments>
      </group>
    </Float>
  );
}

function ParticleField({ count = 300 }) {
  const pointsRef = useRef();

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#0ea5e9"
        transparent
        opacity={0.3}
        sizeAttenuation
      />
    </points>
  );
}

export default function HeroScene() {
  const { performanceTier } = useUIStore();
  const particleCount = performanceTier === 'high' ? 400 : performanceTier === 'mid' ? 150 : 50;
  const nodeCount = performanceTier === 'high' ? 80 : performanceTier === 'mid' ? 50 : 30;

  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 55 }}
      gl={{ antialias: performanceTier === 'high', alpha: true, powerPreference: 'high-performance' }}
      dpr={performanceTier === 'low' ? 1 : [1, 1.5]}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={0.5} color="#3b82f6" />
      <pointLight position={[-5, -5, -5]} intensity={0.3} color="#6366f1" />

      <AbstractNetwork count={nodeCount} />
      <ParticleField count={particleCount} />
    </Canvas>
  );
}
