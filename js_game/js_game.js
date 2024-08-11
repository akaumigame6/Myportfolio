const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const button1 = document.getElementById("button1");
const button2 = document.getElementById("button2");

const x=canvas.width/2;
const y=canvas.height/2;
const radius=10;
let number=0;
let allnumber=0;
let Lv=1;

button1.addEventListener('click', buttonClick1);
button2.addEventListener('click', buttonClick2);

function buttonClick1() {
    number +=Lv;
    allnumber +=Lv;
}

function buttonClick2() {
    if(number>=10){
        Lv+=1;
        number -=10;
    }
}

ctx.fillStyle = "white";

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, radius+(0.1*number), 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
}

function drawnumber() {
    ctx.fontSize = "240px";
    ctx.textAlign = "center";
    ctx.strokeText(number, x, y);
}

function drawallnumber() {
    ctx.textAlign = "start";
    ctx.font = "bold 20px serif";;
    ctx.strokeText(allnumber, 0, 20);
    ctx.strokeText("Lv:"+Lv, 0, 40);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawnumber();
    drawallnumber();
  }

setInterval(draw, 10);



function copyButton(elementId) {
    // 指定したIDの要素のテキストを取得
    var element = document.getElementById(elementId);

    // テキストをクリップボードにコピー
    navigator.clipboard.writeText(element.textContent);
    alert("クリップボードにコピーしました。");
}