export function Moon() {
  return (
    <div className="fixed top-12 right-12 w-24 h-24 md:w-32 md:h-32 
                    bg-white rounded-full shadow-[0_0_20px_#fff]" />
  );
}

export function ShootingStars() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="absolute w-[2px] h-[2px] bg-white rounded-full animate-shooting-star" 
           style={{ top: '10%', left: '100%' }} />
      <div className="absolute w-[2px] h-[2px] bg-white rounded-full animate-shooting-star delay-1000" 
           style={{ top: '30%', left: '100%' }} />
      <div className="absolute w-[2px] h-[2px] bg-white rounded-full animate-shooting-star delay-2000" 
           style={{ top: '50%', left: '100%' }} />
      <div className="absolute w-[2px] h-[2px] bg-white rounded-full animate-shooting-star delay-3000" 
           style={{ top: '70%', left: '100%' }} />
      <div className="absolute w-[2px] h-[2px] bg-white rounded-full animate-shooting-star delay-4000" 
           style={{ top: '90%', left: '100%' }} />
    </div>
  );
} 