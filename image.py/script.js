
window.onload = function (e) {
	var inp = {
		canvas: document.getElementById("input_canvas"),
		x: 0,
		y: 0,
	}

	inp.getImageData = function () {
		inp.imgData = inp.ctx.getImageData(0, 0, inp.canvas.width, inp.canvas.height);
	}

	var out = {
		canvas: document.getElementById("output_canvas"),
	}

	inp.ctx = inp.canvas.getContext("2d");
	out.ctx = out.canvas.getContext("2d");

	var fond = document.getElementById("fond");


	var blocks = [];

	function randint(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function getKandinsky(input) {
		for (var y = 0; y < 44; y++) {
			blocks[y] = [];
			for (var x = 0; x < 64; x++) {
				blocks[y][x] = [0, 0, 0, 0];
			}
		}

		let width = input.imgData.width;
		let height = input.imgData.height;
		for (var y = 0; y < height; y++) {
			for (var x = 0; x < width; x++) {
				blocks[Math.floor(y / height * 44)][Math.floor(x / width * 64)][0] += input.imgData.data[((y * (width * 4)) + (x * 4)) + 0];
				blocks[Math.floor(y / height * 44)][Math.floor(x / width * 64)][1] += input.imgData.data[((y * (width * 4)) + (x * 4)) + 1];
				blocks[Math.floor(y / height * 44)][Math.floor(x / width * 64)][2] += input.imgData.data[((y * (width * 4)) + (x * 4)) + 2];
				blocks[Math.floor(y / height * 44)][Math.floor(x / width * 64)][3] += 1;
			}
		}

		for (var y = 0; y < 44; y++) {
			for (var x = 0; x < 64; x++) {
				for (var i = 0; i < 3; i++) {
					blocks[y][x][i] = Math.floor(blocks[y][x][i] / blocks[y][x][3]);
					blocks[y][x][i] = Math.floor(blocks[y][x][i] / 255 * 5);
				}
			}
		}
	}

	function drawKandinsky() {
		for (var y = 0; y < 44; y++) {
			for (var x = 0; x < 64; x++) {
				out.ctx.fillStyle = "rgb(" + blocks[y][x][0] * 51 + "," + blocks[y][x][1] * 51 + "," + blocks[y][x][2] * 51 + ")";
				out.ctx.fillRect(x * 5, 18 + y * 5, 5, 5);
			}
		}
	}

	function getText() {
		var text = document.getElementById("text");
		var code = "from kandinsky import*\nimage=[\n";
		for (var y = 0; y < 44; y++) {
			let newCode = '';
			for (var i = 0; i < 64; i++) {
				let red = blocks[y][i][0];
				let green = blocks[y][i][1];
				let blue = blocks[y][i][2];
				if ((32 + red + green * 6 + blue * 36) == 160) {
					newCode += String.fromCharCode(32 + 216 + 1);
				} else if ((32 + red + green * 6 + blue * 36) == 92) {
					newCode += String.fromCharCode(32 + 216 + 2);
				} else if ((32 + red + green * 6 + blue * 36) == 34) {
					newCode += String.fromCharCode(32 + 216 + 3);
				} else {
					newCode += String.fromCharCode(32 + red + green * 6 + blue * 36);
				}
			}
			if (newCode == newCode[0].repeat(64)) {
				newCode = '"' + newCode[0] + '"*64,\n'
			} else {
				newCode = '"' + newCode + '",\n';
			}
			code += newCode;
		}
		code += "]\n";

		code += `

height=5
width=5

width2=int(width+1)
height2=int(height+1)

def str2color(str_):
  return (int(255/5*((ord(str_)-32)%6)),int(255/5*((ord(str_)-32)//6%6)),int(255/5*((ord(str_)-32)//36%6)))


for y in range(44):
	for i in [["Ì",204],["Í",205],["Å",197],["Ë",203],["ù",160],["½",189],["¼",188],["Ã",195],["¸",184],["ú",92],["¨",168],["û",34],["Ä",196],["À",192],["ñ",]]:
		image[y]=image[y].replace(i[0],chr(i[1]))
  for x in range(len(image[y])):
    fill_rect(int(x*width),int(y*height),width2,height2,str2color(image[y][x]))


`;

		text.value = code;

	}

	function changeCanvas(src) {
		var image = new Image();
		image.onload = function () {
			inp.canvas.height = image.height;
			inp.canvas.width = image.width;
			out.ctx.drawImage(fond, 0, 0, fond.width, fond.height, 0, 0, 320, 240);
			inp.ctx.drawImage(image, 0, 0);
			inp.getImageData();
			getKandinsky(inp);
			drawKandinsky();
			getText();
		}
		image.onerror=function(){
			alert("ERREUR !!!\n si c'est une url tentez de télécharger l'image pour la soumettre avec le lecteur de fichier");
			throw "Katastrosphe: crossOrigin à encore frappé";
		}
			image.setAttribute('crossOrigin', '');
			image.src = src;
	};

	var button = document.querySelectorAll("input[type=button]")[1];

	button.onclick = function (e) {
		var urlInput = e.target.parentNode.querySelector("input[type=text]");
		urlInput.value = urlInput.value.trim();
		if (urlInput.value) {
			changeCanvas(urlInput.value + '?' + new Date().getTime());
		} else {
			var file = document.querySelector('input[type=file]').files[0];
			var reader = new FileReader();
			console.log(file.type); // log le type MIME du fichier
			reader.addEventListener("load", function () {
				const blob = reader.result;
				changeCanvas(blob);
			}, false);
			if (file) {
				reader.readAsDataURL(file);
			}
		}
	};

	urlList=[
		"https://d1fmx1rbmqrxrr.cloudfront.net/cnet/optim/i/edit/2019/04/eso1644bsmall__w770.jpg",
		"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRe0O0260hzKyKursZUTtZAxECP0gSVJ2JXwQ&usqp=CAU",
		"https://ekladata.com/m8Ff7u6ltQUTnisoYqWnl0Po-9I.jpg",
		"https://cdn.futura-sciences.com/buildsv6/images/wide1920/4/4/2/44209deae5_96298_bombe-hydrogene.jpg",
		"https://img.20mn.fr/k4tUSQtjSpey6XPd4lbsFik/960x614_terre-lune.jpg",
		"https://cdn.futura-sciences.com/buildsv6/images/largeoriginal/8/9/e/89e85604ff_50165234_diamant-2-alrosa.jpg",
	]

	function testRandomUrl(e){
		var urlInput=document.querySelector("input[type=text]");
		original=urlInput.value
		while(original==urlInput.value){
			urlInput.value=urlList[Math.floor((Math.random() * urlList.length ))];
		}
		document.getElementById("go").click();
	}

	var button2 = document.querySelectorAll("input[type=button]")[0];
	button2.onclick=testRandomUrl;

};