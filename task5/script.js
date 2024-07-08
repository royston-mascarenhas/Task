let headers=[];
let data = [];
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
var sizel = 100;
var sizeb = 30;
var x5=null;
var y5=null;

function excel()
{
var row = data.length;
var col = headers.length;
var height1 =sizeb*row+sizeb;
var width1 =sizel *col;

canvas.setAttribute("height",height1);
canvas.setAttribute("width",width1)

for(let i=0;i<row+1;i++){
  for(let j =0;j<col+1;j++){
    var x = j*sizel;
    var y = i*sizeb;
    ctx.fillStyle = "white";
    ctx.strokestyle="black";
    ctx.fillRect(x,y,sizel,sizeb);
    ctx.strokeRect(x,y,sizel,sizeb);
    ctx.stroke();
  }
}

for(let i =0;i<headers.length;i++){
    var x1 =i*sizel;
    var y1=1*sizeb ;
    ctx.font = `${18}px areal `;
    ctx.fillStyle = "black";
    ctx.fillText(headers[i],x1+10,y1-10);
}


var x4=0;
for(let i=2;i<=row+1;i++){
    
    for(let j=0;j<col;j++){
       
        var x2=j*sizel;
        var y2=i*sizeb ;
        ctx.font =`${18}px areal `;
        ctx.fillStyle = "black";
        ctx.fillText(data[x4][headers[j]],x2+2,y2-10);
        
    }
    x4++;
}

function showCoords(canvas,event) {
    let rect= canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    let x1=Math.floor(x/100) ;
    let y1=Math.floor(y/30) ;
    console.log(x1,y1);
    return([x1,y1]);
  }

  
  canvas.addEventListener("click",function (e){
    [x5,y5]=showCoords (canvas,e);

    css(x5,y5);
  });

  

function css(x,y)
{    
    var textbox = document.getElementById('text');
    textbox.classList.toggle("hidden");
    textbox.style.left=`${100*x}px`;
    textbox.style.top=`${30*y}px`;
    textbox.value=data[y-1][headers[x]];
    textbox.focus();

}


}
var textbox = document.getElementById('text');
textbox.addEventListener("blur", function abc(event) {
    var t1= event.target.value;
    var x2=x5*sizel;
    var y2=y5*sizeb;
    console.log(t1);
    ctx.clearRect(x2,y2+1,sizel,sizeb);
    ctx.fillStyle = "white";
    ctx.strokestyle="black";
    ctx.font =`${18}px areal `;
    ctx.fillStyle = "black";
    ctx.fillText(t1,x2,(y2+sizeb)-10);
    ctx.strokeRect(x2,y2,sizel,sizeb);


    if(event.key === "Enter"){
        textbox.classList.toggle("hidden");
        textbox.removeEventListener("keyup",abc);
    }            
});
    document.getElementById('file').addEventListener('change', function(event) { 
        var nofile = document.getElementById('nofile');
        nofile.classList.toggle("hidden");
        const file = event.target.files[0]; 
        console.log(file);
        if (!file) { 
            return; 
        } 
    
        const reader = new FileReader(); 
        reader.onload = function(e) {

            const text = e.target.result; 
            const json = csvToJson(text); 

            data= json; 
            excel();
            
        }; 
    
        reader.readAsText(file); 

    }); 

    function csvToJson(csv) { 

        const lines = csv.split('\n'); 
        const result = []; 

        headers = lines[0].split(','); 

        for (let i = 1; i < lines.length; i++) { 
            const obj = {}; 
            const currentLine = lines[i].split(','); 
            for (let j = 0; j < headers.length; j++) { 
                obj[headers[j]] = currentLine[j]; 
            } 
            result.push(obj); 
        } 
        return result; 
    }
// function readcsv(){
//     const reader = new FileReader()

// function read(input) {
// 	const csv = input.files[0]
// 	reader.readAsText(csv)
// }

// reader.onload = function (e) {
// 	document.querySelector('.output').innerText = e.target.result;
// }
// }



// function csvJSON(csv){

//     var lines=csv.split("\n");
  
//     var result =[];

//     var headers=lines[0].split(",");
  
//     for(var i=1;i<lines.length;i++){
  
//         var obj = {};
//         var currentline=lines[i].split(",");
  
//         for(var j=0;j<headers.length;j++){
//             obj[headers[j]] = currentline[j];
//         }
//         result.push(obj);
//     }
  
//     return (result);
//   }