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
                <div style={{ position: 'absolute', left: '10px', bottom: '10px' }} ref={inputRef}>
                        {/* <l-hourglass
                                size={size ? size :"80"}
                                bg-opacity="0.3"
                                speed="1.25"
                                color="#7baefa"
                        ></l-hourglass> */}
                        {/* <l-reuleaux
                        size="68"
                        stroke="6"
                        stroke-length="0.15"
                        bg-opacity="0.1"
                        speed="1.2" 
                        color="#EF4DE2" 
                        ></l-reuleaux> */}
                        <l-trefoil
                        size="68"
                        stroke="6"
                        stroke-length="0.15"
                        bg-opacity="0.1"
                        speed="2" 
                        color="#EF4DE2"  
></l-trefoil>
                </div>
        );
}

export default LoadingHourglass;
