window.onload = function() {
    const canvas = document.getElementById('glCanvas');
    const gl = canvas.getContext('webgl');

    if (!gl) {
        alert('Unable to initialize WebGL. Your browser may not support it.');
        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

  

    const vsSource = `
        attribute vec4 aVertexPosition;
        void main() {
            gl_Position = aVertexPosition;
        }
    `;

    const fsSource = `
        precision mediump float;
        uniform vec4 uColor;
        void main() {
            gl_FragColor = uColor;
        }
    `;

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    const vertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    const colorUniformLocation = gl.getUniformLocation(shaderProgram, 'uColor');

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Create an array of positions for the trapezium
    const positions = [
        -0.8, -0.5,  // Bottom-left
         0.8, -0.5,  // Bottom-right
         0.8,  0.5,  // Top-right
        -0.8,  0.5   // Top-left
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPosition);

    gl.useProgram(shaderProgram);

    let color = [0.5, 0.5, 0.5, 1.0]; // Initial color: Abu-abu

    function draw() {
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform4fv(colorUniformLocation, color);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        
    }

    draw();

    document.getElementById('blueButton').addEventListener('click', () => {
        color = [0.6, 0.8, 1.0, 1.0]; // Pastel Blue
        draw();
    });

    document.getElementById('pinkButton').addEventListener('click', () => {
        color = [1.0, 0.7, 0.8, 1.0]; // Pastel Pink
        draw();
    });

    document.getElementById('yellowButton').addEventListener('click', () => {
        color = [1.0, 1.0, 0.6, 1.0]; // Pastel Yellow
        draw();
    });

    document.getElementById('resetButton').addEventListener('click', () => {
        color = [0.5, 0.5, 0.5, 1.0]; // Reset to Abu-abu
        draw();
    });
}

// Initialize a shader program, so WebGL knows how to draw our data
function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Create the shader program
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS )) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

// Creates a shader of the given type, uploads the source and compiles it .
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);

    // Send the source to the shader object
    gl.shaderSource(shader, source);

    // Compile the shader program
    gl.compileShader(shader);

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return
    }

    return shader;
}