var gl;
var canvas;
var canvasText;
//Objektdaten
var cubePositions;
var cubeColors;
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
	window.addEventListener("keypress", moveEventHandling);

	//Listener für Maus-Sperre
	pointerLockHandling();
	document.addEventListener('pointerlockchange', setupMouseLock, false);
	document.addEventListener('mozpointerlockchange', setupMouseLock, false);


	if (!gl) { alert("WebGL isn't available"); }

	// Specify position and color of the vertices

									 									// Front
	cubePositions = new Float32Array([  -0.5, -0.5,  0.5,
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

	// Set model matrix

	modelMatrix = new Float32Array([1, 0, 0, 0,
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

	canvasCoords();
	canvasGuide();
	render();
};

function render()
{
	canvasCoords();

	viewMatrix = mat4.create();
	mat4.lookAt(viewMatrix, eye, target, up);

	viewMatrixLoc = gl.getUniformLocation(program, "viewMatrix");
	gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix);

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLES, 0, cubePositions.length/3);
	requestAnimFrame(render);
}

function moveEventHandling(e)
{
	//Auslesen des keycodes zum spezifizieren welche Taste gedrückt wurde.
	//38: ArrowUp, 37: ArrowLeft, 39: ArrowRight
	//WASD Keycodes funktionieren nicht.
	switch(e.keyCode)
	{
		case 38:
					moveForward()
					//moveFowardNew();
					break;
		case 37:
					moveLeft()
					break;
		case 39:
					moveRight()
					break;

		case 40:
					moveBackward()
					break;

		default:
					break;
	}
}



function moveForward()
{
	var distance = vec3.create();
		vec3.sub(distance, target, eye);
		vec3.normalize(distance, distance);
		vec3.scale(distance, distance, moveSpeed);
		vec3.add(eye, eye, distance);
		vec3.add(target, target, distance);

}

function moveBackward()
{
	var distance = vec3.create();
		vec3.sub(distance, target, eye);
		vec3.normalize(distance, distance);
		vec3.scale(distance, distance, moveSpeed);
		vec3.sub(eye, eye, distance);
		vec3.sub(target, target, distance);
}

function moveLeft()
{
	var distance = vec3.create();
	var rotatedTarget = vec3.create();
	vec3.rotateY(rotatedTarget, target, eye, Math.PI/2);
	vec3.sub(distance, rotatedTarget, eye);
	vec3.normalize(distance, distance);
	vec3.scale(distance, distance, moveSpeed);
	vec3.add(eye, eye, distance);
	vec3.add(target, target, distance);
}

function moveRight()
{
	var distance = vec3.create();
	var rotatedTarget = vec3.create();
	vec3.rotateY(rotatedTarget, target, eye, Math.PI*3/2);
	vec3.sub(distance, rotatedTarget, eye);
	vec3.normalize(distance, distance);
	vec3.scale(distance, distance, moveSpeed);
	vec3.add(eye, eye, distance);
	vec3.add(target, target, distance);
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
	var korrektur = -0.001;
	vec3.rotateY(target, target, eye, e.movementX*korrektur);
	//vec3.rotateX(target, target, eye, e.movementY*korrektur);
}



function canvasCoords()
{
	//Debug-Funktion einer Canvas zum Anzeigen von Koordinaten.
	canvasText = document.getElementById("debug-canvas");
	var ctx= canvasText.getContext("2d");
	ctx.font="12px Georgia";
	ctx.fillStyle = 'white';
	ctx.fillText("Debug Kamera: ",0,10);
	ctx.fillText("x = " + eye[0] ,0,20);
	ctx.fillText("y = " + eye[1]  + "",0,30);
	ctx.fillText("z = " + eye[2] + "",0,40);
	ctx.fillText("Debug Target: ",0,60);
	ctx.fillText("x = " + target[0] ,0,70);
	ctx.fillText("y = " + target[1]  + "",0,80);
	ctx.fillText("z = " + target[2] + "",0,90);
}

function canvasGuide()
{
	canvasText = document.getElementById("text-canvas");
	var ctx= canvasText.getContext("2d");
	ctx.font="12px Georgia";
	ctx.fillStyle = 'white';
	ctx.fillText("Bewegung: ",0,10);
	ctx.fillText("Pfeiltasten" ,0,20);
	ctx.fillText("Umsehen:" ,0,50);
	ctx.fillText("Canvas-Click",0,60);

}

function coordsClear()
{
	//Löschen der Debug-Canvas.
	canvasText = document.getElementById("text-canvas");
	var ctx=canvasText.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function degreeToRadian(degrees)
{
	//Hilfsfunktion
	return (degrees/180) * Math.PI()
}
