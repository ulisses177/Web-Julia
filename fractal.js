let gl;
let program;
let time = 0;
let zoom = 1.0;
let speed = 0.15;
let colorIntensity = 8.0;
let mouseX = 0;
let mouseY = 0;
let currentColors;

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
    uniform float zoom;
    uniform float speed;
    uniform float colorIntensity;
    uniform vec2 mouse;
    uniform vec3 color1;
    uniform vec3 color2;
    uniform vec3 color3;

    vec2 complexMul(vec2 a, vec2 b) {
        return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
    }

    void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy) / min(resolution.y, resolution.x);
        uv = uv / zoom;
        
        vec2 c = vec2(
            0.7885 * cos(time * speed) + mouse.x * 0.3,
            0.7885 * sin(time * speed) + mouse.y * 0.3
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
            color = mix(
                mix(color1, color2, cos(f * colorIntensity)),
                color3,
                sin(f * colorIntensity * 0.5)
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

const presets = {
    classic: {
        zoom: 1.0,
        speed: 0.15,
        colorIntensity: 8.0,
        colors: {
            color1: [0.5, 0.0, 0.3],
            color2: [0.0, 0.5, 0.8],
            color3: [1.0, 0.7, 0.0]
        }
    },
    psychedelic: {
        zoom: 0.8,
        speed: 0.25,
        colorIntensity: 12.0,
        colors: {
            color1: [1.0, 0.1, 0.8],
            color2: [0.2, 1.0, 0.0],
            color3: [0.8, 0.3, 1.0]
        }
    },
    ocean: {
        zoom: 1.5,
        speed: 0.08,
        colorIntensity: 5.0,
        colors: {
            color1: [0.0, 0.2, 0.4],
            color2: [0.0, 0.5, 0.5],
            color3: [0.2, 0.8, 0.8]
        }
    },
    sunset: {
        zoom: 1.2,
        speed: 0.12,
        colorIntensity: 6.0,
        colors: {
            color1: [0.8, 0.0, 0.0],
            color2: [1.0, 0.4, 0.1],
            color3: [0.8, 0.7, 0.3]
        }
    },
    forest: {
        zoom: 1.3,
        speed: 0.1,
        colorIntensity: 7.0,
        colors: {
            color1: [0.0, 0.3, 0.0],
            color2: [0.2, 0.5, 0.1],
            color3: [0.6, 0.8, 0.2]
        }
    },
    galaxy: {
        zoom: 0.9,
        speed: 0.18,
        colorIntensity: 10.0,
        colors: {
            color1: [0.1, 0.0, 0.2],
            color2: [0.5, 0.0, 1.0],
            color3: [1.0, 0.8, 1.0]
        }
    },
    lava: {
        zoom: 1.1,
        speed: 0.2,
        colorIntensity: 9.0,
        colors: {
            color1: [0.5, 0.0, 0.0],
            color2: [1.0, 0.2, 0.0],
            color3: [1.0, 0.8, 0.0]
        }
    },
    arctic: {
        zoom: 1.4,
        speed: 0.05,
        colorIntensity: 4.0,
        colors: {
            color1: [0.0, 0.2, 0.3],
            color2: [0.5, 0.7, 0.8],
            color3: [1.0, 1.0, 1.0]
        }
    }
};

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
    
    // Inicializar cores
    currentColors = presets.classic.colors;
    
    setupEvents();
    animate();
}

function setupEvents() {
    // Controles deslizantes
    const rangeInputs = {
        zoom: document.getElementById('zoom'),
        speed: document.getElementById('speed'),
        colorIntensity: document.getElementById('colorIntensity')
    };

    // Adicionar listeners para cada controle
    Object.entries(rangeInputs).forEach(([key, input]) => {
        if (input) {
            input.addEventListener('input', (e) => {
                window[key] = parseFloat(e.target.value);
                const valueSpan = document.getElementById(`${key}Value`);
                if (valueSpan) {
                    valueSpan.textContent = e.target.value + (key === 'speed' ? 'x' : '');
                }
            });
        }
    });

    // Presets
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const preset = presets[btn.dataset.preset];
            if (preset) {
                // Atualizar valores
                zoom = preset.zoom;
                speed = preset.speed;
                colorIntensity = preset.colorIntensity;
                currentColors = preset.colors;

                // Atualizar interface
                rangeInputs.zoom.value = preset.zoom;
                rangeInputs.speed.value = preset.speed;
                rangeInputs.colorIntensity.value = preset.colorIntensity;
            }
        });
    });

    // Mouse/Touch events
    gl.canvas.addEventListener('mousemove', (e) => {
        updateMousePosition(e.clientX, e.clientY);
    });
}

function updateMousePosition(clientX, clientY) {
    const rect = gl.canvas.getBoundingClientRect();
    mouseX = (clientX - rect.left) / gl.canvas.width * 2 - 1;
    mouseY = -((clientY - rect.top) / gl.canvas.height * 2 - 1);
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
    
    const color1Location = gl.getUniformLocation(program, 'color1');
    const color2Location = gl.getUniformLocation(program, 'color2');
    const color3Location = gl.getUniformLocation(program, 'color3');
    
    gl.uniform3fv(color1Location, currentColors.color1);
    gl.uniform3fv(color2Location, currentColors.color2);
    gl.uniform3fv(color3Location, currentColors.color3);
    
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    
    requestAnimationFrame(animate);
}

window.onload = init; 