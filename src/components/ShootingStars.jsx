const ShootingStars = () => {
  return (
    <div className="shooting-stars-container fixed top-0 left-0 w-full h-full pointer-events-none z-0">
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className={`shooting-star absolute w-[3px] h-[3px] bg-white/80 rounded-full
                     before:content-[''] before:absolute before:w-[150px] before:h-[2px] 
                     before:bg-gradient-to-r before:from-white/80 before:to-transparent
                     animate-shooting-star`}
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${2 + Math.random() * 3}s`
          }}
        />
      ))}
    </div>
  );
};

export default ShootingStars; 