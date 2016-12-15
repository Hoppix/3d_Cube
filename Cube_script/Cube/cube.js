var gl;
var canvas;
var canvasText;

//Objektdaten
var cubePositions;
var cubeColors;
var cubeNormals;

//ObjektBuffer
var cubePositionBuffer;
var cubeColorBuffer;

var modelMatrixLoc;
var modelMatrix;

var viewMatrixLoc;
var viewMatrix;

var projectionMatrixLoc;
var projectionMatrix;

var program;
var keys = [];
var moveSpeed = 0.2;

//Kamaraverktoren
var eye;
var target;
var up;

//Kameraposition
var eye_x,eye_y,eye_z
eye_x = 4.0;
eye_y = 0.0;
eye_z = 4.0;

//Kameraziel
var target_x, target_y,target_z
target_x = 0.0;
target_y = 0.0;
target_z = 0.0;

//Setzen der Werte
eye = vec3.fromValues(eye_x, eye_y, eye_z);
target = vec3.fromValues(target_x, target_y, target_z);
up = vec3.fromValues(0.0, 1.0, 0.0);


window.onload = function init()
{
	// Get canvas and setup webGL
	canvas = document.getElementById("gl-canvas");
	gl = WebGLUtils.setupWebGL(canvas);

	//Listener für Bewegung
	window.addEventListener("keydown", keyDown);
	window.addEventListener("keyup", keyUp);

	//Listener für Maus-Sperre
	pointerLockHandling();
	document.addEventListener('pointerlockchange', setupMouseLock, false);
	document.addEventListener('mozpointerlockchange', setupMouseLock, false);


	if (!gl) { alert("WebGL isn't available"); }

	// Specify position and color of the vertices

									 									// Front
	cubePositions = new Float32Array([  -0.5, -0.5,  0.5, //001
								     0.5, -0.5,  0.5,     //001
								     0.5,  0.5,  0.5,     //001

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
									-0.5,  0.5,  0.5,

									//Plane
									-30, -0.5, -30,
									-30, -0.5, 30,
									30, -0.5, -30,
									-30, -0.5, 30,
									30, -0.5, 30,
									30, -0.5, -30,
								]);
								
	cubeNormals = new Float32Array([
									//Front
									0.0,  0.0,  1.0,
									0.0,  0.0,  1.0,
								    0.0,  0.0,  1.0,
									0.0,  0.0,  1.0,
									
									//Right
									1.0,  0.0,  0.0,
									1.0,  0.0,  0.0,
									1.0,  0.0,  0.0,
									1.0,  0.0,  0.0,
									//Back
									0.0,  0.0, -1.0,
									0.0,  0.0, -1.0,
									0.0,  0.0, -1.0,
									0.0,  0.0, -1.0,
									//Left
									-1.0,  0.0,  0.0,
									-1.0,  0.0,  0.0,
									-1.0,  0.0,  0.0,
									-1.0,  0.0,  0.0,
									//Bottom
									0.0,  -1.0,  0.0,
									0.0,  -1.0,  0.0,
									0.0,  -1.0,  0.0,
									0.0,  -1.0,  0.0,
									//Top
									0.0,  1.0,  0.0,
									0.0,  1.0,  0.0,
									0.0,  1.0,  0.0,
									0.0,  1.0,  0.0,
									//Plane
									0.0,  1.0,  0.0,
									0.0,  1.0,  0.0,
									0.0,  1.0,  0.0,
									0.0,  1.0,  0.0
												]);

									// Front
	cubeColors = new Float32Array([     0, 0, 1, 1,
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
									0, 1, 1, 1,

									0, 0, 0, 1,
									0, 0, 0, 1,
								    0, 0, 0, 1,
									0, 0, 0, 1,
									0, 0, 0, 1,
									0, 0, 0, 1,
								]);

	// Configure viewport

	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(1.0, 1.0, 1.0, 1.0);
	gl.enable(gl.DEPTH_TEST);

	// Init shader program and bind it

	program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);

    // Load positions into the GPU and associate shader variables

	cubePositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cubePositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, cubePositions, gl.STATIC_DRAW);


	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	// Load colors into the GPU and associate shader variables

	cubeColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, cubeColors, gl.STATIC_DRAW);

	var vColor = gl.getAttribLocation(program, "vColor");
	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vColor);
	
	//setup Normals
	
	var normalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, cubeNormals, gl.STATIC_DRAW);
	
	var vNormal = gl.getAttribLocation(program, "vNormal");
	gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vNormal);

	// Set model matrix

	modelMatrix = new Float32Array([
									1, 0, 0, 0,
									0, 1, 0, 0,
									0, 0, 1, 0,
									0, 0, 0, 1]);

	modelMatrixLoc = gl.getUniformLocation(program, "modelMatrix");
	gl.uniformMatrix4fv(modelMatrixLoc, false, modelMatrix);
	

	// Set projection matrix
	projectionMatrix = mat4.create();
	mat4.perspective(projectionMatrix, Math.PI * 0.25, canvas.width / canvas.height, 0.5, 100);

	projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
	gl.uniformMatrix4fv(projectionMatrixLoc, false, projectionMatrix);

	render();
};

function render()
{
	//Keyinputs per frame
	moveEventHandling();
	
	//Kamerakoordinaten per frame
	viewMatrix = mat4.create();
	mat4.lookAt(viewMatrix, eye, target, up);
	viewMatrixLoc = gl.getUniformLocation(program, "viewMatrix");
	gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix);

	//var mvMatrix;
	//mat4.multiply(mvMatrix, viewMatrix, modelMatrix);
	//m*v | v*m ? typsicherheit
	//alert(mvMatrix)
	var normalMatrix = mat4.create();
	mat4.invert(normalMatrix, viewMatrix);
	mat4.transpose(normalMatrix, normalMatrix);
	normalMatrixLoc = gl.getUniformLocation(program, "normalMatrix");
	gl.uniformMatrix4fv(normalMatrixLoc, false, normalMatrix);
	alert(normalMatrix);

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLES, 0, 108/3+6);
	requestAnimFrame(render);
}

function moveEventHandling()
{
	moveForward();
	moveBackward();
	moveLeft();
	moveRight();
}

function keyDown(e)
{
	keys[e.keyCode] = true;
}

function keyUp(e)
{
	keys[e.keyCode] = false;
}


function moveForward()
{
	if (keys[87])
	{
		const backupEye = eye[1];
		const backupTarget = target[1];
		var distance = vec3.create();
		vec3.sub(distance, target, eye);
		vec3.normalize(distance, distance);
		vec3.scale(distance, distance, moveSpeed);
		vec3.add(eye, eye, distance);
		vec3.add(target, target, distance);
		eye[1] = backupEye;
		target[1] = backupTarget;
	}
}

function moveBackward()
{
	if (keys[83])
	{
		const backupEye = eye[1];
		const backupTarget = target[1];
		var distance = vec3.create();
		vec3.sub(distance, target, eye);
		vec3.normalize(distance, distance);
		vec3.scale(distance, distance, moveSpeed);
		vec3.sub(eye, eye, distance);
		vec3.sub(target, target, distance);
		eye[1] = backupEye;
		target[1] = backupTarget;
	}
}

function moveLeft()
{
	if (keys[65])
	{
		const backupEye = eye[1];
		const backupTarget = target[1];
		var distance = vec3.create();
		var rotatedTarget = vec3.create();
		vec3.rotateY(rotatedTarget, target, eye, Math.PI/2);
		vec3.sub(distance, rotatedTarget, eye);
		vec3.normalize(distance, distance);
		vec3.scale(distance, distance, moveSpeed);
		vec3.add(eye, eye, distance);
		vec3.add(target, target, distance);
		eye[1] = backupEye;
		target[1] = backupTarget;

	}
}

function moveRight()
{
	if (keys[68]) // d
	{
		const backupEye = eye[1];
		const backupTarget = target[1];
		var distance = vec3.create();
		var rotatedTarget = vec3.create();
		vec3.rotateY(rotatedTarget, target, eye, Math.PI*3/2);
		vec3.sub(distance, rotatedTarget, eye);
		vec3.normalize(distance, distance);
		vec3.scale(distance, distance, moveSpeed);
		vec3.add(eye, eye, distance);
		vec3.add(target, target, distance);
		eye[1] = backupEye;
		target[1] = backupTarget;
	}
}


function pointerLockHandling()
{
	//Fragt beim Brower den Mouselock an.
	canvas.requestPointerLock = canvas.requestPointerLock ||
		canvas.mozRequestPointerLock;

	document.exitPointerLock = document.exitPointerLock ||
		document.mozExitPointerLock;

	canvas.onclick = function()
	{
		canvas.requestPointerLock();
	}
}

function setupMouseLock()
{
	//Wenn die canvas geklickt wird dann wird die Mausbewegung aktiviert.
	if (document.pointerLockElement === canvas ||
		document.mozPointerLockElement === canvas)
	{
		document.addEventListener("mousemove", setLook, false);
	}
	else
	{
		document.removeEventListener("mousemove", setLook, false);
	}
}

function setLook(e)
{
	var korrektur = -0.0033;
	vec3.rotateY(target, target, eye, e.movementX*korrektur);
	vec3.rotateX(target, target, eye, e.movementY*korrektur);
}


function degreeToRadian(degrees)
{
	//Hilfsfunktion
	return (degrees/180) * Math.PI()
}

function goFullScreen(){
    var canvasFull = document.getElementById("gl-canvas");
    if(canvasFull.requestFullScreen)
        canvasFull.requestFullScreen();
    else if(canvasFull.webkitRequestFullScreen)
        canvas.webkitRequestFullScreen();
    else if(canvasFull.mozRequestFullScreen)
        canvasFull.mozRequestFullScreen();
}
