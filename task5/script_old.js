let headers=[];
let data = [];
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
var sizel = 100;
var sizeb = 30;
var x5=null;
var y5=null;
var x2=0;
var textbox = document.getElementById('text');
var xstart=null;
var ystart=null;
var xend=null;
var yend=null;
var sum=0;
var width1=0;
var arr=[];
var arr_width=[100,200,100,200,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100]
var x7=0;
var total=0;
var prev_width=0;
function excel()
{
var row = data.length;
var col = headers.length;
var height1 =sizeb*row+sizeb;
width1=0;
for (let i = 0; i < arr_width.length; i++) {
   width1+= arr_width[i];
}
canvas.setAttribute("height",height1);
canvas.setAttribute("width",width1)
// for(let i=0;i<row+1;i++){
//   var counter=0;
//   for(let j =0;j<col+1;j++){
//     ctx.save()  
//     ctx.restore()
//     ctx.stroke();
//     counter+=arr_width[j];  
//   }
// }
var counter=0;
for(let i =0;i<headers.length;i++){

    ctx.save()
    ctx.fillStyle = "white";
    ctx.strokestyle="black";
    ctx.rect(counter,0,arr_width[i],sizeb);
    ctx.clip()
    ctx.font = `${18}px areal `;
    ctx.fillStyle = "black";    
    ctx.fillText(headers[i],counter+10,sizeb-10);
    
    counter+=arr_width[i];
    ctx.restore()
    ctx.stroke()
}
var countery=sizeb
for(let i=0;i<row;i++){
    var counter=0;
    for(let j=0;j<col;j++){
        ctx.save()
        ctx.fillStyle = "white";
        ctx.strokestyle="black";
        ctx.rect(counter,countery,arr_width[j],sizeb);
        ctx.clip()
        var y2=i*sizeb+sizeb ;
        ctx.font =`${18}px areal `;
        ctx.fillStyle = "black";
        ctx.fillText(data[i][headers[j]],counter+2,countery+sizeb-10);
        counter+=arr_width[j];
        ctx.restore()
        ctx.stroke()
    }
    countery+=sizeb
    
}
canvas.addEventListener("click",function (e){
    
    [x5,y5,sum]=showCoords (canvas,e);
    css(x5,y5,sum);
});
function css(x,y,sum)
{  
    var textbox = document.getElementById('text');
    textbox.style.display="block"
    textbox.style.width=`${arr_width[x-1]}px`;
    textbox.style.left=`${sum}px`;
    textbox.style.top=`${30*y}px`;
    textbox.value=data[y-1][headers[x-1]];
    textbox.focus();
}
}
function showCoords(canvas,event) {
    let rect= canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    var sum=0;
    var rows=0;
    for(var i=0;i<arr_width.length;i++){
        if(x>sum){
            rows++;
        }
        else{
            break
        }
        sum+=arr_width[i]
    }
    let y1=Math.floor(y/30) ;
    return([rows,y1,sum-arr_width[rows-1]]);
}
textbox.addEventListener("blur", function abc(event) {
    var t1= event.target.value;
    var x2=sum;
    var y2=y5*sizeb;
    data[y5-1][headers[x5-1]]=t1;
    // 
    // // ctx.clearRect(x2-arr_width[x5-1],y2+1,arr_width[x5-1],sizeb);
    // ctx.fillStyle = "white";
    // ctx.strokestyle="black";
    // ctx.font =`${18}px areal `;
    // ctx.fillStyle = "black";
    // ctx.fillText(t1,x2-arr_width[x5]+2,(y2+sizeb)-10);
    // ctx.strokeRect(x2-arr_width[x5-1],y2,arr_width[x5-1],sizeb);
    if(event.key === "Enter"){
        textbox.classList.toggle("hidden");
        textbox.removeEventListener("keyup",abc);
    }            
});
document.getElementById('file').addEventListener('change', function(event) { 
        var nofile = document.getElementById('nofile');
        nofile.classList.toggle("hidden");
        const file = event.target.files[0]; 
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
var active=false;
function mousemove(e) {
    [x1,y1,sum]=showCoords(canvas,e);
    // var x_final_min=Math.min(xstart,x1);
    // var y_final_min=Math.min(ystart,y1);
    // var x_final_max=Math.min(xstart,x1);
    // var y_final_max=Math.min(ystart,y1);
    for(var i=xstart;i<=x1;i++){
        var total=sum;
        for(var j=ystart; j<=y1; j++){
            total=sum
            ctx.fillStyle = "#ADD8E6";
            ctx.strokestyle="black";
            ctx.fillRect(total,30*j,arr_width[x1-1],sizeb);
            ctx.strokeRect(total,30*j,arr_width[x1-1],sizeb);
            ctx.stroke();
            ctx.font =`${18}px areal `;
            ctx.fillStyle = "black";
            ctx.fillText(data[j-1][headers[i-1]],total+2,30*(j+1)-10);
        }
        total+=arr_width[x1];
    }
    

 };
function mousedown(e){
    let rect= canvas.getBoundingClientRect();
    [xstart,ystart,sum]=showCoords(canvas,e);
    canvas.addEventListener("mousemove",mousemove);
    canvas.addEventListener("mouseup",function mouseup(e) {
        canvas.removeEventListener("mousemove",mousemove)
        excel()
        let rect= canvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        let add=0;
        [xend,yend,sum]=showCoords(canvas,e);
//         let xend=Math.floor(x/100) ;
//         let yend=Math.floor(y/30) ;
        // if (isDrawing) {
        //   drawLine(context, x, y, e.offsetX, e.offsetY);
        //   x = 0;
        //   y = 0;
        //   isDrawing = false;
        // }
        for(var i=xstart;i<=xend;i++){
            for(var j=ystart-1; j<yend; j++){
                arr.push(data[j][headers[i-1]]); 
            } 
        }
        for (let i = 0; i < arr.length; i++) {
            add+=parseInt(arr[i]);
        }
        const max = Math.max(...arr);
        const min = Math.min(...arr);
        var element = document.getElementById("add-val");
        var element1 = document.getElementById("avg-val");
        var element2 = document.getElementById("max-val");
        var element3 = document.getElementById("min-val");

        element.value="Sum = "+add;
        element1.value="Avg = "+(add/arr.length).toPrecision(6);
        element2.value="Max = "+max;
        element3.value="Min = "+min;
        sum=0;
        arr=[];
        canvas.removeEventListener("mouseup",mouseup);
    }); 
}
function resize_mouseup(e) {
    
    prev_width=arr_width[x7-2];
    canvas.removeEventListener("mouseup",resize_mouseup)
    canvas.removeEventListener("mousemove",resize_mousemove)
}
function resize_mousemove(e) {
        let rect= canvas.getBoundingClientRect();
        x2 = e.clientX - rect.left;
       
        arr_width[x7-2]=prev_width+(x2-total)
        if(arr_width[x7-2]<40){
            arr_width[x7-2]=40
            excel()
        }
        else{
            
            
            excel()
        }
        
    //     canvas.addEventListener("mouseup", function abc(e) {
    //         
            
    //         
    //         
    //         canvas.removeEventListener("mouseup",abc)
    //         })
    
}
function resize_mousedown(e) {
    textbox.style.display="none";
    [x7,y1,total]=showCoords(canvas,e)
    
    prev_width=arr_width[x7-2];
    canvas.addEventListener('mousemove',resize_mousemove)
    canvas.addEventListener("mouseup", resize_mouseup)
    // canvas.removeEventListener("mouseup",resize_mouseup)
    // canvas.removeEventListener("mousedown",resize_mousedown)
}
canvas.addEventListener("mousedown",mousedown);
canvas.addEventListener('mousemove', function(e) {
    let rect= canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let sum=0;
    

    for (let i = 0; i < arr_width.length; i++) {
        const edge = arr_width[i];

        if(sum+4>x && x>sum){
            canvas.style.cursor="col-resize"

            canvas.addEventListener("mousedown",resize_mousedown)
            
            break;

        }
       else{
        canvas.removeEventListener("mousedown",resize_mousedown)
        canvas.style.cursor="default"
       }

        sum+=edge
    }
    
})
function math(){
    addactive();
    if(active) {
        active = false;
    }else{
        active = true;
    }
    
    if(active){
    }
    else{
    }
        canvas.removeEventListener("mousedown",xyz);
        var element = document.getElementById("add-val");
        element.value="Sum...";
        var element1 = document.getElementById("avg-val");
        element1.value="Average...";
        var element2 = document.getElementById("max-val");
        element2.value="Max...";
        var element3 = document.getElementById("min-val");
        element3.value="Min...";
     
    canvas.addEventListener("mousemove", (e) => { 
        let rect= canvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
    
        let x1=Math.floor(x/100) ;
        let y1=Math.floor(y/30) ;
        
    
    });
}
function addactive() {
    var element = document.getElementById("math");
    element.classList.toggle("active");
}
const options = {
    
    container: document.getElementById('myChart'),
   
    data: [
        { month: 'Jan', avgTemp: 2.3, iceCreamSales: 162000 },
        { month: 'Mar', avgTemp: 6.3, iceCreamSales: 302000 },
        { month: 'May', avgTemp: 16.2, iceCreamSales: 800000 },
        { month: 'Jul', avgTemp: 22.8, iceCreamSales: 1254000 },
        { month: 'Sep', avgTemp: 14.5, iceCreamSales: 950000 },
        { month: 'Nov', avgTemp: 8.9, iceCreamSales: 200000 },
    ],
    
    series: [{ type: 'line', xKey: 'month', yKey: 'iceCreamSales' }],
};
const chart = agCharts.AgCharts.create(options);
function graph(){
    var myChart=document.getElementById("myChart")
    myChart.classList.toggle("hidden");
}
function csvToJson(csv) { 

        const lines = csv.split('\n'); 
        headers = lines[0].split(','); 

        const result = []; 

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