const DRUM_TEXTURE = "drum2.png",
createFace = function(w, h, x, y, z, rx, ry, tsrc, tx, ty, br) {
	let alpha = Math.cos(rx / 1.5) * Math.cos(ry / 2),
	grad = `linear-gradient(rgba(0, 0, 0, ${alpha.toFixed(2)}), rgba(0, 0, 0, ${alpha.toFixed(2)}))`,
	transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${z.toFixed(2)}px) rotateX(${rx.toFixed(2)}rad) rotateY(${ry.toFixed(2)}rad)`,
	face = document.createElement("section");
	// Customize the face with parameters
	face.className = "threedee face";
	face.style.background = `${grad}, url(${tsrc}) ${-tx.toFixed(2)}px ${ty.toFixed(2)}px`;
	face.style["-webkit-mask-image"] = `url(${tsrc})`;
	face.style.maskImage = `url(${tsrc})`;
	face.style.maskPosition = `${-tx.toFixed(2)}px ${ty.toFixed(2)}px`;
	face.style.width = `${w.toFixed(2)}px`;
	face.style.height = `${h.toFixed(2)}px`;
	face.style.marginTop = `${-(h / 2).toFixed(2)}px`;
	face.style.marginLeft = `${-(w / 2).toFixed(2)}px`;
	face.style["border-radius"] = br ? "50%" : "0px";
	face.style["-webkit-transform"] = transform;
	face.style["-ms-transform"] = transform;
	face.style.transform = transform;
	return face
},
createTube = function(dia, height, sides, texture) {
	let tube = document.createElement("div"),
	sideAngle = (Math.PI / sides) * 2,
	sideLen = dia * Math.tan(Math.PI / sides);
	tube.className = "threedee assembly";
	for (let c = 0; c < sides; c++) {
		let x = Math.sin(sideAngle * c) * dia / 2,
		z = Math.cos(sideAngle * c) * dia / 2,
		ry = Math.atan2(x, z);
		tube.appendChild(createFace(sideLen + 1, height, x, 0, z, 0, ry, texture, sideLen * c, 0, false))
	}
	return tube
},
// Cube rotation values
R = {
	x: 45, y: -22.5,
	now: {x: 0, y: 0},
	on: {x: 0, y: 0},
	old: {x: 0, y: 0}
},
w2 = window.innerWidth / 2, // Window width / 2
h2 = window.innerHeight / 2, // Window height / 2
// Parameters
S = 4, // Sensitivity (higher number = lower sens)
P = 2, // Smooth motion (higher number = smoother motion)
scale = 2, // Barrel scale
// Mouse events
M = {
	down: function(e) {
		R.on.x = -w2 + e.clientX;
		R.on.y = h2 + -e.clientY;
		R.old.x = R.x;
		R.old.y = R.y;
		document.addEventListener("mousemove", M.move)
	},
	move: function(e) {
		R.now.x = -w2 + e.clientX;
		R.now.y = h2 -e.clientY;
		R.x = ((R.now.x - R.on.x) / S) + R.old.x;
		R.y = ((R.now.y - R.on.y) / S) + R.old.y;
		if (R.x < -360) R.x += 360;
		if (R.x > 360) R.x -= 360;
		if (R.y < -90) R.y = -90;
		if (R.y > 90) R.y = 90;
		let transform = `scale(${scale}) rotateX(${R.y.toFixed(P)}deg) rotateY(${R.x.toFixed(P)}deg)`
		assembly.style["-webkit-transform"] = transform;
		assembly.style["-ms-transform"] = transform;
		assembly.style.transform = transform
	},
	up: function() {this.removeEventListener("mousemove", M.move)}
};

// Create barrel
const barrel = createTube(100, 196, 40, DRUM_TEXTURE);
barrel.appendChild(createFace(100, 100, 0, -98, 0, Math.PI / 2, 0, DRUM_TEXTURE, 0, 100, true));
barrel.appendChild(createFace(100, 100, 0, 98, 0, -Math.PI / 2, 0, DRUM_TEXTURE, 0, 100, true));
document.body.appendChild(barrel);
const assembly = document.querySelector(".assembly");
// Barrel initial rotation angle
let transform = `scale(${scale}) rotateX(${R.y.toFixed(P)}deg) rotateY(${R.x.toFixed(P)}deg)`
assembly.style["-webkit-transform"] = transform;
assembly.style["-ms-transform"] = transform;
assembly.style.transform = transform;
// Event listeners
document.addEventListener("mousedown", M.down);
document.addEventListener("mouseup", M.up)