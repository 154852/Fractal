# Fractal

A static fractal exploration application, visible [here](https://fractal.thundernerds.org).

## Controls
- Drag on the image of the fractal to navigate it.
- Use the mouse wheel to zoom in / out.
- The `Resolution` slider will modify the image resolution, note that increasing it makes the application *much* lower.
- The `Motion Blur` switch will enable / disable the decrease in resolution implemented when the camera moves.
- The `Zoom Speed` value changes the speed of the mouse scrolling to zoom.
- `Max Iterations` is a value used to render the fractal, see the pages below for more information on this variable.
- The `Contrast` and `Brightness` values will change said values for the rendered image, as you scroll further and further into the image.
- Choose one of the three fractals in the selector at the bottom to render the selected type of fractal.

## The fractals

The Mandelbrot set: https://en.wikipedia.org/wiki/Mandelbrot_set
Code at (render.js:18)[https://github.com/154852/Fractal/blob/80c809f29f684454bdfea60ac562df550d6945e9/render.js#L18]

The Julia set: https://en.wikipedia.org/wiki/Julia_Set
Code at (render.js:71)[https://github.com/154852/Fractal/blob/80c809f29f684454bdfea60ac562df550d6945e9/render.js#L71] for the normal, simple version, and (render.js:127)[https://github.com/154852/Fractal/blob/80c809f29f684454bdfea60ac562df550d6945e9/render.js#L127] for the N-type version.
