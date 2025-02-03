import { hourglass } from 'ldrs'
hourglass.register()

function LoadingHourglass() {
        return (
                <div style={{ position: 'absolute', left: '10px', bottom: '10px' }}>
                        <l-hourglass
                                size="80"
                                bg-opacity="0.3"
                                speed="1.25"
                                color="#7baefa"
                        ></l-hourglass>
                </div>
        );
}

export default LoadingHourglass;