$(function(){
    resizeDiv();
	nodes_init();
});

$(function(){
    window.onmouseout = function() {
        console.log("mouse out");
        mouseIn = 0;
    }
    window.onmousemove = function(event) {
        event = event || window.event; // IE-ism
        mouseX = event.clientX;
        mouseY = event.clientY;
        mouseIn = 1;
    }
});

function resizeDiv() {
    wH = $(window).height();
    wW = $(window).width();
}

var looper, canvas = document.getElementById('party'),
    context = canvas.getContext('2d'),
    nodes, NUM_NODES = 150,
    minDist = 70,
    springAmount = 0.0005,
    rgb = '255,255,255';

function nodes_init() {
    createNodes();
    looper = setInterval(nodes_loop, 1000 / 31);
}

function createNodes() {
    nodes = [];
    mouseIn = 0;
    mouseX = 0;
    mouseY = 0;
    for (var i = 0; i < NUM_NODES; i++) {
        var node = {
            radius: 1.5,
            x: Math.random() * wW,
            y: Math.random() * wH,
            vx: Math.random() * 6 - 3,
            vy: Math.random() * 6 - 3,
            mass: 1,
            update: function () {
			    wH = $(window).height();
			    wW = $(window).width();
                this.x += this.vx * 0.95;
                this.y += this.vy * 0.95;
                if (this.x > wW) {
                    this.x = 0;
                } else if (this.x < 0) {
                    this.x = wW;
                }
                if (this.y > wH) {
                    this.y = 0;
                } else if (this.y < 0) {
                    this.y = wH;
                }
            },
            draw: function () {
                context.fillStyle = "rgb(" + rgb + ")";
                context.beginPath();
                context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
                context.closePath();
                context.fill();
            }
        };
        nodes.push(node);
    }
    var cursor = {
            radius: 1.5,
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            mass: 1,
            update: function () {
                if (mouseIn) {
                    this.x = mouseX;
                    this.y = mouseY;
                    this.vx=0;
                    this.vy=0;
                }
                else {
                    this.x += this.vx;
                    this.y += this.vy;
                    if (this.x > wW) {
                        this.x = 0;
                    } else if (this.x < 0) {
                        this.x = wW;
                    }
                    if (this.y > wH) {
                        this.y = 0;
                    } else if (this.y < 0) {
                        this.y = wH;
                    }
                }
            },
            draw: function () {
                context.fillStyle = "rgb(" + rgb + ")";
                context.beginPath();
                context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
                context.closePath();
                context.fill();
            }
        }
    nodes.push(cursor);
}

function nodes_loop() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (i = 0; i < NUM_NODES + 1; i++) {
        nodes[i].update();
        nodes[i].draw();
    }
    for (i = 0; i < NUM_NODES; i++) {
        var node1 = nodes[i];
        for (var j = i + 1; j < NUM_NODES + 1; j++) {
            var node2 = nodes[j];
            spring(node1, node2);
        }
    }
}

function spring(na, nb) {
    var dx = nb.x - na.x;
    var dy = nb.y - na.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < minDist) {
        context.beginPath();
        context.strokeStyle = "rgba(" + rgb + "," + (1 - dist / minDist) + ")";
        context.moveTo(na.x, na.y);
        context.lineTo(nb.x, nb.y);
        context.stroke();
        context.closePath();
        var ax = dx * springAmount;
        var ay = dy * springAmount;
        na.vx += ax;
        na.vy += ay;
        nb.vx -= ax;
        nb.vy -= ay;
    }
}
