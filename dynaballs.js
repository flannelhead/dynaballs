window.addEventListener('load', function() {
    var canvas = document.getElementById('main'), ctx = canvas.getContext('2d'),
        timestamp = null, safeTimeout = 200, reqId = null,
        balls, mouseBall;

    config.rMin = Math.round(config.rMin * config.width);
    config.rMax = Math.round(config.rMax * config.width);

    canvas.width = config.width;
    canvas.height = config.height;
    canvas.style.width = config.width + 'px';
    canvas.style.height = config.height + 'px';

    function draw(time) {
        var dt;
        if (timestamp === null) timestamp = time;
        dt = time - timestamp;
        // Prevent the simulation from exploding
        if (dt > safeTimeout) dt = 0;
        timestamp = time;
        reqId = requestAnimationFrame(draw);

        takeTimestep(balls, dt, config);
        ctx.putImageData(computeField(balls, ctx, config.width, config.height),
            0, 0);
    }

    function pause() {
        if (reqId !== null) {
            cancelAnimationFrame(reqId);
            reqId = null;
        }
    }

    function resume() {
        reqId = requestAnimationFrame(draw);
    }

    function init() {
        pause();

        balls = generateBalls(config);
        mouseBall = balls[0];
        mouseBall.oneOverR2 = 0;

        resume();
    }
    init();

    function addBall() {
        pause();

        config.nBalls += 1;
        addNonCollidingBall(balls, config);

        resume();
    }

    function removeBall() {
        if (config.nBalls === 1) return;
        
        pause();

        config.nBalls -= 1;
        balls.pop();

        resume();
    }

    canvas.addEventListener('mousemove', function(event) {
        mouseBall.x0 = event.clientX - canvas.offsetLeft;
        mouseBall.y0 = event.clientY - canvas.offsetTop;
    });

    function ascii(c) {
        return c.charCodeAt(0);
    }

    var keys = {
        rKey: ascii('r'),
        plusKey: ascii('+'),
        minusKey: ascii('-')
    };

    document.addEventListener('keypress', function(event) {
        var code = event.charCode;

        if (code === keys.rKey) {
            init();
        } else if (code === keys.plusKey) {
            addBall();
        } else if (code === keys.minusKey) {
            removeBall();
        }

        event.stopPropagation();
        event.preventDefault();
    });
});
