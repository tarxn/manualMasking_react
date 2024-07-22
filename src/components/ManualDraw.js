import React, { useEffect, useRef, useState } from 'react';
import './ManualDraw.css'


export default function ManualDraw() {
    const canvasRef = useRef(null);
    const [isEraser, setIsEraser] = useState(false);
    const [canvas, setCanvas] = useState(null);
    const [scale, setScale] = useState(1);
    const zoomContainerRef = useRef(null);

    useEffect(() => {
        if (!window.fabric) {
            console.error('Fabric.js is not loaded');
            return;
        }
        
        // Initialize the fabric canvas only once
        if (canvasRef.current && !canvas) {
            const fabricCanvas = new window.fabric.Canvas(canvasRef.current, {
                isDrawingMode: true,
            });
            
            setCanvas(fabricCanvas);
            // setBackgroundImage(fabricCanvas, 'https://cdn.pixabay.com/photo/2018/04/26/12/14/travel-3351825_1280.jpg');
        }
    }, [canvas]); // Dependency only on canvas initialization

    useEffect(() => {
        if (!canvas) return;

        // Configure drawing properties based on whether erasing or drawing
        if (isEraser){
            const brush = new window.fabric.EraserBrush(canvas);
            brush.width = 20;
            brush.opacity = 0.5;
            canvas.freeDrawingBrush = brush;
        }else{
            const brush = new window.fabric.PencilBrush(canvas);
            brush.opacity = 0.5;
            brush.color = 'white';
            brush.width = 20;
            canvas.freeDrawingBrush = brush;
            console.log('Brush opacity:', brush.opacity);
        }
        
    }, [isEraser, canvas]); // Reconfigure brush when isEraser or canvas changes

    const toggleEraser = () => {
        setIsEraser(!isEraser);
    };
    const saveCanvasAsPNG = () => {
        if (!canvas) return;

        const dataURL = canvas.toDataURL({
            format: 'png',
            quality: 1.0 // Optional: can range from 0 (low quality) to 1 (high quality)
        });

        const link = document.createElement('a');
        link.download = 'canvas-drawing.png'; // Name of the file
        link.href = dataURL;
        link.click();
    };

    // Handles zoom changes via scroll
    const handleWheel = (event) => {
        event.preventDefault();
        const delta = event.deltaY * -0.01;
        setScale(scale => Math.min(Math.max(0.5, scale + delta), 4));
    };

    useEffect(() => {
        const zoomContainer = zoomContainerRef.current;
        if (zoomContainer) {
            zoomContainer.addEventListener('wheel', handleWheel, { passive: false });
        }
        return () => {
            if (zoomContainer) {
                zoomContainer.removeEventListener('wheel', handleWheel);
            }
        };
    }, []);

    

    return (
        <div>

            <div ref={zoomContainerRef} className="zoom-img" style={{ width: '800px', height: '600px', overflow: 'hidden', position: 'relative' }}>
                <img src="https://cdn.pixabay.com/photo/2018/04/26/12/14/travel-3351825_1280.jpg" alt="Background"
                     style={{ transform: `scale(${scale})`, transition: 'transform 0.3s ease' }} />
                <canvas ref={canvasRef} width="800" height="600"
                        style={{ transform: `scale(${scale})`, transition: 'transform 0.3s ease', position: 'absolute', left: '0', top: '0' }} />
            </div>
            
            <button style={{padding: '10px 20px',
                borderRadius: '5px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px'}} onClick={toggleEraser} >{isEraser ? 'Pencil' : 'Eraser'}</button>
                        <button onClick={saveCanvasAsPNG}>Save as PNG</button>               
        </div>
    );
}
