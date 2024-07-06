
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

    console.log('Inputs are valid, proceeding with code generation...');

    const itemWidthMeters = itemWidth * 0.0254; // Convert inches to meters
    const itemHeightMeters = itemHeight * 0.0254; // Convert inches to meters
    const letterHeightMeters = letterHeightFeet * 0.3048; // Convert feet to meters

    console.log(`Item Width in meters: ${itemWidthMeters}, Item Height in meters: ${itemHeightMeters}, Letter Height in meters: ${letterHeightMeters}`);

    // Default values if fields are empty
    if (isNaN(startX)) startX = 0;
    if (isNaN(startY)) startY = 0;
    if (isNaN(startZ)) startZ = 0;
    if (isNaN(orientationDegrees)) orientationDegrees = 0;

    console.log(`Starting coordinates: X=${startX}, Y=${startY}, Z=${startZ}, Orientation: ${orientationDegrees} degrees`);

    const orientationRadians = orientationDegrees * (Math.PI / 180); // Convert degrees to radians
    
    const spacing = itemWidthMeters * 0.05; // Reduce spacing to ensure higher density
    console.log(`Spacing between items: ${spacing}`);

    let code = '';
    
    const fontMap = {
        'block': {
            'H': generateFontMatrix(20, 20, 0.85), // 20x20 grid with 85% coverage
            'I': generateFontMatrix(5, 20, 0.85)  // 5x20 grid with 85% coverage
        },
        'slim': {
            'H': generateFontMatrix(20, 20, 0.85),
            'I': generateFontMatrix(5, 20, 0.85)
        }
    };

    console.log('Font map created.');

    const letterMap = fontMap[font];
    console.log(`Using font: ${font}`);

    let currentX = 0;
    let items = [];
    for (let letter of textInput) {
        console.log(`Processing letter: ${letter}`);
        if (letterMap[letter]) {
            letterMap[letter].forEach(pos => {
                const relativeX = currentX + pos[0] * itemWidthMeters;
                const relativeY = pos[1] * letterHeightMeters;
                const posX = startX + (relativeX * Math.cos(orientationRadians)) - (relativeY * Math.sin(orientationRadians));
                const posY = startY;
                const posZ = startZ + (relativeX * Math.sin(orientationRadians)) + (relativeY * Math.cos(orientationRadians));
                items.push({
                    name: itemFileName,
                    pos: [posX, posY, posZ],
                    ypr: [orientationDegrees, 0, 0],
                    scale: 1.0,
                    enableCEPersistency: 0
                });
                console.log(`Added item at position: X=${posX}, Y=${posY}, Z=${posZ}`);
            });
            currentX += (letterMap[letter].reduce((max, pos) => pos[0] > max ? pos[0] : max, 0) + 1) * itemWidthMeters + spacing;
            console.log(`Current X after processing letter ${letter}: ${currentX}`);
        } else {
            console.warn(`Letter ${letter} not found in font map.`);
        }
    }

    code = JSON.stringify(items, null, 4);
    document.getElementById('generatedCode').value = code;

    console.log('Code generation complete.');
}

function generateFontMatrix(width, height, coverage) {
    const matrix = [];
    const totalCells = width * height;
    const requiredCells = Math.ceil(totalCells * coverage);
    const stepX = 1 / (width - 1);
    const stepY = 1 / (height - 1);

    for (let i = 0; i < requiredCells; i++) {
        const x = (i % width) * stepX;
        const y = Math.floor(i / width) * stepY;
        matrix.push([x, y]);
    }

    console.log(`Generated font matrix: ${JSON.stringify(matrix)}`);
    return matrix;
}
