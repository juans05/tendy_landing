import Image from 'next/image';

const TOYS = [
  { src: '/images/toy-plane.png', className: 'left-[4%] top-[13%] hidden h-16 w-16 animate-float-slow sm:block sm:h-20 sm:w-20 lg:h-24 lg:w-24' },
  { src: '/images/toy-ball.png', className: 'right-[7%] top-[8%] h-14 w-14 animate-float sm:h-16 sm:w-16 lg:h-20 lg:w-20' },
  { src: '/images/toy-pinwheel.png', className: 'left-[8%] bottom-[8%] h-14 w-14 animate-float-slow sm:h-16 sm:w-16 lg:h-20 lg:w-20' },
  { src: '/images/toy-car.png', className: 'right-[5%] bottom-[14%] h-16 w-16 animate-float sm:h-20 sm:w-20 lg:h-24 lg:w-24' },
];

export function FloatingDecor({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {TOYS.map((toy) => (
        <Image
          key={toy.src}
          src={toy.src}
          alt=""
          width={96}
          height={96}
          className={`absolute drop-shadow-lg ${toy.className}`}
        />
      ))}
    </div>
  );
}
