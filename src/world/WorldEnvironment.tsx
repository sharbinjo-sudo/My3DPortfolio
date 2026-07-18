export function WorldEnvironment() {
  return (
    <>
      <color attach="background" args={["#050914"]} />
      <fog attach="fog" args={["#050914", 13, 34]} />

      <ambientLight intensity={0.8} />
      <directionalLight
        castShadow
        position={[6, 10, 5]}
        intensity={2.1}
        color="#c8f4ff"
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight
        position={[-6, 3, -6]}
        intensity={24}
        distance={16}
        color="#367dff"
      />
      <pointLight
        position={[6, 3, -9]}
        intensity={20}
        distance={16}
        color="#9b5cff"
      />

      <mesh
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.02, -7]}
      >
        <planeGeometry args={[30, 34]} />
        <meshStandardMaterial
          color="#081020"
          metalness={0.25}
          roughness={0.82}
        />
      </mesh>

      <gridHelper
        args={[34, 34, "#255c82", "#10253d"]}
        position={[0, 0.015, -7]}
      />

      <mesh position={[0, 3, -22]}>
        <boxGeometry args={[22, 6, 0.5]} />
        <meshStandardMaterial
          color="#080d1b"
          emissive="#10214a"
          emissiveIntensity={0.22}
        />
      </mesh>
    </>
  );
}
