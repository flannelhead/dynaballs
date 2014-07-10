var dynamics = {
    applyForces: function(balls, G) {
        var i, j, len, dx, dy, r, ball1, ball2, F, Fy, Fx;

        for (i = 0, len = balls.length; i < len; i++) {
            balls[i].Fx = balls[i].Fy = 0;
        }

        for (i = 0; i < len; i++) {
            ball1 = balls[i];
            for (j = i + 1; j < len; j++) {
                ball2 = balls[j];
                dx = ball2.x0 - ball1.x0;
                dy = ball2.y0 - ball1.y0;
                r = Math.sqrt(dx * dx + dy * dy);
                // Compute the magnitude of force caused by ball1 on ball2
                F = G * ball2.R2 * ball1.F(r) / r;
                // Compute the direction of the force
                Fx = dx * F;
                Fy = dy * F;
                ball2.Fx -= Fx;
                ball2.Fy -= Fy;
                // Newton III: the reaction force is equal but opposite
                ball1.Fx += Fx;
                ball1.Fy += Fy;
            }
            // Newton II: a = F/m. Here radius squared represents mass.
            ball1.ax = ball1.oneOverR2 * ball1.Fx;
            ball1.ay = ball1.oneOverR2 * ball1.Fy;
        }
    },

    integrate: function(balls, dt, G) {
        var i, len, halfDt = dt / 2, ball;

        // Velocity Verlet step
        // http://en.wikipedia.org/wiki/Verlet_integration#Velocity_Verlet

        // Compute half-timestep velocities
        for (i = 0, len = balls.length; i < len; i++) {
            ball = balls[i];
            ball.vxHalf = ball.vx + halfDt * ball.ax;
            ball.vyHalf = ball.vy + halfDt * ball.ay;
            ball.x0 += dt * ball.vxHalf;
            ball.y0 += dt * ball.vyHalf;
        }

        // Compute new accelerations
        dynamics.applyForces(balls, G);

        // Compute full-step velocities
        for (i = 0; i < len; i++) {
            ball = balls[i];
            ball.vx = ball.vxHalf + halfDt * ball.ax;
            ball.vy = ball.vyHalf + halfDt * ball.ay;
        }
    },

    // Solves collisions with walls
    solveCollisions: function(balls, width, height) {
        var i, len, ball, Rcoll;
        for (i = 0, len = balls.length; i < len; i++) {
            ball = balls[i];
            Rcoll = ball.Rcoll;
            if (ball.x0 - Rcoll < 0) {
                ball.x0 = Rcoll;
                ball.vx *= -1;
            }

            if (ball.x0 + Rcoll > width) {
                ball.x0 = width - Rcoll;
                ball.vx *= -1;
            }

            if (ball.y0 - Rcoll < 0) {
                ball.y0 = Rcoll;
                ball.vy *= -1;
            }

            if (ball.y0 + Rcoll > height) {
                ball.y0 = height - Rcoll;
                ball.vy *= -1;
            }
        }
    },

    takeTimestep: function(balls, dt, config) {
        dynamics.integrate(balls, dt, config.G);
        dynamics.solveCollisions(balls, config.width, config.height);
    }
};
