let gl;
let program;
let time = 0;
let zoom = 1.0;
let speed = 0.15;
let colorIntensity = 8.0;
let mouseX = 0;
let mouseY = 0;

const vertexShaderSource = `
    attribute vec4 position;
    void main() {
        gl_Position = position;
    }
`;

const fragmentShaderSource = `
    precision highp float;
    uniform vec2 resolution;
    uniform float time;

    vec2 complexMul(vec2 a, vec2 b) {
        return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
    }

    void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy) / min(resolution.y, resolution.x);
        
        vec2 c = vec2(
            0.7885 * cos(time * 0.15),
            0.7885 * sin(time * 0.15)
        );
        
        vec2 z = uv;
        float iter = 0.0;
        const float maxIter = 100.0;
        
        for(float i = 0.0; i < maxIter; i++) {
            z = complexMul(z, z) + c;
            if(length(z) > 2.0) break;
            iter++;
        }
        
        vec3 color = vec3(0.0);
        if(iter < maxIter) {
            float f = iter / maxIter;
            color = vec3(
                0.5 + 0.5 * cos(3.0 + f * 8.0),
                0.5 + 0.5 * cos(2.0 + f * 8.0),
                0.5 + 0.5 * cos(1.0 + f * 8.0)
            );
        }
        
        gl_FragColor = vec4(color, 1.0);
    }
`;

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function init() {
    const canvas = document.getElementById('glCanvas');
    gl = canvas.getContext('webgl');
    
    if (!gl) {
        alert('WebGL não disponível');
        return;
    }
    
    // Configurar tamanho do canvas
    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = 800 * pixelRatio;
    canvas.height = 800 * pixelRatio;
    canvas.style.width = '800px';
    canvas.style.height = '800px';
    
    // Criar programa WebGL
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
        return;
    }
    
    // Criar geometria
    const positions = new Float32Array([
        -1, -1,
        1, -1,
        -1, 1,
        1, 1,
    ]);
    
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    
    // Configurar atributos
    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    
    // Adicionar eventos
    setupEvents();
    
    animate();
}

const presets = {
    classic: {
        zoom: 1.0,
        speed: 0.15,
        colorIntensity: 8.0
    },
    psychedelic: {
        zoom: 0.8,
        speed: 0.25,
        colorIntensity: 12.0
    },
    ocean: {
        zoom: 1.5,
        speed: 0.08,
        colorIntensity: 5.0
    }
};

function setupEvents() {
    // Controles de range com valores atualizados
    const rangeControls = ['zoom', 'speed', 'colorIntensity'];
    rangeControls.forEach(control => {
        const input = document.getElementById(control);
        const valueSpan = document.getElementById(`${control}Value`);
        
        input.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            window[control] = value;
            valueSpan.textContent = value.toFixed(1) + (control === 'speed' ? 'x' : '');
        });
    });

    // Menu mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const controlsPanel = document.querySelector('.controls');
    
    menuToggle?.addEventListener('click', () => {
        controlsPanel.classList.toggle('active');
    });

    // Presets
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const preset = presets[btn.dataset.preset];
            if (preset) {
                Object.entries(preset).forEach(([key, value]) => {
                    window[key] = value;
                    const input = document.getElementById(key);
                    const valueSpan = document.getElementById(`${key}Value`);
                    if (input) input.value = value;
                    if (valueSpan) valueSpan.textContent = value.toFixed(1) + (key === 'speed' ? 'x' : '');
                });
            }
        });
    });

    // Touch events para mobile
    let touchStartX = 0;
    let touchStartY = 0;

    gl.canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        updateMousePosition(touch.clientX, touch.clientY);
    });

    gl.canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        updateMousePosition(touch.clientX, touch.clientY);
    });

    // Mouse events
    gl.canvas.addEventListener('mousemove', (e) => {
        updateMousePosition(e.clientX, e.clientY);
    });

    // Resize handler
    window.addEventListener('resize', () => {
        resizeCanvas();
    });
}

function updateMousePosition(clientX, clientY) {
    const rect = gl.canvas.getBoundingClientRect();
    mouseX = (clientX - rect.left) / gl.canvas.width * 2 - 1;
    mouseY = -((clientY - rect.top) / gl.canvas.height * 2 - 1);
}

function resizeCanvas() {
    const pixelRatio = window.devicePixelRatio || 1;
    const width = Math.min(800, window.innerWidth - 100);
    const height = Math.min(800, window.innerHeight - 100);
    
    gl.canvas.width = width * pixelRatio;
    gl.canvas.height = height * pixelRatio;
    gl.canvas.style.width = width + 'px';
    gl.canvas.style.height = height + 'px';
}

function animate() {
    time += 0.016;
    
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.useProgram(program);
    
    const resolutionLocation = gl.getUniformLocation(program, 'resolution');
    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
    
    const timeLocation = gl.getUniformLocation(program, 'time');
    gl.uniform1f(timeLocation, time);
    
    const zoomLocation = gl.getUniformLocation(program, 'zoom');
    gl.uniform1f(zoomLocation, zoom);
    
    const speedLocation = gl.getUniformLocation(program, 'speed');
    gl.uniform1f(speedLocation, speed);
    
    const colorIntensityLocation = gl.getUniformLocation(program, 'colorIntensity');
    gl.uniform1f(colorIntensityLocation, colorIntensity);
    
    const mouseLocation = gl.getUniformLocation(program, 'mouse');
    gl.uniform2f(mouseLocation, mouseX, mouseY);
    
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    
    requestAnimationFrame(animate);
}

window.onload = init; 