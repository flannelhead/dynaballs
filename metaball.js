var metaball = {
    vx: 0,
    vy: 0,
    ax: 0,
    ay: 0,

    // Function for computing the colouring field
    f: function(x, y) {
        var dx = x - this.x0,
            dy = y - this.y0,
            r2 = dx*dx + dy*dy;

        if (r2 < this.R2) return 1;

        return this.R2 / r2;
    },

    // Computes the magnitude of the force field derived from the interaction
    // potential at the distance r
    F: function(r) {
        if (r > this.Rwell) {
            return this.R2 / (r * r);
        }
        return this.R2 * r * (this.a * r + this.b);
    },

    randomize: function(config) {
        var ball = Object.create(this);

        ball.R = config.rMin + Math.round(Math.random() *
            (config.rMax - config.rMin));
        ball.Rcoll = Math.round(config.rColl * ball.R);
        ball.Rwell = Math.round(config.rWell * ball.R);
        ball.R2 = ball.R * ball.R;
        ball.oneOverR2 = 1 / ball.R2;

        // Constants for repulsive part of the interaction potential
        ball.a = 3 * (2 * config.k * ball.Rwell + 3) / Math.pow(ball.Rwell, 4);
        ball.b = 1 / Math.pow(ball.Rwell, 3) - ball.a * ball.Rwell;

        ball.x0 = ball.R + Math.round(Math.random() *
            (config.width - 2 * ball.R));
        ball.y0 = ball.R + Math.round(Math.random() *
            (config.height - 2*ball.R));

        ball.RGB = HSVtoRGB(config.hMin + (config.hMax - config.hMin) *
            Math.random(), 1, 1);

        return ball;
    }
};

function generateBalls(config) {
    var n = config.nBalls, balls = [], newBall;

    while (n--) {
        do {
            newBall = metaball.randomize(config);
        } while (collidesOthers(newBall, balls));
        balls.push(newBall);
    }

    return balls;
}

function collidesOthers(newBall, balls) {
    var i, len = balls.length, dx, dy, curBall, minDist;
    for (i = 0; i < len; i++) {
        curBall = balls[i];
        dx = newBall.x0 - curBall.x0;
        dy = newBall.y0 - curBall.y0;
        minDist = newBall.R + curBall.R;
        if (dx * dx + dy * dy < minDist * minDist) return true;
    }
    return false;
}
