import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/cannon'
import Scene from './components/Scene'
import Sidebar from './components/Sidebar'
import Toolbar from './components/Toolbar'

export default function App() {
  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Left panel */}
      <Sidebar />

      {/* 3D canvas area */}
      <div style={{ flex: 1, position: 'relative' }}>
        <Canvas
          shadows
          camera={{ position: [22, 18, 22], fov: 48 }}
          gl={{ antialias: true }}
          style={{ background: '#87CEEB' }}
        >
          <Suspense fallback={null}>
            <Physics gravity={[0, -9.81, 0]} broadphase="SAP" allowSleep>
              <Scene />
            </Physics>
          </Suspense>
        </Canvas>

        {/* HUD overlay — sits on top of the canvas */}
        <Toolbar />
      </div>
    </div>
  )
}
