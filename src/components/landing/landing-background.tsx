import Image from "next/image";

import tentaclesOverlay from "../../../assets/bg-tentacles.svg";

export function LandingBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      data-testid="landing-radial-background"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,var(--ml-bg-radial-center)_0%,var(--ml-bg-page)_34%,var(--ml-bg-radial-edge)_74%,#050403_100%)]" />
      <Image
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-[0.48]"
        fill
        priority
        sizes="100vw"
        src={tentaclesOverlay}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_43%,rgba(0,0,0,0.4)_0%,rgba(16,14,12,0.6)_38%,rgba(4,4,3,0.9)_78%,rgba(0,0,0,1)_100%)]" />
      <div className="ml-screen-noise absolute inset-0 opacity-20" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-[linear-gradient(0deg,rgba(4,4,3,0.9),transparent)]" />
    </div>
  );
}
