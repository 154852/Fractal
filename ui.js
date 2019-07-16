const UI = {};

/**
 * @callback TransformationUpdateCallback
 * @param {{zoom: Number, offset: [Number, Number], resolutionOffset: Number}} transformation Transformation data
 * @returns {void}
 */

/**
 * Create drag and zoom listeners on element
 * @param {HTMLElement} element Element to listen to
 * @param {[Number, Number]} offset Default offset
 * @param {TransformationUpdateCallback} updateCB Callback to be called on change
 */
UI.createTransformContext = function(element, offset, resolutionOffset, updateCB) {
    const transformation = {
        zoom: 1,
        offset: offset || [0, 0],//element.width / 2, element.height / 2
        resolutionOffset: resolutionOffset,
        updateResolution: function(res) {
            this.resolutionOffset = res;
        },
        onEnd: null,
        zoomSpeed: 1
    };

    let actionEnd = null;

    element.addEventListener("wheel", function(event) {
        transformation.zoom = Math.max(transformation.zoom + ((Math.sign(event.deltaY) * 0.03 * transformation.zoomSpeed) * transformation.zoom), 0);
        event.preventDefault();
        transformation.lastMotion = Date.now();
        updateCB(transformation); 
        
        if (actionEnd != null) window.clearTimeout(actionEnd);
        actionEnd = window.setTimeout(function() {
            transformation.onEnd(transformation);
            actionEnd = null;
        }, 500);
    });
    
    let mousedown = false;
    let down = [0, 0];
    element.addEventListener("mousedown", function(event) {
        mousedown = true;
        down = [event.clientX, event.clientY];

        if (actionEnd != null) window.clearTimeout(actionEnd);
    });
    
    document.addEventListener("mouseup", function(event) {
        if (mousedown) {
            transformation.offset[0] += (down[0] - event.clientX) * transformation.resolutionOffset * transformation.zoom / element.width;
            transformation.offset[1] += (down[1] - event.clientY) * transformation.resolutionOffset * transformation.zoom / element.width;

            if (actionEnd != null) window.clearTimeout(actionEnd);
            actionEnd = window.setTimeout(function() {
                transformation.onEnd(transformation);
                actionEnd = null;
            }, 500);

            mousedown = false;
        }
    });
    
    element.addEventListener("mousemove", function(event) {
        if (mousedown) {
            transformation.lastMotion = Date.now();
            updateCB({
                zoom: transformation.zoom,
                offset: [
                    transformation.offset[0] + ((down[0] - event.clientX) * transformation.resolutionOffset * transformation.zoom / element.width),
                    transformation.offset[1] + ((down[1] - event.clientY) * transformation.resolutionOffset * transformation.zoom / element.width)
                ],
                lastMotion: transformation.lastMotion
            });
        }
    });

    return transformation;
}

/**
 * Listen for window resize
 * @param {(Number, Number) => void} callback
 */
UI.onResize = function(callback) {
    const event = function() {
        callback(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", event)
    return event;
}

/**
 * Toggles height (0 to auto) of element sibling to sender, with class "toggle-h"
 * @param {HTMLElement} sender
 */
UI.toggleHeight = function(sender) {
    sender.parentElement.querySelector(".toggle-h").classList.toggle("height-down");

    const rotating = sender.querySelector(".rotating");
    if (rotating != null) rotating.classList.toggle("height-rotate");
}

/**
 * Sets text of value indicator of slider
 * @param {HTMLElement} slider
 * @param {Number} multiplier
 */
UI.setSliderValue = function(slider, multiplier=1, round=100) {
    slider.parentElement.querySelector(".slideval").innerText = parseInt(parseInt(slider.value) * multiplier * round) / round;
}

/**
 * Rotates loading icon
 * @param {Boolean} working
 */
UI.setWorking = function(working) {
    const classList = document.getElementById("working").classList;
    if (working) classList.add("spin");
    else classList.remove("spin");
}

/**
 * Sets text of value indicator of slider
 * @param {HTMLElement} sender
 */
UI.updateChoice = function(sender) {
    const last = sender.parentElement.querySelector(".selected");
    if (last.hasAttribute("toggle")) {
        last.getAttribute("toggle").split(",").forEach(function(selector) {
            document.querySelector(selector).classList.add("hide");
        });
    }

    last.classList.remove("selected");
    sender.classList.add("selected");

    if (sender.hasAttribute("toggle")) {
        sender.getAttribute("toggle").split(",").forEach(function(selector) {
            document.querySelector(selector).classList.remove("hide");
        });
    }

    return Array.from(sender.parentElement.children).indexOf(sender);
}