window.addEventListener('load', function() {
    var canvas = document.getElementById('main'),
        ctx = canvas.getContext('2d');

    config.rMin = Math.round(config.rMin * config.width);
    config.rMax = Math.round(config.rMax * config.width);

    canvas.width = config.width;
    canvas.height = config.height;
    canvas.style.width = config.width + 'px';
    canvas.style.height = config.height + 'px';

    var balls = generateBalls(config);
    var mouseBall = balls[0];
    mouseBall.oneOverR2 = 0;

    var timestamp = null, safeTimeout = 200;
    function draw(time) {
        var dt;
        if (timestamp === null) timestamp = time;
        dt = time - timestamp;
        // Prevent the simulation from exploding
        if (dt > safeTimeout) dt = 0;
        timestamp = time;
        requestAnimationFrame(draw);

        takeTimestep(balls, dt, config);
        ctx.putImageData(computeField(balls, ctx, config.width, config.height),
            0, 0);
    }
    requestAnimationFrame(draw);

    canvas.addEventListener('mousemove', function(event) {
        mouseBall.x0 = event.clientX - canvas.offsetLeft;
        mouseBall.y0 = event.clientY - canvas.offsetTop;
    });
});
