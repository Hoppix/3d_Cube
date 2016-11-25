var gl;
var canvas;

var positions;
var colors;

var positionBuffer;
var colorBuffer;

var modelMatrixLoc;
var modelMatrix;

var viewMatrixLoc;
var viewMatrix;

var projectionMatrixLoc;
var projectionMatrix;

//KamaraPosition
var eye;
var target;
var up;

var program;

var x,y,z
x = -2.0
y = 2.0
z = 2.0
window.onload = function init()
{
	// Get canvas and setup webGL

	canvas = document.getElementById("gl-canvas");
	gl = WebGLUtils.setupWebGL(canvas);
	window.addEventListener("keypress", eventHandling);
	if (!gl) { alert("WebGL isn't available"); }

	// Specify position and color of the vertices

									 // Front
	positions = new Float32Array([  -0.5, -0.5,  0.5,
								     0.5, -0.5,  0.5,
								     0.5,  0.5,  0.5,

									 0.5,  0.5,  0.5,
									-0.5,  0.5,  0.5,
									-0.5, -0.5,  0.5,

									 // Right
									 0.5,  0.5,  0.5,
									 0.5, -0.5,  0.5,
									 0.5, -0.5, -0.5,

									 0.5, -0.5, -0.5,
									 0.5,  0.5, -0.5,
									 0.5,  0.5,  0.5,

									 // Back
									-0.5, -0.5, -0.5,
									 0.5, -0.5, -0.5,
									 0.5,  0.5, -0.5,

									 0.5,  0.5, -0.5,
									-0.5,  0.5, -0.5,
									-0.5, -0.5, -0.5,

									 // Left
									-0.5,  0.5,  0.5,
									-0.5, -0.5,  0.5,
									-0.5, -0.5, -0.5,

									-0.5, -0.5, -0.5,
									-0.5,  0.5, -0.5,
									-0.5,  0.5,  0.5,

									 // Bottom
									-0.5, -0.5,  0.5,
									 0.5, -0.5,  0.5,
									 0.5, -0.5, -0.5,

									 0.5, -0.5, -0.5,
									-0.5, -0.5, -0.5,
									-0.5, -0.5,  0.5,

									 // Top
									-0.5,  0.5,  0.5,
									 0.5,  0.5,  0.5,
									 0.5,  0.5, -0.5,

									 0.5,  0.5, -0.5,
									-0.5,  0.5, -0.5,
									-0.5,  0.5,  0.5
								]);

									// Front
	colors = new Float32Array([     0, 0, 1, 1,
									0, 0, 1, 1,
									0, 0, 1, 1,
									0, 0, 1, 1,
									0, 0, 1, 1,
									0, 0, 1, 1,

									// Right
									0, 1, 0, 1,
									0, 1, 0, 1,
									0, 1, 0, 1,
									0, 1, 0, 1,
									0, 1, 0, 1,
									0, 1, 0, 1,

									// Back
									1, 0, 0, 1,
									1, 0, 0, 1,
									1, 0, 0, 1,
									1, 0, 0, 1,
									1, 0, 0, 1,
									1, 0, 0, 1,

									// Left
									1, 1, 0, 1,
									1, 1, 0, 1,
									1, 1, 0, 1,
									1, 1, 0, 1,
									1, 1, 0, 1,
									1, 1, 0, 1,

									// Bottom
									1, 0, 1, 1,
									1, 0, 1, 1,
									1, 0, 1, 1,
									1, 0, 1, 1,
									1, 0, 1, 1,
									1, 0, 1, 1,

									// Top
									0, 1, 1, 1,
									0, 1, 1, 1,
									0, 1, 1, 1,
									0, 1, 1, 1,
									0, 1, 1, 1,
									0, 1, 1, 1
								]);

	// Configure viewport

	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(1.0, 1.0, 1.0, 1.0);
	gl.enable(gl.DEPTH_TEST);

	// Init shader program and bind it

	program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);

    // Load positions into the GPU and associate shader variables

	positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	// Load colors into the GPU and associate shader variables

	colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

	var vColor = gl.getAttribLocation(program, "vColor");
	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vColor);

	// Set model matrix

	modelMatrix = new Float32Array([1, 0, 0, 0,
									0, 1, 0, 0,
									0, 0, 1, 0,
									0, 0, 0, 1]);

	modelMatrixLoc = gl.getUniformLocation(program, "modelMatrix");
	gl.uniformMatrix4fv(modelMatrixLoc, false, modelMatrix);

    // Set view matrix
	//
	eye = vec3.fromValues(x, y, z);
	target = vec3.fromValues(0.0, 0.0, 0.0);
	up = vec3.fromValues(0.0, 1.0, 0.0);

	viewMatrix = mat4.create();
	mat4.lookAt(viewMatrix, eye, target, up);

	viewMatrixLoc = gl.getUniformLocation(program, "viewMatrix");
	gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix);

    // Set projection matrix
	// Kamera
	projectionMatrix = mat4.create();
	mat4.perspective(projectionMatrix, Math.PI * 0.25, canvas.width / canvas.height, 0.5, 100);

	projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
	gl.uniformMatrix4fv(projectionMatrixLoc, false, projectionMatrix);

	render();
};

function render()
{
	eye = vec3.fromValues(x, y, z);
	target = vec3.fromValues(0.0, 0.0, 0.0);
	up = vec3.fromValues(0.0, 1.0, 0.0);

	viewMatrix = mat4.create();
	mat4.lookAt(viewMatrix, eye, target, up);

	viewMatrixLoc = gl.getUniformLocation(program, "viewMatrix");
	gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix);

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLES, 0, positions.length/3);
	requestAnimFrame(render);
}

function eventHandling(e)
{

	//Auslesen des keycodes zum spezifizieren welche Taste gedrückt wurde.
	//38: ArrowUp, 37: ArrowLeft, 39: ArrowRight
	switch(e.keyCode)
	{
		case 38:
					moveFoward();
					break;
		case 37:
					moveLeft();
					break;
		case 39:
					moveRight();
					break;

		case 40:
					moveBack();
					break;

		default:
					break;
	}
}

function moveFoward()
{
	x = x-0.1*((1/Math.abs(x))*x)
}

function moveBack()
{
	x = x+0.1*((1/Math.abs(x))*x)
}

function moveLeft()
{
	z =z+0.1*((1/Math.abs(z))*z)
}

function moveRight()
{
	z = z-0.1*((1/Math.abs(z))*z)
}
