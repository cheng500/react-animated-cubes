# react-animated-cubes
Simple Three JS Cube Edges Falling Animation

**[DEMO](https://nckdev.agency/lab/react-animated-cubes/en)**

### Installation
`npm install --save react-animated-cubes`

Use `npm start` to preview

### Simple Usage
```javascript
  <AnimatedCubes />
```

### Props
name|required|type|default|description
----|--------|----|-------|-----------
backgroundColor|false|string|"#262626"|Background color of the \<canvas\>
edgeColor|false|string|"#59c0bb"|Edge color of the cubes
maxEdgeLength|false|number|500|Maximum edge length
minEdgeLength|false|number|100|Minimum edge length
maxFallingSpeed|false|number|10|Maximum falling speed per frame
minFallingSpeed|false|number|5|Minimum falling speed per frame
maxRotationSpeed|false|number|0.03|Maximum rotation speed per frame (1 = 360°)
minRotationSpeed|false|number|0.01|Minimum rotation speed per frame (1 = 360°)
numberOfCubes|false|number|5|Maximum number of cubes to be falling at once
style|false|Object||Style of container div


### Support
If you like this plugin, please consider donating to a small time developer (me)!

**[Donate](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=2CQSKFWR9LREL&source=url)**