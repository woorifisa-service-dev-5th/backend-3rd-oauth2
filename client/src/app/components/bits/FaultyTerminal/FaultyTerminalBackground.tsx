import FaultyTerminal from './FaultyTerminal';
const FaultyTerminalBackground = () => {
    return (
        <div
            style={{
                position: 'fixed', // 화면에 고정
                top: 0,
                left: 0,
                width: '100vw', // 전체 너비
                height: '100vh', // 전체 높이
                zIndex: -10, // 다른 콘텐츠보다 뒤에 위치하도록 설정
            }}
        >
            <FaultyTerminal
                scale={1.5}
                gridMul={[2, 1]}
                digitSize={1.2}
                timeScale={1}
                pause={false}
                scanlineIntensity={1}
                glitchAmount={1}
                flickerAmount={1}
                noiseAmp={1}
                chromaticAberration={0}
                dither={0}
                curvature={0}
                tint='#ffffff'
                mouseReact={true}
                mouseStrength={0.5}
                pageLoadAnimation={false}
                brightness={1}
            />
        </div>
    );
};

export default FaultyTerminalBackground;
