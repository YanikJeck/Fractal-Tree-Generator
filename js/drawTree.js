const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const sliders = document.getElementsByClassName('Slider');
const multiSliders = document.getElementsByClassName('MultiSlider');
let active = true;

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function drawTree() {
    active = false;
    setTimeout( function() {
        active = true;
        resize();
        ctx.clearRect(0,0,canvas.width,canvas.height);
        createTree(canvas.width/2,canvas.height,Math.PI,sliders[0].value,sliders[1].value,
            sliders[2].value,sliders[3].value);
    },50);
}

function getRandomValues() {
    let randomValues = [];
    for (let i = 0; i < multiSliders.length-1; i+=2) {
        const val1 = multiSliders[i].value;
        const val2 = multiSliders[i+1].value;
        randomValues.push(Math.random() * (Math.max(val1,val2)-Math.min(val1,val2))+Math.min(val1,val2));
    }
    return randomValues;
}

function createTree(posX,posY,angle,length,thickness,color,steps) {
    const posX2 = posX + length *Math.sin(angle);
    const posY2 = posY + length *Math.cos(angle);
    ctx.lineWidth = thickness;
    ctx.strokeStyle = 'hsl('+ color +',100%,50%)';
    ctx.beginPath();
    ctx.moveTo(posX,posY);
    ctx.lineTo(posX2,posY2);
    ctx.stroke();
    ctx.closePath();
    let randomValues = getRandomValues();
    let direction = 2*randomValues[3];
    setTimeout(function () {
        if (steps-- > 0 && active) {
            for (let i = 0; i < Math.round(randomValues[4]); i++) {
                direction *= 1/(i*((3*randomValues[3]+0.5)*i-(7*randomValues[3]+0.5))+2*randomValues[3]);
                createTree(posX2,posY2, angle + direction * (Math.PI / randomValues[3]),
                    length / randomValues[0], thickness / randomValues[1], Number(color)+randomValues[2],steps);
                randomValues = getRandomValues();
                direction = 2*randomValues[3];
            }
        }
    },0);
}