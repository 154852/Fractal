let resolution = 0.8;
let maxIterations = 50;
let motionBlur = true;
let fractalType = 0;
let n = 2;
let cx = -0.7;
let cy = 0.27015;

const color = {
    contrast: 0,
    brightness: 0,
    getFunc: function() {
        const contrastCorrection = (259 * (this.contrast + 255)) / (255 * (259 - this.contrast));
        const colorCorrection = 255 / maxIterations;
        const b = this.brightness;
        return function(iter) {
            const c = (contrastCorrection * ((255 - (iter * colorCorrection)) - 128)) + 128 + b;
            return [c, c, c];
        };
    }
};

const canvas = document.getElementsByTagName("canvas")[0];
const ctx = canvas.getContext("2d");

let baseTransformation = null;

let motionTimeOut = null;
function render(t=baseTransformation) {
    UI.setWorking(true);
    switch (fractalType) {
        case 0:
            Fractal.mandelbrot(t.zoom, t.offset[0], t.offset[1], ctx, maxIterations, color.getFunc());
            break;
        case 1:
            Fractal.julia(t.zoom, t.offset[0], t.offset[1], ctx, maxIterations, color.getFunc(), cx, cy);
            break;
        case 2:
            Fractal.juliaN(t.zoom, t.offset[0], t.offset[1], ctx, maxIterations, color.getFunc(), n, cx, cy);
            break;
    }
    UI.setWorking(false);
}

function asyncRender() {
    setTimeout(function() {render()}, 0);
}

const onResize = UI.onResize(function(w, h) {
    canvas.width = w * resolution;
    canvas.height = h * resolution;
    
    if (baseTransformation != null) render();
});

onResize();

let res = null;
baseTransformation = UI.createTransformContext(canvas, [0.55, 0.5], resolution, function(transformation) {
    if (motionBlur) {
        if (res == null) res = resolution;
        setResolution(0.1, false);
    }
    render(transformation);
});

baseTransformation.onEnd = function() {
    if (motionBlur) {
        setResolution(res, false);
        res = null;
        render();
    }
};

function setResolution(res, doRender=true) {
    baseTransformation.updateResolution(res);
    resolution = res;
    canvas.width = innerWidth * resolution;
    canvas.height = innerHeight * resolution;
    if (doRender) render();
}

function takeImage() {
    const pom = document.createElement('a');
    pom.setAttribute("href", canvas.toDataURL());
    pom.setAttribute("download", "fractal.png");
    pom.style.display = "none";
    document.body.appendChild(pom);
    pom.click();
    document.body.removeChild(pom);
}

render();