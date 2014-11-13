dynaballs
=========

*See the demo at* https://flannelhead.github.io/dynaballs
(the page is very resource intensive). Works on HTML5-capable browsers.

What?
-----
Metaballs with dynamics simulation and some interesting interactions
done in plain JavaScript.

Why?
----
To demonstrate rendering of [metaballs](https://en.wikipedia.org/wiki/Metaballs)
on a canvas (in a pretty fast manner), combined with dynamics simulation using
some basic Newtonian mechanics and
[Verlet integration](https://en.wikipedia.org/wiki/Verlet_integration).
Accidentally this also started looking pretty physical.

How do the metaballs interact?
------------------------------
The interaction potential of a metaball is defined in two pieces:

- At large distances, the potential is like standard gravity: proportional to
  the mass (or in this case, area) of the ball and inversely proportional to the
  distance.
- At close distance, the potential is either a quite low barrier (repulsive)
  or a well (attractive). This is achieved using a third degree polynomial and
  demanding continuity.

Thus there can be quite interesting phenomena, like two or more balls trapping
each other (try reversing the potential in that situation!)

What's the high precision mode about?
-------------------------------------
When the high precision mode is not enabled, the metaballs are precomputed.
Each of the metaballs have their own "colour fields", which are of the form V =
1/r, where V is value and r is distance from the ball.

In an effort to make the
animation run faster, I decided to precompute these fields and store them as
arrays so that I can just
sum the field into the canvas, based on the position of the ball. However, this
also generates some artifacts due to discretization of position and colour, and
also consumes more memory. In the high precision mode, the fields are computed
every frame, which is quite CPU intensive, but we get to use floating point
arithmetics during the whole rendering and don't need to consume as much memory.

