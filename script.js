const URL = "./model/";

let model;
let webcam;

const noteInfo = {

"₹10":{
value:"Ten Rupees",
color:"Chocolate Brown"
},

"₹20":{
value:"Twenty Rupees",
color:"Greenish Yellow"
},

"₹50":{
value:"Fifty Rupees",
color:"Fluorescent Blue"
},

"₹100":{
value:"One Hundred Rupees",
color:"Lavender"
},

"₹200":{
value:"Two Hundred Rupees",
color:"Bright orange"
},

"₹500":{
value:"Five Hundred Rupees",
color:"Stone Grey"
}

};

async function init(){

document.getElementById("loading").style.display="block";

const modelURL = URL + "model.json";
const metadataURL = URL + "metadata.json";

model = await tmImage.load(
modelURL,
metadataURL
);

webcam = new tmImage.Webcam(
350,
350,
true
);

await webcam.setup();
await webcam.play();

window.requestAnimationFrame(loop);

document.getElementById(
"webcam-container"
).innerHTML = "";

document.getElementById(
"webcam-container"
).appendChild(
webcam.canvas
);

document.getElementById(
"loading"
).style.display="none";

}

async function loop(){

webcam.update();

await predict();

window.requestAnimationFrame(loop);

}

async function predict(){

const prediction =
await model.predict(
webcam.canvas
);

let highest =
prediction[0];

for(let i=1;i<prediction.length;i++){

if(
prediction[i].probability >
highest.probability
){
highest = prediction[i];
}

}

const confidence =
(highest.probability*100)
.toFixed(2);

document.getElementById(
"currency"
).innerText =
highest.className;

document.getElementById(
"confidence"
).innerText =
confidence + "%";

document.getElementById(
"progress"
).style.width =
confidence + "%";

if(noteInfo[highest.className]){

document.getElementById(
"value"
).innerText =
noteInfo[highest.className].value;

document.getElementById(
"color"
).innerText =
noteInfo[highest.className].color;

}

}

/* Money flow animation: dynamically create falling banknotes */
;(function createMoneyFlow(){
	try{
		const count = 30;
		const container = document.createElement('div');
		container.id = 'money-flow';
		document.body.appendChild(container);
		const symbols = ['₹','₹','₹','₹','₹'];
		for(let i=0;i<count;i++){
			const el = document.createElement('div');
			el.className = 'banknote';
			el.textContent = symbols[i % symbols.length];
			const size = Math.floor(Math.random()*28) + 14;
			el.style.fontSize = size + 'px';
			el.style.left = Math.random()*110 + '%';
			el.style.opacity = (Math.random()*0.6 + 0.15).toString();
			const dur = (Math.random()*12) + 8;
			el.style.animation = `fall ${dur}s linear ${Math.random()*-20}s infinite`;
			el.style.transform = `translateY(-10vh) rotate(${Math.random()*360}deg)`;
			container.appendChild(el);
		}
	}catch(e){console.error('Money flow init failed', e)}
})();