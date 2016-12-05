var gl;
var canvas;
var canvasText;

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

var program;

var moveSpeed = 0.25;

//KamaraPosition
var eye;
var target;
var up;

var eye_x,eye_y,eye_z
eye_x = 0.0;
eye_y = 0.0;
eye_z = 2.0;

var target_x, target_y,target_z
target_x = 0.0;
target_y = 0.0;
target_z = 0.0;

eye = vec3.fromValues(eye_x, eye_y, eye_z);
target = vec3.fromValues(target_x, target_y, target_z);
up = vec3.fromValues(0.0, 1.0, 0.0);

//Isa Start
var keys = [];

function keyDown(e)
{
	keys[e.keyCode] = true;
}

function keyUp(e)
{
	keys[e.keyCode] = false;
}
//Isa End

window.onload = function init()
{
	// Get canvas and setup webGL
	canvas = document.getElementById("gl-canvas");
	gl = WebGLUtils.setupWebGL(canvas);
	
	//window.addEventListener("keypress", eventHandling);	
	window.addEventListener("keydown", keyDown);
	window.addEventListener("keyup", keyUp);
	
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

	//viewMatrix = mat4.create();
	//mat4.lookAt(viewMatrix, eye, target, up);

	//viewMatrixLoc = gl.getUniformLocation(program, "viewMatrix");
	//gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix);

    // Set projection matrix
	// Kamera
	projectionMatrix = mat4.create();
	mat4.perspective(projectionMatrix, Math.PI * 0.25, canvas.width / canvas.height, 0.5, 100);

	projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
	gl.uniformMatrix4fv(projectionMatrixLoc, false, projectionMatrix);

	canvasCoords();
	render();
};

function render()
{
	movement()
	//canvasCoords();
	//eye = vec3.fromValues(eye_x, eye_y, eye_z);
	//target = vec3.fromValues(target_x, target_y, target_z);
	//up = vec3.fromValues(0.0, 1.0, 0.0);

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
					mf2()
					//moveFowardNew();
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

function movement()
{
	if (keys[65]) // a 
	{
		var distance = vec3.create();
		var rotatedTarget = vec3.create();
		vec3.rotateY(rotatedTarget, target, eye, Math.PI/2);
		vec3.sub(distance, rotatedTarget, eye);
		vec3.normalize(distance, distance);
		vec3.scale(distance, distance, 0.1);
		vec3.add(eye, eye, distance);
		vec3.add(target, target, distance);
		
	}
	if (keys[68]) // d
	{
		var distance = vec3.create();
		var rotatedTarget = vec3.create();
		vec3.rotateY(rotatedTarget, target, eye, Math.PI*3/2);
		vec3.sub(distance, rotatedTarget, eye);
		vec3.normalize(distance, distance);
		vec3.scale(distance, distance, 0.1);
		vec3.add(eye, eye, distance);
		vec3.add(target, target, distance);
	}
	if (keys[87]) // w
	{
		var distance = vec3.create();
		vec3.sub(distance, target, eye);
		vec3.normalize(distance, distance);
		vec3.scale(distance, distance, 0.1);
		vec3.add(eye, eye, distance);
		vec3.add(target, target, distance);
	}
	if (keys[83]) // s
	{
		var distance = vec3.create();
		vec3.sub(distance, target, eye);
		vec3.normalize(distance, distance);
		vec3.scale(distance, distance, 0.1);
		vec3.sub(eye, eye, distance);
		vec3.sub(target, target, distance);
	}
}

function mf2()
{
	var distance = vec3.create();
		var rotatedTarget = vec3.create();
		vec3.rotateY(rotatedTarget, target, eye, Math.PI/2);
		vec3.sub(distance, rotatedTarget, eye);
		vec3.normalize(distance, distance);
		vec3.scale(distance, distance, 0.1);
		vec3.add(eye, eye, distance);
		vec3.add(target, target, distance);
		
}
function moveFoward()
{
	//Checken des Vorzeichens
	var signX = -1, signY=-1, signZ=-1
	if(eye_x >= 0)
	{
		signX = 1
	}
	if(eye_y >= 0)
	{
		signY = 1
	}
	if(eye_z >= 0)
	{
		signZ = 1
	}

	//Neue Position für die Kamera
	eye_x = eye_x - Math.sin(getEyeAngleXZ(0)) * moveSpeed * signX
	eye_y = eye_y - Math.sin(getEyeAngleYZ(0)) * moveSpeed * signY
	eye_z = eye_z - Math.sin(getEyeAngleXY(0)) * moveSpeed * signZ
	//Neue Position für das Ziel
	target_x = target_x - Math.sin(getEyeAngleXZ(0)) * moveSpeed * signX
	target_y = target_y - Math.sin(getEyeAngleYZ(0)) * moveSpeed * signY
	target_z = target_z - Math.sin(getEyeAngleXY(0)) * moveSpeed * signZ
}

function moveFowardNew()
{
 var cosa, tanb, tanc //angles
 var distX, distY, distZ //distanzen zum Target
 var dx, dy, dz //distanzen zur zu gehenden Distanz
 var signX = -1, signY=-1, signZ=-1 //das Vorzeichen der aktuellen Koordinate
 if(eye_x >= 0)
 {
  signX = 1
 }
 if(eye_y >= 0)
 {
  signY = 1
 }
 if(eye_z >= 0)
 {
  signZ = 1
 }

 distX = eye_x - target_x
 distY = eye_y - target_y
 distZ = eye_z - target_z

 cosa = Math.cos((distX^2 + distZ^2)^0.5 / (distX^2 + distZ^2 + distY^2)^0.5)
 tanb = Math.tan(distZ/distY)
 tanc = Math.tan(distX/distZ)

 dy = cosa * moveSpeed
 dx = tanb * dy
 dz = tanc * dx

 eye_x = eye_x - dx * signX
 target_x = target_x - dx * signX
 eye_y = eye_y - dy * signY
 target_y = target_y - dy * signY
 eye_z = eye_z - dz * signZ
 target_z = target_z - dz * signZ
}

function moveBack()
{
	var signX = -1, signY=-1, signZ=-1
	if(eye_x >= 0)
	{
		signX = 1
	}
	if(eye_y >= 0)
	{
		signY = 1
	}
	if(eye_z >= 0)
	{
		signZ = 1
	}
	eye_x = eye_x + Math.sin(getEyeAngleXZ(0)) * moveSpeed * signX
	eye_y = eye_y + Math.sin(getEyeAngleYZ(0)) * moveSpeed * signY
	eye_z = eye_z + Math.sin(getEyeAngleXY(0)) * moveSpeed * signZ

	target_x = target_x + Math.sin(getEyeAngleXZ(0)) * moveSpeed * signX
	target_y = target_y + Math.sin(getEyeAngleYZ(0)) * moveSpeed * signY
	target_z = target_z + Math.sin(getEyeAngleXY(0)) * moveSpeed * signZ
}

function moveLeft()
{
	var signX = -1, signY=-1, signZ=-1
	if(eye_x >= 0)
	{
		signX = 1
	}
	if(eye_y >= 0)
	{
		signY = 1
	}
	if(eye_z >= 0)
	{
		signZ = 1
	}
	eye_x = eye_x + Math.sin(getEyeAngleXZ(degreeToRadian(90))) * moveSpeed * signX
	eye_y = eye_y + Math.sin(getEyeAngleYZ(degreeToRadian(90))) * moveSpeed * signY
	eye_z = eye_z + Math.sin(getEyeAngleXY(degreeToRadian(90))) * moveSpeed * signZ

	target_x = target_x + Math.sin(getEyeAngleXZ(degreeToRadian(90))) * moveSpeed * signX
	target_y = target_y + Math.sin(getEyeAngleYZ(degreeToRadian(90))) * moveSpeed * signY
	target_z = target_z + Math.sin(getEyeAngleXY(degreeToRadian(90))) * moveSpeed * signZ
}

function moveRight()
{
	var signX = -1, signY=-1, signZ=-1
	if(eye_x >= 0)
	{
		signX = 1
	}
	if(eye_y >= 0)
	{
		signY = 1
	}
	if(eye_z >= 0)
	{
		signZ = 1
	}
	eye_x = eye_x + Math.sin(getEyeAngleXZ(degreeToRadian(-90))) * moveSpeed * signX
	eye_y = eye_y + Math.sin(getEyeAngleYZ(degreeToRadian(-90))) * moveSpeed * signY
	eye_z = eye_z + Math.sin(getEyeAngleXY(degreeToRadian(-90))) * moveSpeed * signZ

	target_x = target_x + Math.sin(getEyeAngleXZ(degreeToRadian(-90))) * moveSpeed * signX
	target_y = target_y + Math.sin(getEyeAngleYZ(degreeToRadian(-90))) * moveSpeed * signY
	target_z = target_z + Math.sin(getEyeAngleXY(degreeToRadian(-90))) * moveSpeed * signZ
}

function getEyeAngleXZ(offset)
{
		//Hilfsfunktion zur Berechnung der Ausrichtung auf der XZ-Ebene.
		//offset als Hilfe zur Manipulation der Ausrichtung.
		var delta_x, delta_y, delta_z
		var angXZ

		delta_x = eye_x - target_x;
		delta_z = eye_z - target_z;

		angXZ = Math.atan(delta_x/delta_z + offset)

		return angXZ;
}

function getEyeAngleXY(offset)
{
		//Hilfsfunktion zur Berechnung der Ausrichtung auf der XY-Ebene.
		//offset als Hilfe zur Manipulation der Ausrichtung.
		var delta_x, delta_y
		var angXY

		delta_x = eye_x - target_x;
		delta_y = eye_y - target_y;

		if (delta_x != 0)
		{
			angXY = Math.atan(delta_y/delta_x + offset)
		}
		else
		{
			angXY = Math.atan(0)
		}

		return angXY;
}

function getEyeAngleYZ(offset)
{
		//Hilfsfunktion zur Berechnung der Ausrichtung auf der YZ-Ebene.
		//offset als Hilfe zur Manipulation der Ausrichtung.
		var delta_y, delta_z
		var angYZ

		delta_y = eye_y - target_y;
		delta_z = eye_z - target_z;

		angYZ = Math.atan(delta_y/delta_z + offset)

		return angYZ;
}

function canvasCoords()
{
	//Debug-Funktion einer Canvas zum Anzeigen von Koordinaten.
	canvasText = document.getElementById("text-canvas");
	var ctx= canvasText.getContext("2d");
	ctx.font="12px Georgia";
	ctx.fillStyle = 'white';
	ctx.fillText("Kamera: ",0,10);
	ctx.fillText("x = " + eye_x ,0,20);
	ctx.fillText("y = " + eye_y  + "",0,30);
	ctx.fillText("z = " + eye_z + "",0,40);
	ctx.fillText("Target: ",0,60);
	ctx.fillText("x = " + target_x ,0,70);
	ctx.fillText("y = " + target_y  + "",0,80);
	ctx.fillText("z = " + target_z + "",0,90);


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
