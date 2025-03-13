import { hourglass } from 'ldrs'
import { reuleaux } from 'ldrs'
import { useEffect, useRef } from 'react'
import { trefoil } from 'ldrs'

trefoil.register()
hourglass.register()
reuleaux.register()

function LoadingHourglass() {

        const inputRef = useRef<HTMLDivElement>(null);
        const rotationRef = useRef(0);
        const animationFrameRef = useRef<number | null>(null);
      
        const rotate = () => {
          rotationRef.current += 1; // Rotate by 1 degree per frame (smooth effect)
      
          if (inputRef.current) {
                inputRef.current.style.transform = `rotate(-${rotationRef.current}deg)`;
          }
      
          animationFrameRef.current = requestAnimationFrame(rotate);
        };
      
        useEffect(() => {
          animationFrameRef.current = requestAnimationFrame(rotate);
      
          return () => {
            if (animationFrameRef.current) {
              cancelAnimationFrame(animationFrameRef.current);
            }
          };
        }, []);
        
        return (
                <div ref={inputRef}>
                        <l-trefoil
                          size="68"
                          stroke="6"
                          stroke-length="0.15"
                          bg-opacity="0.1"
                          speed="2"
                          color="white"
                        />
                </div>
        );
}

export default LoadingHourglass;
