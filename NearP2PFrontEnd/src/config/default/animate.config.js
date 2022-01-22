const direct_s = ['left', 'right']
const direct_1 = ['left', 'right', 'down', 'up']
const direct_1_b = ['downBig', 'upBig', 'leftBig', 'rightBig']
const direct_2 = ['topLeft', 'bottomRight', 'topRight', 'bottomLeft']
const direct_3 = ['downLeft', 'upRight', 'downRight', 'upLeft']

// animate.css disposition
const ANIMATE = {
  preset: [ //Preset animation configuration
    {name: 'back', alias: 'As it drew closer', directions: direct_1},
    {name: 'bounce', alias: 'Bounce', directions: direct_1.concat('default')},
    {name: 'fade', alias: 'Downplay', directions: direct_1.concat(direct_1_b).concat(direct_2).concat('default')},
    {name: 'flip', alias: 'Turn over', directions: ['x', 'y']},
    {name: 'lightSpeed', alias: 'Velocity of light', directions: direct_s},
    {name: 'rotate', alias: 'Revolve', directions: direct_3.concat('default')},
    {name: 'roll', alias: 'Rolling', directions: ['default']},
    {name: 'zoom', alias: 'Zomm', directions: direct_1.concat('default')},
    {name: 'slide', alias: 'Slide', directions: direct_1},
  ]
}
module.exports = ANIMATE
