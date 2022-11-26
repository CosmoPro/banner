From: <Saved by Blink>
Snapshot-Content-Location: https://vembrabo.alphi.media/banner/script.js
Subject: 
Date: Sat, 26 Nov 2022 09:52:56 -0000
MIME-Version: 1.0
Content-Type: multipart/related;
	type="text/html";
	boundary="----MultipartBoundary--mTEmx4BJSsuZw0LGHyfZUjfNaqBmavZIqdGoOi6mGV----"


------MultipartBoundary--mTEmx4BJSsuZw0LGHyfZUjfNaqBmavZIqdGoOi6mGV----
Content-Type: text/html
Content-ID: <frame-EDA4E8ABBD14FA495BFFCB308AE9889C@mhtml.blink>
Content-Transfer-Encoding: quoted-printable
Content-Location: https://vembrabo.alphi.media/banner/script.js

<html><head><meta http-equiv=3D"Content-Type" content=3D"text/html; charset=
=3DUTF-8"></head><body><pre style=3D"word-wrap: break-word; white-space: pr=
e-wrap;">// elements for obtaining vals
let val1El =3D document.getElementById("color1");
let val2El =3D document.getElementById("color2");
let val3El =3D document.getElementById("color3");
let val4El =3D document.getElementById("color4");
let stepsEl =3D document.getElementById("steps");
const nickName =3D document.getElementById("nickname");
const coloredNick =3D document.getElementById("coloredNick");
const coloredNickP =3D document.createElement("p");
let newNick =3D nickName.value;
let rgbtype =3D 'Essentials (&amp;#rrggbb)';
let numberOfColors =3D 2;
document.getElementById('darkmode').checked =3D true
darkMode()

function hideColors() {
  if (numberOfColors =3D=3D 2) {
    document.getElementById("color3").style.display =3D "none";
    document.getElementById("label3").style.display =3D "none";
    document.getElementById("color4").style.display =3D "none";
    document.getElementById("label4").style.display =3D "none";
  } else if (numberOfColors =3D=3D 3) {
    document.getElementById("color3").style.display =3D "block";
    document.getElementById("label3").style.display =3D "block";
    document.getElementById("color4").style.display =3D "none";
    document.getElementById("label4").style.display =3D "none";
  } else if (numberOfColors =3D=3D 4) {
    document.getElementById("color3").style.display =3D "block";
    document.getElementById("label3").style.display =3D "block";
    document.getElementById("color4").style.display =3D "block";
    document.getElementById("label4").style.display =3D "block";
  }
}

function darkMode() {
  if (document.getElementById('darkmode').checked =3D=3D true) {
    document.getElementById('types').classList.add("dark");
    document.getElementById('numOfColors').classList.add("dark");
    document.body.classList.add('dark');
    document.getElementById('graylabel1').classList.replace("gray", "darkgr=
ay");
    document.getElementById('error').classList.replace("errortext", "darker=
rortext");
    document.getElementById('color1').classList.add("darktextboxes");
    document.getElementById('color2').classList.add("darktextboxes");
    document.getElementById('color3').classList.add("darktextboxes");
    document.getElementById('color4').classList.add("darktextboxes");
    nickName.classList.add("darktextboxes");
    document.getElementById('spitter').classList.add("darktextboxes");
  } else {
    document.getElementById('types').classList.remove("dark");
    document.getElementById('numOfColors').classList.remove("dark");
    document.body.classList.remove('dark');
    document.getElementById('graylabel1').classList.replace("darkgray", "gr=
ay");
    document.getElementById('error').classList.replace("darkerrortext", "er=
rortext");
    document.getElementById('color1').classList.remove("darktextboxes");
    document.getElementById('color2').classList.remove("darktextboxes");
    document.getElementById('color3').classList.remove("darktextboxes");
    document.getElementById('color4').classList.remove("darktextboxes");
    nickName.classList.remove("darktextboxes");
    document.getElementById('spitter').classList.remove("darktextboxes");
  }
}

function showError() {
  if (document.getElementById('spitter').textContent.length &gt; "800") {
    document.getElementById('error').style.display =3D "block";
    document.getElementById('spitter').style.height =3D "70px";
    document.getElementById('spitter').style.marginBottom =3D "5px";
  } else {
    document.getElementById('error').style.display =3D "none";
    document.getElementById('spitter').style.height =3D "95px";
    document.getElementById('spitter').style.marginBottom =3D "10px";
  }
}

function hex (c) {
  let s =3D "0123456789abcdef";
  let i =3D parseInt (c);
  if (i =3D=3D 0 || isNaN (c))
    return "00";
  i =3D Math.round (Math.min (Math.max (0, i), 255));
  return s.charAt ((i - i % 16) / 16) + s.charAt (i % 16);
}

/* Convert an RGB triplet to a hex string */
function convertToHex (rgb) {
  return hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
}

/* Remove '#' in color hex string */
function trim (s) { return (s.charAt(0) =3D=3D '#') ? s.substring(1, 7) : s=
 }

/* Convert a hex string to an RGB triplet */
function convertToRGB (hex) {
  let color =3D [];
  color[0] =3D parseInt ((trim(hex)).substring (0, 2), 16);
  color[1] =3D parseInt ((trim(hex)).substring (2, 4), 16);
  color[2] =3D parseInt ((trim(hex)).substring (4, 6), 16);
  return color;
}

function generateColor(colorStart,colorEnd,colorCount){

	// The beginning of your gradient
	let start =3D convertToRGB (colorStart);   =20

	// The end of your gradient
	let end   =3D convertToRGB (colorEnd);   =20

	// The number of colors to compute
	let len =3D colorCount;

	//Alpha blending amount
	let alpha =3D 0.0;

	let result =3D [];
=09
	for (i =3D 0; i &lt; len; i++) {
		let c =3D [];
		alpha +=3D (1.0/len);
	=09
		c[0] =3D start[0] * alpha + (1 - alpha) * end[0];
		c[1] =3D start[1] * alpha + (1 - alpha) * end[1];
		c[2] =3D start[2] * alpha + (1 - alpha) * end[2];

		result.push(convertToHex (c));
	=09
	}
=09
	return result;
=09
}

function combineColors(gradient1,gradient2) {
  result =3D [];
  result =3D gradient1.concat(gradient2)
  return result;
}

function updateSpitter(event) {
  nickName.value =3D nickName.value.replace('  ', ' ');
  if (rgbtype.includes('/nick')) {
    nickName.value =3D nickName.value.replace(/ /g, '');
    if(nickName.value !=3D '') {
      let letters =3D /^[0-9a-zA-Z_]+$/;
      if(!nickName.value.match(letters)) nickName.value =3D nickName.value.=
replace(event.data, '');
      if(!nickName.value.match(letters)) nickName.value =3D 'Gradieeennnttt=
';
    }
  }
  newNick =3D nickName.value
  if(newNick =3D=3D '') {
    newNick =3D 'NET FREE'
  }
  let half =3D newNick.length/2
  let thirds =3D newNick.length/3
  let gradientHalf1 =3D generateColor(val2El.value,val1El.value,half)
  let gradientHalf2 =3D generateColor(val3El.value,val2El.value,half)
  let gradientThirds1 =3D generateColor(val2El.value,val1El.value,thirds)
  let gradientThirds2 =3D generateColor(val3El.value,val2El.value,thirds)
  let gradientThirds3 =3D generateColor(val4El.value,val3El.value,half)
  let essentialscolorsout =3D [];
  let luckpermscolorsout =3D [];
  let othercolorsout =3D [];
  // the pre element where we spit array to user
  let spitter =3D document.getElementById("spitter");
  var colors
  numberOfColors =3D=3D 3 ? combineColors(gradientHalf1,gradientHalf2) : ge=
nerateColor(val2El.value,val1El.value,newNick.length)
  if (numberOfColors =3D=3D 2) {
    colors =3D generateColor(val2El.value,val1El.value,newNick.length)
  }else if (numberOfColors =3D=3D 3) {
    colors =3D combineColors(gradientHalf1,gradientHalf2)
  }else if (numberOfColors =3D=3D 4) {
    let uwu =3D combineColors(gradientThirds1,gradientThirds2)
    colors =3D combineColors(uwu,gradientThirds3)
  }

  let nickspaced =3D newNick.split("");
  let colorspp =3D ('&amp;' + colors.join('').split('').join('&amp;')).matc=
h(/.{1,12}/g);
  for (let i =3D 0; i &lt; newNick.length; i++) {
    colorspp[i] =3D colorspp[i].replace('&amp;', '&amp;x&amp;');

if (nickspaced[i]=3D=3D=3D" "){
	    essentialscolorsout[i] =3D ' ';
	}else{
    essentialscolorsout[i] =3D '&lt;span style=3D"color:#' +colors[i]+'"&gt=
;' + nickspaced[i]+'&lt;/span&gt;'
    luckpermscolorsout[i] =3D '{#' + colors[i] + '}' + nickspaced[i]
    othercolorsout[i] =3D colorspp[i] + nickspaced[i]
	}
  }
  let output =3D '';
  if (rgbtype.includes('x')) {
    if (rgbtype.includes('u')) {
      output =3D othercolorsout.join('').replace(/&amp;/g, '\\u00A7');
    } else if (rgbtype.includes('=C2=A7')) {
      output =3D othercolorsout.join('').replace(/&amp;/g, '=C2=A7');
    } else {
      output =3D othercolorsout.join('');
    }
  } else if (rgbtype.includes('')) {
    output =3D essentialscolorsout.join('');
  } else {
    output =3D luckpermscolorsout.join('');
  }
  let num =3D '';
  if (rgbtype.includes('&amp;#')) num =3D 8;
  if (rgbtype.includes('{#')) num =3D 9;
  if (rgbtype.includes('x')) num =3D 14;


var h1 =3D'&lt;h1 style=3D"text-align:center"&gt;';
var h1f =3D '&lt;/h1&gt;';
  spitter.innerText =3D h1+output+h1f;
  displayColoredName(newNick, colors);
  showError();
}
/**
 * padding function:
 * cba to roll my own, thanks Pointy!
 * =3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=
=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D
 * source: http://stackoverflow.com/questions/10073699/pad-a-number-with-le=
ading-zeros-in-javascript
 */
function pad(n, width, z) {
  z =3D z || "0";
  n =3D n + "";
  return n.length &gt;=3D width ? n : new Array(width - n.length + 1).join(=
z) + n;
}
updateSpitter();

async function displayColoredName(nickName, colors) {

  coloredNickP.innerHTML =3D "";
  for (let i =3D 0; i &lt; nickName.length; i++) {
    const coloredNickSpan =3D document.createElement("span");

    coloredNickSpan.style.color =3D colors[i];
    coloredNickSpan.textContent =3D nickName[i];
    coloredNickP.append(coloredNickSpan);
  }
  coloredNick.append(coloredNickP);
}
</pre></body></html>
------MultipartBoundary--mTEmx4BJSsuZw0LGHyfZUjfNaqBmavZIqdGoOi6mGV------
