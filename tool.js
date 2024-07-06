
function generateCode() {
    let hasError = false;

    const itemFileName = document.getElementById('itemFileName').value.trim();
    const itemWidth = parseFloat(document.getElementById('itemWidth').value);
    const itemHeight = parseFloat(document.getElementById('itemHeight').value);
    const textInput = document.getElementById('textInput').value.trim().toUpperCase();
    const font = document.getElementById('fontSelect').value;
    const letterHeightFeet = parseFloat(document.getElementById('letterHeight').value);
    
    let startX = parseFloat(document.getElementById('startX').value);
    let startY = parseFloat(document.getElementById('startY').value);
    let startZ = parseFloat(document.getElementById('startZ').value);
    let orientationDegrees = parseFloat(document.getElementById('orientation').value);

    // Reset error messages
    document.getElementById('itemFileNameError').textContent = '';
    document.getElementById('itemWidthError').textContent = '';
    document.getElementById('itemHeightError').textContent = '';
    document.getElementById('textInputError').textContent = '';
    document.getElementById('fontSelectError').textContent = '';
    document.getElementById('letterHeightError').textContent = '';

    // Validation
    if (!itemFileName) {
        document.getElementById('itemFileNameError').textContent = 'Item File Name is required.';
        hasError = true;
    }
    if (isNaN(itemWidth) || itemWidth <= 0) {
        document.getElementById('itemWidthError').textContent = 'Valid Item Width is required.';
        hasError = true;
    }
    if (isNaN(itemHeight) || itemHeight <= 0) {
        document.getElementById('itemHeightError').textContent = 'Valid Item Height is required.';
        hasError = true;
    }
    if (!textInput) {
        document.getElementById('textInputError').textContent = 'Text to Display is required.';
        hasError = true;
    }
    if (!font) {
        document.getElementById('fontSelectError').textContent = 'Font is required.';
        hasError = true;
    }
    if (isNaN(letterHeightFeet) || letterHeightFeet <= 0) {
        document.getElementById('letterHeightError').textContent = 'Valid Letter Height is required.';
        hasError = true;
    }

    if (hasError) {
        document.getElementById('generatedCode').value = 'Please correct the errors above.';
        return;
    }

    const itemWidthMeters = itemWidth * 0.0254; // Convert inches to meters
    const itemHeightMeters = itemHeight * 0.0254; // Convert inches to meters
    const letterHeightMeters = letterHeightFeet * 0.3048; // Convert feet to meters

    // Default values if fields are empty
    if (isNaN(startX)) startX = 0;
    if (isNaN(startY)) startY = 0;
    if (isNaN(startZ)) startZ = 0;
    if (isNaN(orientationDegrees)) orientationDegrees = 0;

    const orientationRadians = orientationDegrees * (Math.PI / 180); // Convert degrees to radians
    
    const spacing = itemWidthMeters * 0.15; // Reduce spacing to ensure higher density
    let code = '';
    
    const fontMap = {
        'block': {
            'H': [
                [0, 0], [0, 1], [0, 2], 
                [1, 1], 
                [2, 0], [2, 1], [2, 2]
            ],
            'I': [
                [0, 0], [0, 1], [0, 2]
            ]
        },
        'slim': {
            'H': [
                [0, 0], [0, 1], [0, 2], 
                [1, 1], 
                [2, 0], [2, 1], [2, 2]
            ],
            'I': [
                [0, 0], [0, 1], [0, 2]
            ]
        }
    };
    
    const letterMap = fontMap[font];
    
    let currentX = 0;
    for (let letter of textInput) {
        if (letterMap[letter]) {
            letterMap[letter].forEach(pos => {
                const relativeX = currentX + pos[0] * itemWidthMeters;
                const relativeY = pos[1] * letterHeightMeters;
                const posX = startX + (relativeX * Math.cos(orientationRadians)) - (relativeY * Math.sin(orientationRadians));
                const posY = startY;
                const posZ = startZ + (relativeX * Math.sin(orientationRadians)) + (relativeY * Math.cos(orientationRadians));
                code += `CreateItem("${itemFileName}", "${posX} ${posY} ${posZ}");
`;
            });
            currentX += (letterMap[letter].reduce((max, pos) => pos[0] > max ? pos[0] : max, 0) + 1) * itemWidthMeters + spacing;
        }
    }
    
    document.getElementById('generatedCode').value = code;
}

function CreateItem(itemType, position) {
    // This function is a placeholder and does not execute in the browser.
    // It represents the DayZ in-game item creation function.
    return `Item: ${itemType}, Position: ${position}`;
}
