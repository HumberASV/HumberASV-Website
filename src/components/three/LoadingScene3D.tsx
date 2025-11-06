import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Group } from "three";

// Gentle Underwater Caustics Effect
const UnderwaterCaustics = () => {
  const groupRef = useRef<Group>(null!);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((caustic, index) => {
        const speed = 0.5 + index * 0.3;
        const moveX = Math.sin(state.clock.elapsedTime * speed) * 0.5;
        const moveY = Math.cos(state.clock.elapsedTime * speed * 0.7) * 0.3;

        caustic.position.x = moveX;
        caustic.position.y = moveY;
        caustic.rotation.z = state.clock.elapsedTime * 0.1;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {/* Subtle light patterns */}
      {[...Array(3)].map((_, i) => (
        <mesh
          key={i}
          position={[0, 0, -4 + i * 2]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[8, 8, 8, 8]} />
          <meshBasicMaterial
            color="#00435c"
            wireframe
            opacity={0.1 + i * 0.05}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
};

// Proper Nautical Anchor with Curved Tips
const NauticalAnchor = () => {
  const anchorRef = useRef<Group>(null!);

  useFrame((state) => {
    if (anchorRef.current) {
      // Very gentle floating animation
      anchorRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      anchorRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
    }
  });

  return (
    <group ref={anchorRef} position={[0, 0, 0]}>
      {/* Anchor shank - main vertical part */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 1.2, 8]} />
        <meshStandardMaterial color="#00435c" metalness={0.7} roughness={0.4} />
      </mesh>

      {/* Anchor ring */}
      <mesh position={[0, 1.0, 0]}>
        <torusGeometry args={[0.12, 0.02, 8, 16]} />
        <meshStandardMaterial color="#a3e7ff" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Anchor arms with curved flukes */}
      <group position={[0, 0, 0]}>
        {/* Left arm with curved fluke */}
        <group position={[-0.3, -0.3, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <mesh>
            <boxGeometry args={[0.6, 0.08, 0.08]} />
            <meshStandardMaterial
              color="#00435c"
              metalness={0.7}
              roughness={0.4}
            />
          </mesh>
          {/* Curved fluke tip */}
          <mesh position={[-0.35, 0, 0]} rotation={[0, 0, Math.PI / 3]}>
            <coneGeometry args={[0.08, 0.3, 8]} />
            <meshStandardMaterial
              color="#006687"
              metalness={0.6}
              roughness={0.5}
            />
          </mesh>
        </group>

        {/* Right arm with curved fluke */}
        <group position={[0.3, -0.3, 0]} rotation={[0, 0, Math.PI / 4]}>
          <mesh>
            <boxGeometry args={[0.6, 0.08, 0.08]} />
            <meshStandardMaterial
              color="#00435c"
              metalness={0.7}
              roughness={0.4}
            />
          </mesh>
          {/* Curved fluke tip */}
          <mesh position={[0.35, 0, 0]} rotation={[0, 0, -Math.PI / 3]}>
            <coneGeometry args={[0.08, 0.3, 8]} />
            <meshStandardMaterial
              color="#006687"
              metalness={0.6}
              roughness={0.5}
            />
          </mesh>
        </group>
      </group>

      {/* Bottom stock */}
      <mesh position={[0, -0.8, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.8, 0.06, 0.06]} />
        <meshStandardMaterial color="#00435c" metalness={0.7} roughness={0.4} />
      </mesh>
    </group>
  );
};

// Layered Bubbles with Depth
const LayeredBubbles = () => {
  const frontBubblesRef = useRef<Group>(null!);
  const middleBubblesRef = useRef<Group>(null!);
  const backBubblesRef = useRef<Group>(null!);

  useFrame(() => {
    // Front bubbles (fastest)
    if (frontBubblesRef.current) {
      frontBubblesRef.current.children.forEach((bubble, i) => {
        const speed = 0.02 + (i % 3) * 0.005;
        bubble.position.y += speed;
        bubble.rotation.y += 0.02;

        if (bubble.position.y > 3) {
          bubble.position.set(
            (Math.random() - 0.5) * 4,
            -2,
            (Math.random() - 0.5) * 1 + 0.5
          );
        }
      });
    }

    // Middle bubbles (medium speed)
    if (middleBubblesRef.current) {
      middleBubblesRef.current.children.forEach((bubble, i) => {
        const speed = 0.015 + (i % 3) * 0.004;
        bubble.position.y += speed;
        bubble.rotation.y += 0.015;

        if (bubble.position.y > 3) {
          bubble.position.set(
            (Math.random() - 0.5) * 5,
            -2.5,
            (Math.random() - 0.5) * 2
          );
        }
      });
    }

    // Back bubbles (slowest)
    if (backBubblesRef.current) {
      backBubblesRef.current.children.forEach((bubble, i) => {
        const speed = 0.01 + (i % 3) * 0.003;
        bubble.position.y += speed;
        bubble.rotation.y += 0.01;

        if (bubble.position.y > 3) {
          bubble.position.set(
            (Math.random() - 0.5) * 6,
            -3,
            (Math.random() - 0.5) * 3 - 1
          );
        }
      });
    }
  });

  return (
    <>
      {/* Back bubbles - smallest, slowest, most transparent */}
      <group ref={backBubblesRef}>
        {[...Array(8)].map((_, i) => (
          <mesh
            key={`back-${i}`}
            position={[
              (Math.random() - 0.5) * 8,
              (Math.random() - 0.5) * 2 - 3,
              (Math.random() - 0.5) * 4 - 2,
            ]}
            scale={0.04 + (i % 3) * 0.01}
          >
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial
              color="#002e3e"
              transparent
              opacity={0.3}
              metalness={0.2}
              roughness={0.6}
            />
          </mesh>
        ))}
      </group>

      {/* Middle bubbles - medium size and speed */}
      <group ref={middleBubblesRef}>
        {[...Array(12)].map((_, i) => (
          <mesh
            key={`middle-${i}`}
            position={[
              (Math.random() - 0.5) * 6,
              (Math.random() - 0.5) * 3 - 2.5,
              (Math.random() - 0.5) * 2 - 0.5,
            ]}
            scale={0.06 + (i % 4) * 0.015}
          >
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial
              color="#00435c"
              transparent
              opacity={0.5}
              metalness={0.3}
              roughness={0.5}
            />
          </mesh>
        ))}
      </group>

      {/* Front bubbles - largest, fastest, most opaque */}
      <group ref={frontBubblesRef}>
        {[...Array(6)].map((_, i) => (
          <mesh
            key={`front-${i}`}
            position={[
              (Math.random() - 0.5) * 4,
              (Math.random() - 0.5) * 4 - 2,
              (Math.random() - 0.5) * 1 + 1,
            ]}
            scale={0.08 + (i % 3) * 0.02}
          >
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial
              color="#006687"
              transparent
              opacity={0.7}
              metalness={0.4}
              roughness={0.4}
            />
          </mesh>
        ))}
      </group>
    </>
  );
};

// Main Loading Scene Component
export const LoadingScene3D: React.FC = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      style={{
        width: "100%",
        height: "100%",
        background: "transparent",
      }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.4} color="#00435c" />
      <directionalLight position={[2, 3, 2]} intensity={0.6} color="#a3e7ff" />
      <pointLight position={[0, 2, 3]} intensity={0.3} color="#006687" />

      <UnderwaterCaustics />
      <NauticalAnchor />
      <LayeredBubbles />
    </Canvas>
  );
};
