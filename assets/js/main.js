const
	R = {
		x: -67.5, y: -22.5,
		now: {x: 0, y: 0},
		on: {x: 0, y: 0},
		old: {x: 0, y: 0}
	},
	w2 = innerWidth / 2,
	h2 = innerHeight / 2,
	S = 4, // Sensitivity (higher number = lower)
	P = 2, // Smooth motion (higher number = smoother)
	SCALE = 1,
	TEXTURES = ["Oil_Drum001h.png", "Oil_Drum001h2.png", "Oil_Drum001d.png"],
	NAMESPACE = "assets/textures/",
	createCylinder = (diameter, height, faceCount, texture) => {
		let mesh = document.createElement("div"),
			sideAngle = (Math.PI / faceCount) * 2,
			sideLen = diameter * Math.tan(Math.PI / faceCount);

		mesh.className = "part mesh";

		for (let c = 0; c < faceCount; c++) {
			let x = Math.sin(sideAngle * c) * diameter / 2,
				z = Math.cos(sideAngle * c) * diameter / 2,
				ry = Math.atan2(x, z);

			mesh.appendChild(createFace(sideLen + 1, height, x, 0, z, 0, ry, texture, sideLen * c, 0, false, 0));
		}

		return mesh;
	},
	createFace = (w, h, x, y, z, rx, ry, t, u, v, r, a) => {
		[w, h, x, y, z, rx, ry, u, v] = [w, h, x, y, z, rx, ry, u, v].map(n => n.toFixed(2));
		t = `url(${t})`;

		let alpha = a || (Math.cos(rx / 1.5) * Math.cos(ry / 2)).toFixed(2),
			grad = `linear-gradient(rgba(0, 0, 0, ${alpha}), rgba(0, 0, 0, ${alpha}))`,
			transform = `translate3d(${x}px, ${y}px, ${z}px) rotateX(${rx}rad) rotateY(${ry}rad)`,
			face = document.createElement("div");

		face.className = "part";
		face.style.cssText = `
			width:				${w}px;
			height:				${h}px;
			margin-top:			${-(h / 2).toFixed(2)}px;
			margin-left:		${-(w / 2).toFixed(2)}px;
			border-radius:		${r ? "50%" : "none"};
			background:			${grad}, ${t} ${-u}px ${v}px;
			-webkit-transform:	${transform};
			transform:			${transform};
		`;

		return face;
	},
	M = {
		down: e => {
			if (!e.clientX) {
				// Touch screen
				R.on.x = -w2 + e.touches[0].clientX;
				R.on.y = h2 + -e.touches[0].clientY;
			} else {
				R.on.x = -w2 + e.clientX;
				R.on.y = h2 + -e.clientY;
			}

			R.old.x = R.x;
			R.old.y = R.y;

			addEventListener("mousemove", M.move);
			addEventListener("touchmove", M.move);
		},
		move: e => {
			if (!e.clientX) {
				// Touch screen
				R.now.x = -w2 + e.touches[0].clientX;
				R.now.y = h2 -e.touches[0].clientY;
			} else {
				R.now.x = -w2 + e.clientX;
				R.now.y = h2 -e.clientY;
			}

			R.x = ((R.now.x - R.on.x) / S) + R.old.x;
			R.y = ((R.now.y - R.on.y) / S) + R.old.y;

			if (R.x < -360) R.x += 360;
			if (R.x > 360) R.x -= 360;
			if (R.y < -90) R.y = -90;
			if (R.y > 90) R.y = 90;

			let transform = `scale(${SCALE}) rotateX(${R.y.toFixed(P)}deg) rotateY(${R.x.toFixed(P)}deg)`
			mesh.style["-webkit-transform"] = transform;
			mesh.style.transform = transform;
		},
		up: () => {
			removeEventListener("mousemove", M.move);
			removeEventListener("touchmove", M.move);
		},
	},
	changeTexture = () => {
		currentTexture = currentTexture + 1 === TEXTURES.length ? 0 : ++currentTexture;

		// Show current texture filename
		showTexture();

		// Update mesh texture
		for (let face of mesh.children) {
			face.style.backgroundImage = face.style.backgroundImage.split("url")[0] + `url(${NAMESPACE + TEXTURES[currentTexture]})`;
		}
	},
	showTexture = () => texture.children[0].innerText = TEXTURES[currentTexture];
let currentTexture = 0;

// Create drum mesh
const mesh = createCylinder(188, 320, 80, NAMESPACE + TEXTURES[currentTexture]);

// Create top & bottom faces
mesh.appendChild(createFace(190, 190, 0, -160, 0, Math.PI / 2, 0, NAMESPACE + TEXTURES[currentTexture], 129, 190, true, 0));
mesh.appendChild(createFace(190, 190, 0, 160, 0, -Math.PI / 2, 0, NAMESPACE + TEXTURES[currentTexture], -191, 190, true, .75));

// Mesh initial rotation angle
let transform = `scale(${SCALE}) rotateX(${R.y.toFixed(P)}deg) rotateY(${R.x.toFixed(P)}deg)`
mesh.style["-webkit-transform"] = transform;
mesh.style.transform = transform;

document.body.appendChild(mesh);

showTexture();

// Event listeners
addEventListener("mousedown", M.down);
addEventListener("touchstart", M.down);
addEventListener("mouseup", M.up);
addEventListener("touchend", M.up);
texture.addEventListener("click", changeTexture);