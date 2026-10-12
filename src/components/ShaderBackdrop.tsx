import { ShaderGradient, ShaderGradientCanvas } from '@shadergradient/react'

export default function ShaderBackdrop() {
  return (
    <ShaderGradientCanvas
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      pixelDensity={1}
      fov={45}
      pointerEvents="none"
      lazyLoad
      preserveDrawingBuffer={false}
      powerPreference="high-performance"
    >
      <ShaderGradient
        control="props"
        type="waterPlane"
        animate="on"
        uSpeed={0.18}
        uStrength={2.6}
        uDensity={1.1}
        uFrequency={5.2}
        uAmplitude={2.2}
        color1="#080808"
        color2="#0f766e"
        color3="#d4af37"
        lightType="3d"
        brightness={0.95}
        grain="on"
        grainBlending={0.35}
        cAzimuthAngle={180}
        cPolarAngle={82}
        cDistance={3.4}
        cameraZoom={1}
        reflection={0.12}
      />
    </ShaderGradientCanvas>
  )
}
