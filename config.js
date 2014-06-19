var config = {
    width: 800,
    height: 450,

    nBalls: 5,

    G: 2e-4,  // gravitation constant

    potential: 'repulsive',
    kAttractive: -5e-1,
    kRepulsive: 5e-2,

    rMin: 0.03,  // Min and max radius relative to width
    rMax: 0.06,

    rColl: 0.5,  // Radius for collisions with walls
    rWell: 2,  // Radius for the surrounding potential well

    hMin: 0.4,
    hMax: 0.7,

    keybindings: {
        'r': 'reset',
        't': 'toggle-potential',
        '+': 'add-ball',
        '-': 'remove-ball'
    }
};
