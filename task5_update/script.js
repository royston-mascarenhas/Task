var window_height = window.innerHeight;
var window_width = window.innerWidth;
class Excel {
  arr_width=[100,200,100,200,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100]
    
      constructor(csv,container) {
          this.csv = csv;
          this.container = container;
          this.init();
          this.csvToExcel();
          this.drawHeader()
          this.drawSidebar()
          this.activeCell;
          this.val=false;
          this.max_c=0
          this.min_c=0
          this.max_r=0
          this.min_r=0
          this.math_sum=0
          this.arr_selected=[]
          // this.canvas.addEventListener("mousedown",(e)=>this.mousedown(e,this.canvas))
    }
        
        init() {
          this.createcanvas();
    }
        
        createcanvas() {
        this.textbox=document.createElement("input")
        this.textbox.style.display="none"
      
        let header = document.createElement("canvas")
        header.width = this.container.offsetWidth
        header.height = 30
        this.container.appendChild(header)
        this.header=header
        this.htx = header.getContext("2d")
 
        let sidebar = document.createElement("canvas")
        sidebar.width = 100
        sidebar.height = this.container.offsetHeight - 30
        this.stx = sidebar.getContext("2d")
        
        
        this.canvas_parent=document.createElement("div")

        this.canvas_parent.style.position="relative"
        this.textbox.style.position="absolute"

        let canvas = document.createElement("canvas")
        canvas.width = this.container.offsetWidth - 100
        canvas.height = this.container.offsetHeight - 30

        this.canvas=canvas

        this.canvas_parent.appendChild(this.canvas)
        this.canvas_parent.appendChild(this.textbox)
        this.container.appendChild(this.canvas_parent)

        this.ctx = canvas.getContext("2d")
 
        this.container.appendChild(sidebar)
        this.container.appendChild(canvas)

        this.canvas.addEventListener("click",(e)=> this.click(e,this.canvas));
        this.canvas.addEventListener("dblclick",(e)=>this.double_click(e,this.canvas));
        this.canvas.addEventListener("mousedown", (e)=>this.mousedown(e,this.canvas))
        this.textbox.addEventListener("blur",(e)=>this.textset(e,this.canvas));
        this.header.addEventListener("mousemove",(e)=>this.resize(e,this.header));
    }

        resize(e,header){
        let rect= header.getBoundingClientRect();
        let x = e.clientX -rect.left-100;
        let sum=0;

        for (let i = 0; i <this.arr_width.length; i++) {
            const edge =this.arr_width[i];
            if(sum+4>x && x>sum){
                header.style.cursor="col-resize"
                this.header.addEventListener("mousedown",(e)=>this.resize_mousedown(e,this.header))
                break;
            }
            else{
      
            header.style.cursor="default"
            }
            sum+=edge
        }
    }

        csvToExcel() {
          const lines = this.csv.split("\n");
          let headers = lines[0].split(",");
          this.arr2d =[];
          let header1d=[];
          let counter=0

          this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)

          for (let j = 0; j < headers.length; j++) {
            let rectData = {};
            rectData["xpos"] = counter;
            rectData["ypos"] = 0;
            rectData["width"] = this.arr_width[j];
            rectData["height"] = 30;
            rectData["color"] = "#9A9A9AFF";
            rectData["data"] = headers[j];
            rectData["lineWidth"] = 1;
            rectData["rows"] = 0;
            rectData["cols"] = j;
            header1d.push(rectData);
            this.createCell(rectData,this.ctx);
            counter+=this.arr_width[j]
          }

          this.arr2d.push(header1d);

          for (let i = 1; i < lines.length; i++) {
            counter=0
            let data1d = [];
            for (let j = 0; j < headers.length; j++) {
              let rectData = {};
              rectData["xpos"] = counter;
              rectData["ypos"] = i * 30;
              rectData["width"] = this.arr_width[j];
              rectData["height"] = 30;
              rectData["color"] = "#9A9A9AFF";
              rectData["data"] = lines[i].split(",")[j];
              rectData["lineWidth"] = 1;
              rectData["rows"] = i;
              rectData["cols"] = j;
              data1d.push(rectData);
              this.createCell(rectData,this.ctx);
              counter+=this.arr_width[j]
            }
            this.arr2d.push(data1d);
          }
          this.activeCell=this.arr2d[0][0]
         
    }
        
        createCell(data,x) {
          x.save();
          x.beginPath();
          
          x.rect(data.xpos, data.ypos, data.width, data.height);
          x.clip()
          x.strokeStyle =data.color;
          x.font = `${18}px areal`;
          x.fillStyle = "black";
          x.lineWidth=data.lineWidth;
          x.fillText(data.data,data.xpos + 10, data.ypos + data.height - 5);
         
          x.stroke();
          x.restore();
    }

        createHighCell(data,x) {
          x.beginPath();
          x.rect(data.xpos, data.ypos, data.width, data.height)
          x.strokeStyle ="green";
          x.font = `${18}px areal`;
          x.fillStyle = "black";
          x.lineWidth=4;
          x.stroke();
    }
        
        clearCell(data,x){
          x.clearRect(data.xpos,data.ypos,data.width,data.height);
    }

        clearHighCell(data,x){
            x.clearRect(data.xpos-2,data.ypos-2,data.width+4,data.height+4);
    }
 
        drawHeader() {
        let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        let arr = chars.split("")
        let header1dhead=[];
        let counter=0

        this.htx.clearRect(0,0,this.header.width,this.header.height)

          for (let j = 0; j < this.arr_width.length; j++) {
            let rectDatahead = {};
            rectDatahead["xpos"] = counter+100;
            rectDatahead["ypos"] = 0;
            rectDatahead["width"] =this.arr_width[j];
            rectDatahead["height"] = 30;
            rectDatahead["color"] = "#9A9A9AFF";
            rectDatahead["data"] = arr[j];
            rectDatahead["lineWidth"] = 1;
            // header1dhead.push(rectDatahead);
            this.createCell(rectDatahead,this.htx);
            counter+=this.arr_width[j]
          }
    }

        drawSidebar() {
        // let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        // let arr = chars.split("")
        let arr = [...Array(26)].map((_, i) => i+1)
        let header1dhead=[];

          for (let j = 0; j < arr.length; j++) {
            let rectDatahead = {};
            rectDatahead["xpos"] = 0;
            rectDatahead["ypos"] = j * 30 ;
            rectDatahead["width"] = 100;
            rectDatahead["height"] = 30;
            rectDatahead["color"] = "#9A9A9AFF";
            rectDatahead["data"] = arr[j];
            rectDatahead["lineWidth"] = 1;
            header1dhead.push(rectDatahead);
            this.createCell(rectDatahead,this.stx);
          }
    }
      
        click(e,canvas){
            let n = (e)=>this.keyMove(e,this.canvas,x5,y5)
            this.textbox.style.display="none"
            this.clearHighCell(this.activeCell,this.ctx)
            this.createCell(this.activeCell,this.ctx)
            let [x5,y5,sum]=this.showCoords(this.canvas,e);
            this.cell=this.arr2d[y5][x5-1]
            this.activeCell=this.cell
            this.createHighCell(this.activeCell,this.ctx)
            // canvas.addEventListener("mousemove",(e)=>this.mousemove(e,canvas,this.cell))
            if(!this.val){
              window.addEventListener("keydown",n);
              this.val=true
            }
    }

        mouseup(e,canvas){
          canvas.removeEventListener("mousemove",this.mousemove)
          canvas.removeEventListener("mousedown",this.mousemove)
    }

        keyMove(e,canvas,x5,y5){
          this.clearHighCell(this.activeCell,this.ctx)
          this.createCell(this.activeCell,this.ctx)
          let{rows,cols}=this.activeCell

          if(e.which== 37) { 
            if(cols<=0){
              this.activeCell=this.arr2d[rows][cols]
              this.createHighCell(this.activeCell,this.ctx)
            }else{
              this.activeCell=this.arr2d[rows][cols-1]
              this.createHighCell(this.activeCell,this.ctx)
            }
          }
          else if(e.which == 39) { 
              this.activeCell=this.arr2d[rows][cols+1]
              this.createHighCell(this.activeCell,this.ctx)
          }
          else if(e.which == 38) {
            if(rows<=0){
              this.activeCell=this.arr2d[rows][cols]
              this.createHighCell(this.activeCell,this.ctx)
            }else{
              this.activeCell=this.arr2d[rows-1][cols]
              this.createHighCell(this.activeCell,this.ctx)
            }
            
          }
          else if(e.which == 40) { 
            this.activeCell=this.arr2d[rows+1][cols]
            this.createHighCell(this.activeCell,this.ctx)
          }
    }
  
        double_click(e ,canvas){
            let [x5,y5,sum]=this.showCoords(this.canvas,e);
            this.cell=this.arr2d[y5][x5-1]
            this.textbox_visible(this.cell);
    }

        textbox_visible(cell)
        {  
            this.textbox.style.display="block"
            this.textbox.style.width=`${cell.width}px`;
            this.textbox.style.left=`${cell.xpos+100}px`;
            this.textbox.style.top=`${cell.ypos}px`;
            this.textbox.style.height=`${cell.height}px`;
            this.textbox.style.boxSizing="border-box";
            this.textbox.style.zIndex="1"
            this.textbox.value=cell.data;
            this.textbox.focus();
    }
        
        textset(event,canvas) {
          var t1= event.target.value;
          this.cell.data=t1;
          this.clearCell(this.cell,this.ctx)
          this.createCell(this.cell,this.ctx)       
    }

        showCoords(canvas,event) {
          let rect= this.canvas.getBoundingClientRect();
          let x = event.clientX - rect.left;
          let y = event.clientY - rect.top;
          var sum=0;
          var rows=0;
          for(var i=0;i<this.arr_width.length;i++){
              if(x>sum){
                  rows++;
              }
              else{
                  break
              }
              sum+=this.arr_width[i]
          }
          let y1=Math.floor(y/30) ;
          return([rows,y1,sum-this.arr_width[rows-1]]);
    }

        mousedown(e,canvas){

          this.clearHighCell(this.activeCell,this.ctx)
          this.createCell(this.activeCell,this.ctx)
          let [x5,y5,sum]=this.showCoords(this.canvas,e);

          this.cell_initial=this.arr2d[y5][x5-1]

          var mousemove=(e)=> {
            let [x1,y1,sum]=this.showCoords(this.canvas,e);
            this.cell_final=this.arr2d[y1][x1-1]

            let r1=this.cell_initial.rows
            let r2=this.cell_final.rows
            let c1=this.cell_initial.cols
            let c2=this.cell_final.cols
            this.max_r=Math.max(r1,r2)
            this.min_r=Math.min(r1,r2)
            this.max_c=Math.max(c1,c2)
            this.min_c=Math.min(c1,c2)
            this.math_sum=0
            this.arr_selected=[]
            for(var i=this.min_r;i<=this.max_r;i++){
                 for(var j=this.min_c; j<=this.max_c; j++){
                     this.final_cell=this.arr2d[i][j]
                     this.math_sum+=parseInt(this.final_cell.data);
                     this.arr_selected.push(this.final_cell.data)
                     this.createHighCell(this.final_cell,this.ctx)
                    //  this.math_sum+=this.final_cell.data
                 }
             }
            
          };

          var mouseup=(e)=> {
            for(var i=this.min_r;i<=this.max_r;i++){
              for(var j=this.min_c; j<=this.max_c; j++){
                  this.final_cell=this.arr2d[i][j]
                  
                  this.clearHighCell(this.final_cell,this.ctx)
                  this.createCell(this.final_cell,this.ctx)
              }
          }
           
            canvas.removeEventListener("mousemove",mousemove)
            canvas.removeEventListener("mousedown",this.mousedown)
            console.log("MAX = "+Math.max(...this.arr_selected))
            console.log("MIN = "+Math.min(...this.arr_selected))
            console.log("SUM = "+this.math_sum)
          }
          canvas.addEventListener("mousemove",mousemove)
          canvas.addEventListener("mouseup",mouseup)
    }

        resize_mousedown(e,header) {
            let addition=0;
            this.textbox.style.display="none";
            let[x7,y1,total]=this.showCoords(this.header,e)
            this.prev_width=this.arr_width[x7-2];

            var resize_mousemove=(e)=> {
                let rect= header.getBoundingClientRect();
                let x2 = e.clientX - rect.left -100;
                addition=(x2-total)
          }
            var resize_mouseup=(e)=> {
            this.arr_width[x7-2]=this.prev_width+addition

            if(this.arr_width[x7-2]<50){
              this.arr_width[x7-2]= 50
            }

            else{
              this.arr_width[x7-2]=this.prev_width+addition
            }
    
            this.drawHeader()
            this.csvToExcel()
            header.removeEventListener("mousemove",resize_mousemove)
            header.removeEventListener('mouseup',resize_mouseup)
      }
      header.addEventListener('mousemove',resize_mousemove)
      header.addEventListener('mouseup',resize_mouseup)
    } 
}
    csv = `Sr. No.,First Name,Last Name,Age,Height,Gender,Age,Height,Gender,Age,Height,Gender,Age,Height,Gender,Age,Height,Gender,Age,Height,Gender,Age
      1,Roy,Mas,21,156,Male,291,426,Male,561,696,Male,831,966,Male,1101,1236,Male,1371,1506,Male,1641
      2,Ash,Lop,22,151,Male,280,409,Male,538,667,Male,796,925,Male,1054,1183,Male,1312,1441,Male,1570
      3,Rit,Kha,32,123,Female,214,305,Female,396,487,Female,578,669,Female,760,851,Female,942,1033,Female,1124
      4,Man,Pat,12,21,Male,30,39,Male,48,57,Male,66,75,Male,84,93,Male,102,111,Male,120
      5,Roh,Sin,3,234,Female,465,696,Female,927,1158,Female,1389,1620,Female,1851,2082,Female,2313,2544,Female,2775
      6,Vir,Pat,22,11,Female,0,-11,Female,-22,-33,Female,-44,-55,Female,-66,-77,Female,-88,-99,Female,-110
      7,Abhi,Man,41,23,Female,5,-13,Female,-31,-49,Female,-67,-85,Female,-103,-121,Female,-139,-157,Female,-175
      8,Raj,Sin,22,21,Male,20,19,Male,18,17,Male,16,15,Male,14,13,Male,12,11,Male,10
      9,Moh,Pree,35,1,Male,-33,-67,Male,-101,-135,Male,-169,-203,Male,-237,-271,Male,-305,-339,Male,-373
      10,Ajay,Pra,11,161,Female,311,461,Female,611,761,Female,911,1061,Female,1211,1361,Female,1511,1661,Female,1811
      11,Jake,Lew,28,181,Male,334,487,Male,640,793,Male,946,1099,Male,1252,1405,Male,1558,1711,Male,1864
      12,Si,Mi,20,190,Male,360,530,Male,700,870,Male,1040,1210,Male,1380,1550,Male,1720,1890,Male,2060
      13,Jos,Hil,11,121,Female,231,341,Female,451,561,Female,671,781,Female,891,1001,Female,1111,1221,Female,1331
      14,Ale,Pie,22,191,Male,360,529,Male,698,867,Male,1036,1205,Male,1374,1543,Male,1712,1881,Male,2050
      15,Yir,Pro,43,167,Female,291,415,Female,539,663,Female,787,911,Female,1035,1159,Female,1283,1407,Female,1531
      16,Glo,Ter,23,191,Male,359,527,Male,695,863,Male,1031,1199,Male,1367,1535,Male,1703,1871,Male,2039
      17,Glo,Ter,23,191,Male,359,527,Male,695,863,Male,1031,1199,Male,1367,1535,Male,1703,1871,Male,2039
      18,Glo,Ter,23,191,Male,359,527,Male,695,863,Male,1031,1199,Male,1367,1535,Male,1703,1871,Male,2039
      19,Glo,Ter,23,191,Male,359,527,Male,695,863,Male,1031,1199,Male,1367,1535,Male,1703,1871,Male,2039
      20,Glo,Ter,23,191,Male,359,527,Male,695,863,Male,1031,1199,Male,1367,1535,Male,1703,1871,Male,2039
      21,Glo,Ter,23,191,Male,359,527,Male,695,863,Male,1031,1199,Male,1367,1535,Male,1703,1871,Male,2039
      22,Glo,Ter,23,191,Male,359,527,Male,695,863,Male,1031,1199,Male,1367,1535,Male,1703,1871,Male,2039
      23,Glo,Ter,23,191,Male,359,527,Male,695,863,Male,1031,1199,Male,1367,1535,Male,1703,1871,Male,2039
      24,Glo,Ter,23,191,Male,359,527,Male,695,863,Male,1031,1199,Male,1367,1535,Male,1703,1871,Male,2039
      25,Glo,Ter,23,191,Male,359,527,Male,695,863,Male,1031,1199,Male,1367,1535,Male,1703,1871,Male,2039`;

    let excel = new Excel(csv, document.querySelector(".container"));