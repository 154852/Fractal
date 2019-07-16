const Fractal = {};

/**
 * @callback FractalColorCallback
 * @param {Number} code 
 * @returns {[Number, Number, Number]}
 */

/**
 * Render mandelbrot fractal
 * @param {Number} zoom Zoom (around center)
 * @param {Number} xo X position offset (px, zoom included)
 * @param {Number} yo Y position offset (px, zoom included)
 * @param {CanvasRenderingContext2D} ctx Canvas context
 * @param {Number} max_iter Maximum iterations
 * @param {FractalColorCallback} color Color callback
 */
Fractal.mandelbrot = function(zoom, xo, yo, ctx, max_iter, color) {
    function coord(x, o, w, a, b) {
        return ((((x / w) * a) - b) * zoom) + (o * a) - b;
    }

    if (color == null) {
        const colorMul = 255 / max_iter;
        color = function(i) {
            i = 255 - (colorMul * i);
            return [i, i, i];
        };
    }

    const imgdata = ctx.createImageData(ctx.canvas.width, ctx.canvas.height);
    for (let px = 0; px < imgdata.width; px++) {
        const x0 = coord(px, xo, imgdata.width, 3.5, 2.5);
        for (let py = 0; py < imgdata.height; py++) {
            const y0 = coord(py, yo, imgdata.height, 2, 1);

            let x = 0, y = 0, iter = 0, xs = 0, ys = 0;

            while (xs + ys <= 4 && (iter < max_iter)) {
                const xt = xs - ys + x0;
                y = (2 * x * y) + y0;
                x = xt;
                xs = x * x;
                ys = y * y;
                iter++;
            }

            const idx = (py * (imgdata.width * 4)) + (px * 4);
            const c = color(iter);
            imgdata.data[idx] = c[0]
            imgdata.data[idx + 1] = c[1]
            imgdata.data[idx + 2] = c[2];
            imgdata.data[idx + 3] = c[4] == null? 255:c[4];
        }
    }

    ctx.putImageData(imgdata, 0, 0);
}

/**
 * Render julia fractal
 * @param {Number} zoom Zoom (around center)
 * @param {Number} xo X position offset (px, zoom included)
 * @param {Number} yo Y position offset (px, zoom included)
 * @param {CanvasRenderingContext2D} ctx Canvas context
 * @param {Number} max_iter Maximum iterations
 * @param {FractalColorCallback} color Color callback
 * @param {Number} cx 
 * @param {Number} cy
 */
Fractal.julia = function(zoom, xo, yo, ctx, max_iter, color, cx, cy) {
    function coord(x, o, w, a, b) {
        return ((((x / w) * a) - b) * zoom) + (o * a) - b;
    }

    if (color == null) {
        const colorMul = 255 / max_iter;
        color = function(i) {
            i = 255 - (colorMul * i);
            return [i, i, i];
        };
    }

    const imgdata = ctx.createImageData(ctx.canvas.width, ctx.canvas.height);
    for (let x = 0; x < imgdata.width; x++) {
        let zx0 = coord(x, xo, imgdata.width, 3.5, 2.5);
        for (let y = 0; y < imgdata.height; y++) {
            let zx = zx0;
            let zy = coord(y, yo, imgdata.height, 2, 1);

            let iter = 0, zxs = zx * zx, zys = zy * zy;

            while (zxs + zys < 4 && iter < max_iter) {
                const xt = zxs - zys + cx;
                zy = (2 * zx * zy) + cy;
                zx = xt;
                iter++;

                zxs = zx * zx;
                zys = zy * zy;
            }

            const idx = (y * (imgdata.width * 4)) + (x * 4);
            const c = color(iter);
            imgdata.data[idx] = c[0]
            imgdata.data[idx + 1] = c[1]
            imgdata.data[idx + 2] = c[2];
            imgdata.data[idx + 3] = c[4] == null? 255:c[4];
        }
    }

    ctx.putImageData(imgdata, 0, 0);
}

/**
 * Render julia fractal
 * @param {Number} zoom Zoom (around center)
 * @param {Number} xo X position offset (px, zoom included)
 * @param {Number} yo Y position offset (px, zoom included)
 * @param {CanvasRenderingContext2D} ctx Canvas context
 * @param {Number} max_iter Maximum iterations
 * @param {FractalColorCallback} color Color callback
 * @param {Number} n
 * @param {Number} cx 
 * @param {Number} cy
 */
Fractal.juliaN = function(zoom, xo, yo, ctx, max_iter, color, n, cx, cy) {
    function coord(x, o, w, a, b) {
        return ((((x / w) * a) - b) * zoom) + (o * a) - b;
    }

    if (color == null) {
        const colorMul = 255 / max_iter;
        color = function(i) {
            i = 255 - (colorMul * i);
            return [i, i, i];
        };
    }

    const imgdata = ctx.createImageData(ctx.canvas.width, ctx.canvas.height);
    for (let x = 0; x < imgdata.width; x++) {
        let zx0 = coord(x, xo, imgdata.width, 3.5, 2.5);
        for (let y = 0; y < imgdata.height; y++) {
            let zx = zx0;
            let zy = coord(y, yo, imgdata.height, 2, 1);

            let iter = 0, zxs = zx * zx, zys = zy * zy;

            while (zxs + zys < 4 && iter < max_iter) {
                const at = n * Math.atan2(zy, zx);
                const p = (zxs + zys) ** (n / 2);

                const xt = (p * Math.cos(at)) + cx;
                zy = (p * Math.sin(at)) + cy;
                zx = xt;
                iter++;

                zxs = zx * zx;
                zys = zy * zy;
            }

            const idx = (y * (imgdata.width * 4)) + (x * 4);
            const c = color(iter);
            imgdata.data[idx] = c[0]
            imgdata.data[idx + 1] = c[1]
            imgdata.data[idx + 2] = c[2];
            imgdata.data[idx + 3] = c[4] == null? 255:c[4];
        }
    }

    ctx.putImageData(imgdata, 0, 0);
}