window.addEventListener('load', function() {
    var canvas = document.getElementById('main'), ctx = canvas.getContext('2d'),
        timestamp = null, safeTimeout = 200, reqId = null,
        balls, mouseBall, frameCount = 0, sampleTime = 0,
        fps = document.getElementById('fps'),
        potential = document.getElementById('potential'),
        canvasContainer = canvas.offsetParent;

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
        frameCount++;
        sampleTime += dt;
        if (sampleTime > 1000) {
            fps.textContent = (1000 * frameCount / sampleTime).toFixed(1);
            sampleTime = 0;
            frameCount = 0;
        }

        reqId = requestAnimationFrame(draw);

        dynamics.takeTimestep(metaballs.balls, dt, config);
        ctx.putImageData(graphics.computeField(metaballs.balls,
            metaballs.fields, ctx, config.width, config.height), 0, 0);
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

        refreshPotential();
        metaballs.generateBalls(config);
        mouseBall = metaballs.balls[0];
        mouseBall.oneOverR2 = 0;

        resume();
    }
    init();

    function addBall() {
        pause();
        config.nBalls++;
        metaballs.addNonCollidingBall(config);
        resume();
    }

    function removeBall() {
        if (metaballs.balls.length === 1) return;

        pause();
        config.nBalls--;
        metaballs.popBall();
        resume();
    }

    function togglePotential() {
        pause();

        if (config.potential === 'repulsive') {
            config.potential = 'attractive';
        } else {
            config.potential = 'repulsive';
        }
        refreshPotential();
        metaballs.computeCoefficients(config.k);

        resume();
    }

    function refreshPotential() {
        if (config.potential === 'repulsive') {
            config.k = config.kRepulsive;
            potential.textContent = 'repulsive';
        } else {
            config.k = config.kAttractive;
            potential.textContent = 'attractive';
        }
    }

    canvas.addEventListener('mousemove', function(event) {
        mouseBall.x0 = event.clientX - canvas.offsetLeft -
            canvasContainer.offsetLeft;
        mouseBall.y0 = event.clientY - canvas.offsetTop -
            canvasContainer.offsetTop;
    });

    var keyActions = {
        'reset': {
            callback: init,
            description: 'restart'
        },
        'add-ball': {
            callback: addBall,
            description: 'add a ball'
        },
        'remove-ball': {
            callback: removeBall,
            description: 'remove a ball'
        },
        'toggle-potential': {
            callback: togglePotential,
            description: 'toggle potential'
        }
    };

    keybindings.listBindings(config.keybindings, keyActions,
        document.getElementById('keys'));
    keybindings.bindKeys(config.keybindings, keyActions);
});
