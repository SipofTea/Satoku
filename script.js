const nOfBoxes = 5;
const gameWrapper = document.getElementById('gameWrapper');
var score = 1
var hue = Math.random().toString();


function generateColors() {

    var sat = 0
    var colors = [];
    for (i = 0; i < nOfBoxes; i++) {
        sat = sat + 1 / nOfBoxes;
        var rgbColors = hslToRgb(hue, sat, 0.5);
        colors.push("rgb(" + Math.round(rgbColors[0]) + ", " + Math.round(rgbColors[1]) + ", " + Math.round(rgbColors[2]) + ")");
    }
    return colors;
}

/**
 * Credit to: https://gist.github.com/mjackson/5311256
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
function hslToRgb(h, s, l) {
    var r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;

        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [r * 255, g * 255, b * 255];
}

function generateBoxes() {
    var colors = generateColors();
    for (i = 0; i < nOfBoxes; i++) {
        var colorNumber = Math.floor(Math.random() * colors.length)
        var thisColor = colors.splice(colorNumber, 1);
        var box = document.createElement("div");
        box.style.backgroundColor = thisColor;
        box.className = "box";
        box.setAttribute("id", "box" + i);
        box.draggable = "true";
        addEventHandlers(box);
        gameWrapper.append(box);
    }
}

function addEventHandlers(box) {
    box.addEventListener("dragstart", drag);
    box.addEventListener("dragover", allowDrop);
    box.addEventListener("drop", drop);
}

// Drag and drop inspired by: https://ramya-bala221190.medium.com/dragging-dropping-and-swapping-elements-with-javascript-11d9cdac2178
function drag(e) {
    e.dataTransfer.setData("startID", e.target.id);
    e.dataTransfer.setData("startPosition", Array.prototype.indexOf.call(gameWrapper.children, e.target));
}

function allowDrop(e) {
    e.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const startID = event.dataTransfer.getData("startID");
    const startIndex = event.dataTransfer.getData("startPosition");
    const endIndex = Array.prototype.indexOf.call(gameWrapper.children, event.target);
    if (endIndex == nOfBoxes) {
        gameWrapper.append(document.getElementById(startID));
    } else if (startIndex < endIndex) {
        gameWrapper.insertBefore(document.getElementById(startID), event.target.nextSibling);
    } else {
        gameWrapper.insertBefore(document.getElementById(startID), event.target);
    }
}

function checkMatch() {
    var colors = generateColors();
    var boxes = gameWrapper.children;
    var correct = 0
    for (i = 0; i < nOfBoxes; i++) {
        var box = boxes[i];
        if (box.style.backgroundColor == colors[i]) {
            var correct = correct + 1;
        } else {
            document.getElementById('score').innerHTML = "Incorrect!";
        }

    }
    if (correct == nOfBoxes) {
        document.getElementById('score').innerHTML = "Correct!";
        setTimeout(() => {
            document.getElementById('score').innerHTML = "Score:" + score++;
        }, 2000);

        newLevel();
    }
}

function newLevel() {
    hue = Math.random().toString();
    while (gameWrapper.firstChild) {
        gameWrapper.removeChild(gameWrapper.lastChild);
    }
    generateBoxes();
}

newLevel();