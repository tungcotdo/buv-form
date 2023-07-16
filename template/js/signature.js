var Signature = ({
    canvasId,
    clearId,
    hiddenId,
}) => {

    const canvasElement = document.getElementById(canvasId);
    const clearElement = document.getElementById(clearId);
    const hiddenElement = document.getElementById(hiddenId);
    const ctx = canvasElement.getContext('2d');
    
    let writingMode = false;
    
    clearElement.disabled = true;
    
    const clearPad = () => {
        ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        clearElement.disabled = true;
        hiddenElement.value = null;
    }
    
    clearElement.addEventListener('click', event => {
        event.preventDefault();
        clearPad();
    })
    
    const getTargetPosition = event => {
        positionX = event.clientX - event.target.getBoundingClientRect().x;
        positionY = event.clientY - event.target.getBoundingClientRect().y;
        return [positionX, positionY];
    }
    
    const handlePointerMove = event => {
        if( !writingMode ) return
        clearElement.disabled = false;
        const [positionX, positionY] = getTargetPosition(event);
        ctx.lineTo(positionX, positionY);
        ctx.strokeStyle = '#4d78e5';
        ctx.stroke();
    }
    
    const handlePointerUp = () => {
        writingMode = false;
        hiddenElement.value = canvasElement.toDataURL();
    }
    
    const handlePointerDown = event => {
        writingMode = true;
        ctx.beginPath();
        const [positionX, positionY] = getTargetPosition(event);
        ctx.moveTo(positionX, positionY);
    }
    
    const handlePointerOut = () =>{
        writingMode = false;
    }
    
    ctx.lineWidth = 1;
    ctx.lineJoin = ctx.lineCap = 'round';
    
    canvasElement.addEventListener('pointerdown', handlePointerDown);
    canvasElement.addEventListener('pointerup', handlePointerUp);
    canvasElement.addEventListener('pointermove', handlePointerMove);
    canvasElement.addEventListener("pointerout", handlePointerOut);
    
}
