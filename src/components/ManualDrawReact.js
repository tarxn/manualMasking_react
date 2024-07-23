import React, { useRef, useState } from 'react';
import CanvasDraw from 'react-canvas-draw';
import './ManualDraw.css';

function applyMaskAndSaveImage(maskSrc, imageSrc, callback) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 500;

    const maskImage = new Image();
    const originalImage = new Image();

    maskImage.crossOrigin = "Anonymous";
    originalImage.crossOrigin = "Anonymous";

    let imagesLoaded = 0;
    function imageLoadHandler() {
        imagesLoaded++;
        if (imagesLoaded === 2) {
            // Draw the original image
            ctx.drawImage(originalImage, 0, 0, 500, 500);
            const originalData = ctx.getImageData(0, 0, 500, 500);

            // Draw the mask image
            ctx.clearRect(0, 0, 500, 500);
            ctx.drawImage(maskImage, 0, 0, 500, 500);
            const maskData = ctx.getImageData(0, 0, 500, 500);

            // Apply the mask
            for (let i = 0; i < maskData.data.length; i += 4) {
                // Treat white (255, 255, 255) or transparent (alpha = 0) in mask as 1, others as 0
                if (maskData.data[i] === 255 && maskData.data[i + 1] === 255 && maskData.data[i + 2] === 255 || maskData.data[i + 3] === 0) {
                    // Keep original pixel
                } else {
                    // Set pixel to fully transparent
                    originalData.data[i + 3] = 0;
                }
            }

            // Put modified original image back on canvas
            ctx.putImageData(originalData, 0, 0);

            // Callback to handle the result
            callback(canvas.toDataURL("image/png"));
        }
    }

    maskImage.onload = imageLoadHandler;
    originalImage.onload = imageLoadHandler;
    maskImage.src = maskSrc;
    originalImage.src = imageSrc;
}


export default function ManualDrawReact() {
    const canvasRef = useRef(null);
    const [color, setColor] = useState("rgba(255, 9, 89, 0.35)");
    const [radius, setRadius] = useState(12);

    // Define the source of the mask and the original image
    const imageSrc = 'https://cdn.pixabay.com/photo/2018/04/26/12/14/travel-3351825_1280.jpg';
    // const maskSrc = new Image();// Assumes mask.png is in the public folder

    const saveCanvasAsPNG = () => {
        const data = canvasRef.current.getDataURL("png");
        const link = document.createElement('a');
        link.download = 'canvas-drawing.png';
        link.href = data;
        link.click();
    };

    const saveMaskedImage = () => {
        const maskSrc = canvasRef.current.getDataURL("png");
        applyMaskAndSaveImage(maskSrc, imageSrc, (dataUrl) => {
            const link = document.createElement('a');
            link.download = 'masked.png';
            link.href = dataUrl;
            link.click();
        });
    };

    return (
        <div style={{ overflow: 'hidden', position: 'relative' }}>
            <CanvasDraw
                ref={canvasRef}
                brushColor={color}
                brushRadius={radius}
                lazyRadius={1}
                hideGrid={false}
                className="border border-gray-300 shadow-md"
                canvasWidth={500}
                canvasHeight={500}
                enablePanAndZoom={true}
                mouseZoomFactor={-0.01}
                zoomExtents={{ min: 1, max: 5 }}
                imgSrc={imageSrc}
            />
            <div className="controls">
                <button onClick={() => setColor(color === "#ffffff" ? "rgba(255, 9, 89, 0.35)" : "#ffffff")}>
                    {color === "#ffffff" ? "Pencil" : "Eraser"}
                </button>
                <button onClick={saveCanvasAsPNG}>Save as PNG</button>
                {/* <button onClick={canvasRef.current.clear}>Clear Canvas</button> */}
                <button onClick={saveMaskedImage}>Save as Masked Image</button>
            </div>
        </div>
    );
}
