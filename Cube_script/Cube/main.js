var gl;
var canvas;

var objects = [];
var modelMatrixLoc;
var colorLoc;
var positionLoc;

var RenderObject = function(modelMatrix, color, vertexBuffer, indexBuffer)
{
	this.modelMatrix = modelMatrix;
	this.color = color;
	this.vertexBuffer = vertexBuffer;
	this.indexBuffer = indexBuffer;
	this.numVertices = indexBuffer.numItems;
}

window.onload = function init()
{
	// Get canvas and setup webGL
	
	canvas = document.getElementById("gl-canvas");
	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) { alert("WebGL isn't available"); }

	// Configure viewport

	gl.viewport(0.0, 0.0, canvas.width, canvas.height);
	gl.clearColor(1.0, 1.0, 1.0, 1.0);
	gl.enable(gl.DEPTH_TEST);

	// Init shader programs

	var defaultProgram = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram (defaultProgram);

	///// CUBE OBJECT /////
	
	// Create buffer and copy data into it
	var cubeString = document.getElementById("cube").innerHTML;
	cubeMesh = new OBJ.Mesh(cubeString);
	OBJ.initMeshBuffers(gl, cubeMesh);
	
	// Create object
	var cubeObject = new RenderObject(mat4.create(), vec4.fromValues(0, 1, 0, 1), cubeMesh.vertexBuffer, cubeMesh.indexBuffer);
	
	// Push object on the stack
	objects.push(cubeObject);
	
	///// CYLINDER OBJECT /////
	
	// Create buffer and copy data into it
	var cylinderString = document.getElementById("cylinder").innerHTML;
	cylinderMesh = new OBJ.Mesh(cylinderString);
	OBJ.initMeshBuffers(gl, cylinderMesh);
	
	// Create object
	var cylinderObject = new RenderObject(mat4.create(), vec4.fromValues(1, 0, 0, 1), cylinderMesh.vertexBuffer, cylinderMesh.indexBuffer);
	mat4.translate(cylinderObject.modelMatrix, cylinderObject.modelMatrix, vec3.fromValues(4, 0, 0));
	
	// Push object on the stack
	objects.push(cylinderObject);

	// Set view matrix

	var eye = vec3.fromValues(-10.0, 1.0, -10.0);
	var target = vec3.fromValues(5.0, 1.0, 5.0);
	var up = vec3.fromValues(0.0, 1.0, 0.0);

	var viewMatrix = mat4.create();
	mat4.lookAt(viewMatrix, eye, target, up);

	var viewMatrixLoc = gl.getUniformLocation(defaultProgram, "viewMatrix");
	gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix);
	
	// Set projection matrix
	
	var fovy = Math.PI * 0.25; // 90 degrees
	var aspectRatio = canvas.width / canvas.height;
	var nearClippingPlane = 0.5;
	var farClippingPlane = 100;
	
	var projectionMatrix = mat4.create();
	mat4.perspective(projectionMatrix, fovy, aspectRatio, nearClippingPlane, farClippingPlane);

    var projectionMatrixLoc = gl.getUniformLocation(defaultProgram, "projectionMatrix");
    gl.uniformMatrix4fv(projectionMatrixLoc, false, projectionMatrix);
    
    // Store locations of object-specific uniform and attribute variables
	
	modelMatrixLoc = gl.getUniformLocation(defaultProgram, "modelMatrix");
	colorLoc = gl.getUniformLocation(defaultProgram, "objectColor");
	positionLoc = gl.getAttribLocation(defaultProgram, "vPosition");

	render();
};

function render()
{	
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	objects.forEach(function(object) {

		// Set attributes
		gl.bindBuffer(gl.ARRAY_BUFFER, object.vertexBuffer);
		gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(positionLoc);
		
		// Set uniforms
		gl.uniformMatrix4fv(modelMatrixLoc, false, object.modelMatrix);
		gl.uniform4fv(colorLoc, object.color);

		// Draw
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object.indexBuffer);
		gl.drawElements(gl.TRIANGLES, object.numVertices, gl.UNSIGNED_SHORT, 0);
	});
	
	requestAnimFrame(render);
}

