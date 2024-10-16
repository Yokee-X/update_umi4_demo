import { useEffect, useState } from 'react';

function WaterMarker({ str }) {
    const [style, setStyle] = useState({});

    useEffect(() => {
        create();
    }, []);

    function create() {
        var can = document.createElement('canvas');
        can.width = 200;
        can.height = 150;
        can.style.display = 'none';
        var cans = can.getContext('2d');
        cans.rotate((-20 * Math.PI) / 180);
        cans.font = '16px Microsoft JhengHei';
        cans.fillStyle = 'rgba(153, 153, 153, 0.60)';
        cans.textAlign = 'left';
        cans.textBaseline = 'Middle';
        cans.fillText(str, can.width / 6, can.height / 2);
        setStyle({
            backgroundImage: 'url(' + can.toDataURL('image/png') + ')',
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            zIndex: '2000',
            pointerEvents: 'none'
        });
    }

    return <div style={style}></div>;
}

export default WaterMarker;
