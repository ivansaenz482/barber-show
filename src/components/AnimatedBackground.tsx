export default function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute -left-40 top-[-10%] h-[36rem] w-[36rem] rounded-full bg-primary/15 blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-15%] h-[32rem] w-[32rem] rounded-full bg-accent/10 blur-[100px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(10,10,10,0.9)_100%)]" />
    </div>
  )
}
