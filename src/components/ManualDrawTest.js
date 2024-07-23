import React, { useRef, useState, useEffect } from 'react';
// import './App.css';  // Assuming styles are moved here

export default function ManualDrawTest(){
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isErasing, setIsErasing] = useState(false);
    const [brushSize, setBrushSize] = useState(50);
    // const [opacity, setOpacity] = useState(100);
    const [cursorUrl, setCursorUrl] = useState('');

    const brushColor = 'rgba(0, 221, 255, 1)';

    useEffect(() => {
        const updateCursor = () => {
            const cursorCanvas = document.createElement('canvas');
            cursorCanvas.width = brushSize * 2;
            cursorCanvas.height = brushSize * 2;
            const ctx = cursorCanvas.getContext('2d');

            // Configure the style of the brush cursor
            ctx.beginPath();
            ctx.arc(brushSize, brushSize, brushSize, 0, 2 * Math.PI);
            ctx.strokeStyle = brushColor; // Use the selected brush color
            ctx.setLineDash([5, 3]); // Creates a dotted effect for the stroke
            ctx.lineWidth = 1; // Line width can be adjusted
            ctx.stroke(); // Stroke the circle instead of filling it

            // Convert canvas to data URL and set as cursor
            cursorCanvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                setCursorUrl(url);
            });
        };

        updateCursor();
    }, [brushSize]); // Recreate the cursor when brush size changes

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = "#fff";
    }, []);

    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        setIsDrawing(true);
        draw(offsetX, offsetY, false);  // Start the path
    };

    const draw = (x, y, isDown) => {
        if (!isDown) return;
    
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
    
        ctx.strokeStyle = isErasing ? 'rgba(255, 255, 255, 1)' : brushColor;
        ctx.lineWidth = brushSize * 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalCompositeOperation = isErasing ? 'destination-out' : 'source-over';
    
        // Check if there's a last position to start from
        if (ctx.lastX !== undefined && ctx.lastY !== undefined) {
            // Start from the last position
            ctx.beginPath();
            ctx.moveTo(ctx.lastX, ctx.lastY);
    
            // Calculate the distance to the new point
            const dx = x - ctx.lastX;
            const dy = y - ctx.lastY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const steps = distance / 2; // Calculate number of intermediate steps based on the distance
            const stepX = dx / steps;
            const stepY = dy / steps;
    
            // Fill in the gaps by drawing a line to each intermediate step
            for (let step = 1; step <= steps; step++) {
                ctx.lineTo(ctx.lastX + stepX * step, ctx.lastY + stepY * step);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(ctx.lastX + stepX * step, ctx.lastY + stepY * step);
            }
        }
    
        // Update the last positions for the next move
        ctx.lastX = x;
        ctx.lastY = y;
    };

    const endDrawing = () => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.lastX = undefined; // Reset last positions
        ctx.lastY = undefined;
        setIsDrawing(false);
    };

    const toggleEraser = () => {
        setIsErasing(!isErasing);
    };

    const saveCanvasAsPNG = () => {
        if (!canvasRef.current) return;
        
        // Getting the canvas context and then creating a data URL
        const canvas = canvasRef.current;
        const dataURL = canvas.toDataURL("image/png");
        
        // Creating a link and triggering the download
        const link = document.createElement('a');
        link.download = 'canvas-drawing.png';
        link.href = dataURL;
        link.click();
    };
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
                // Calculate scale and draw the original image centered
                var scale = Math.min(500 / originalImage.width, 500 / originalImage.height);
                var x = (500 - originalImage.width * scale) / 2;
                var y = (500 - originalImage.height * scale) / 2;
                ctx.clearRect(0, 0, 500, 500);
                ctx.drawImage(originalImage, x, y, originalImage.width * scale, originalImage.height * scale);

                const originalData = ctx.getImageData(0, 0, 500, 500);
                
                // Clear the canvas and draw the mask image, centered and resized
                ctx.clearRect(0, 0, 500, 500);
                scale = Math.min(500 / maskImage.width, 500 / maskImage.height);
                x = (500 - maskImage.width * scale) / 2;
                y = (500 - maskImage.height * scale) / 2;
                ctx.drawImage(maskImage, x, y, maskImage.width * scale, maskImage.height * scale);
                
                const maskData = ctx.getImageData(0, 0, 500, 500);
                console.log("maskdata",maskData);
                // Apply the mask
                for (let i = 0; i < maskData.data.length; i += 4) {
                    // Treat non-transparent pixels in mask as 1, others as 0
                    if (maskData.data[i + 3] !== 0) {
                        // Set original pixel to fully transparent
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
    

    const saveMaskedImage = () => {
        if (!canvasRef.current) return;
        
        // Getting the canvas context and then creating a data URL
        const canvas = canvasRef.current;
        const maskSrc = canvas.toDataURL("image/png");
        applyMaskAndSaveImage(maskSrc, imageSrc, (dataUrl) => {
            const link = document.createElement('a');
            link.download = 'masked.png';
            link.href = dataUrl;
            link.click();
        });
    };

    const imageSrc = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

    const [scale, setScale] = useState(1); // Initial scale factor

    const handleWheel = (e) => {
        e.preventDefault(); // Prevent the default scroll behavior
        const delta = e.deltaY * -0.01; // Get the scroll delta and reverse the direction
        // Update the scale, clamp the values to avoid too much zoom in or out
        setScale((prevScale) => Math.min(Math.max(1, prevScale + delta), 2));
    };

 
    return (
        <div>
            <div style={{overflow:'hidden', width:"500px", height:"500px", backgroundColor:"black"}}>
            <div onWheel={handleWheel} id="canvasContainer" style={{ position: 'relative', width: '500px', height: '500px', border: '1px solid black' ,transform: `scale(${scale})`, // Apply the scale transform
                        transformOrigin: 'center center',
                        transition: 'transform 0.2s', }}>
                <div
                    // onWheel={handleWheel}
                    // style={{
                    //     maxWidth: '500px',
                    //     maxHeight: '500px',
                    //     overflow: 'auto',
                    //     border: '1px solid black',
                    //     transform: `scale(${scale})`, // Apply the scale transform
                    //     transformOrigin: 'center center', // Set the origin of transformation
                    //     transition: 'transform 0.2s', // Smooth transition for the transformation
                    // }}
                >
                    <img id="backgroundImage" src={imageSrc}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 , objectFit:"contain"}} alt="Background" />
                    <canvas
                        ref={canvasRef}
                        width={500}
                        height={500}
                        onMouseDown={startDrawing}
                        onMouseMove={(e) => draw(e.nativeEvent.offsetX, e.nativeEvent.offsetY, isDrawing)}
                        onMouseUp={endDrawing}
                        onMouseOut={endDrawing}
                        // style={{ position: 'absolute', top: 0, left: 0 }}
                        style={{ position: 'absolute', top: 0, left: 0 , cursor: `url(${cursorUrl}) ${brushSize} ${brushSize}, auto`, }}
                    />
                </div>
            </div>
            </div>
           
            <div>
                <button onClick={toggleEraser}>{isErasing ? "Use Brush" : "Use Eraser"}</button>
                <label htmlFor="brushSize">Brush Size:</label>
                <input type="range" id="brushSize" min="1" max="100" value={brushSize} onChange={(e) => setBrushSize(e.target.value)} />                
                <div className="controls">
                <button onClick={saveCanvasAsPNG}>Save as PNG</button>
                <button onClick={saveMaskedImage}>Save as Masked Image</button>
            </div>
            </div>
        </div>
    );
};


