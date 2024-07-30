class Excel {
  arr_width = [
    100, 200, 100, 200, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
  ];

  constructor(csv, container) {
    this.header1dside = [];
    this.csv = csv;
    this.container = container;
    this.init();
    this.csvToExcel();
    this.cell1
    this.cell2
    this.activeCell;
    this.activeRow;
    this.activeCol;
    this.val = false;
    this.max_c = 0;
    this.min_c = 0;
    this.max_r = 0;
    this.min_r = 0;
    this.math_sum = 0;
    this.scrollX = 0;
    this.scrollY = 0;
    this.drawHeader();
    this.drawSidebar();
    this.drawOptimized();
    this.xscroll = false;
    this.arr_selected = [];
    this.ele = 0;
    this.counter=1
  }

  init() {
    this.createcanvas();
  }

  csvToExcel() {
    const lines = this.csv.trim().split("\n");
    let headers = lines[0].split(",");
    this.arr2d = [];
    this.header1d = [];
    let counter = 0;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

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
      this.header1d.push(rectData);
      counter += this.arr_width[j];
    }

    this.arr2d.push(this.header1d);

    for (let i = 1; i < lines.length; i++) {
      counter = 0;
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
        counter += this.arr_width[j];
      }
      this.arr2d.push(data1d);
    }
    this.activeCell = this.arr2d[0][0];
  }

  createcanvas() {
    document.body.style.margin="0"
    let emptyBox = document.createElement("div")
    emptyBox.style.width ="60px"
    emptyBox.style.height ="30px"
    emptyBox.style.boxSizing = "border-box"
    emptyBox.style.display = "inline-block"
    emptyBox.style.background="#80808044"
    this.container.appendChild(emptyBox)
    this.textbox = document.createElement("input");
    this.textbox.style.display = "none";

    let header = document.createElement("canvas");
    header.width = this.container.offsetWidth-60;
    header.height = 30;
    this.container.appendChild(header);
    this.header = header;
    this.htx = header.getContext("2d");

    let sidebar = document.createElement("canvas");
    sidebar.width = 60;
    sidebar.height = this.container.offsetHeight - 30;
    this.sidebar=sidebar
    this.stx = sidebar.getContext("2d");

    this.canvas_parent = document.createElement("div");
    this.canvas_parent.id = "canvas_parent";

    this.canvas_parent.style.position = "relative";
    this.textbox.style.position = "absolute";

    let canvas = document.createElement("canvas");
    canvas.width = this.container.offsetWidth - 60;
    canvas.height = this.container.offsetHeight - 30;
    canvas.id = "canvas";

    this.canvas = canvas;

    this.canvas_parent.appendChild(this.canvas);
    this.canvas_parent.appendChild(this.textbox);
    this.container.appendChild(this.canvas_parent);

    this.ctx = canvas.getContext("2d");

    this.container.appendChild(sidebar);
    this.container.appendChild(canvas);
    this.container.style.fontSize="0px"
    // this.canvas.addEventListener("click", (e) => this.click(e, this.canvas));
    this.canvas.addEventListener("dblclick", (e) =>
      this.double_click(e, this.canvas)
    );
    this.canvas.addEventListener("mousedown", (e) =>
      this.mousedown(e, this.canvas)
    );
    this.textbox.addEventListener("blur", (e) => this.textset(e, this.canvas));
    this.header.addEventListener("mousemove", (e) =>
      this.resize(e, this.header)
    );
    this.header.addEventListener("mousemove", (e) =>
      this.resize(e, this.header)
    );
    this.sidebar.addEventListener("mousedown", (e) =>
      this.select_row(e, this.sidebar)
    );
    window.addEventListener("keydown", this.Xscroll.bind(this));
    window.addEventListener("keyup", this.Xscroll.bind(this));
    this.canvas.addEventListener("wheel", this.scroller.bind(this));
    // this.canvas.addEventListener("mouseleave",this.mouseleave.bind(this));
    window.addEventListener("resize",this.resize_event.bind(this))
  }
 
  resize_event(){
    canvas.width = this.container.offsetWidth-60;
    canvas.height = this.container.offsetHeight-30;
    this.header.width = this.container.offsetWidth-60;
    this.header.height = 30;
    this.sidebar.width = 60;
    this.sidebar.height = this.container.offsetHeight - 30;
    this.drawHeader()
    this.drawSidebar()
    this.drawOptimized()
  }

  drawHeader() {
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let arr = chars.split("");
    this.header1dhead = [];
    let counter = 0;
    for (let j = 0; j < this.arr_width.length; j++) {
      let rectDatahead = {};
      rectDatahead["xpos"] = counter;
      rectDatahead["ypos"] = 0;
      rectDatahead["width"] = this.arr_width[j];
      rectDatahead["height"] = 30;
      rectDatahead["color"] = "#9A9A9AFF";
      rectDatahead["data"] = arr[j];
      rectDatahead["lineWidth"] = 1;
      this.header1dhead.push(rectDatahead);
      counter += this.arr_width[j];
    }  
    this.activeRow = this.header1dhead[0];
    this.activeCol = this.header1dside[0];
  }

  drawSidebar() {
    let arr = [...Array(this.arr2d.length)].map((_, i) => i + 1);
    for (let j = 0; j < arr.length; j++) {
      let rectDatahead = {};
      rectDatahead["xpos"] = 0;
      rectDatahead["ypos"] = j * 30;
      rectDatahead["width"] = 100;
      rectDatahead["height"] = 30;
      rectDatahead["color"] = "#9A9A9AFF";
      rectDatahead["data"] = arr[j];
      rectDatahead["lineWidth"] = 1;
      this.header1dside.push(rectDatahead);
    }
  }

  drawHead()
  {
    this.header1dhead.forEach( c=> {
      this.createCellH(c,this.htx)
    });
  }
  
  drawSide()
  {
    this.header1dside.forEach( c=> {
      this.createCellS(c,this.stx)
    });
  }

  resize(e, header) {
    let rect = header.getBoundingClientRect();
    let x = e.clientX - rect.left+this.scrollX;
    let sum = 0;

    for (let i = 0; i < this.arr_width.length; i++) {
      const edge = this.arr_width[i];
      if (sum + 4 > x && x > sum) {
        header.style.cursor = "col-resize";
        this.header.addEventListener("mousedown", (e) =>
          this.resize_mousedown(e, this.header)
        );
        break;
      } else {
        // this.header.addEventListener("mousedown", (e) =>
        //   this.select_col(e, this.header)
        // );
        header.style.cursor = "default";
      }
      sum += edge;
    }
  }
  
  select_col(e){
    let[x,y,sum]=this.showCoords(this.header,e)
    this.cell1=this.arr2d[y][x-1]
    this.cell2=this.arr2d[y+10][x-1]
    
    this.highlightCells(this.cell1,this.cell2)
  }

  select_row(e){
    let[x,y,sum]=this.showCoords(this.sidebar,e)
    this.cell1=this.arr2d[y][x-1]
    this.cell2=this.arr2d[y][x-1+1]
    
    this.highlightCells(this.cell1,this.cell2)
  }

  resize_mousedown(e, header) {
    this.arr_selected = [];
    let addition = 0;
    this.textbox.style.display = "none";
    let [x7, y1, total] = this.showCoords(this.header, e);
    this.prev_width = this.arr_width[x7 - 2];
    var resize_mousemove = (e) => {
      let rect = header.getBoundingClientRect();
      let x2 = e.clientX - rect.left+this.scrollX; 
      addition = x2 - total;

      this.arr_width[x7 - 2] = this.prev_width + addition;

      if (this.arr_width[x7 - 2] < 50) {
        this.arr_width[x7 - 2] = 50;
      } else {
        this.arr_width[x7 - 2] = this.prev_width + addition;
      }
      this.widthAdj()
      this.drawOptimized() 
    };
    var mouseleave=(e)=>{
      this.header.removeEventListener("mousemove", resize_mousemove);
    };
    var resize_mouseup = (e) => {
      header.removeEventListener("mousemove", resize_mousemove);
      header.removeEventListener("mouseup", resize_mouseup);
    };
    header.addEventListener("mousemove", resize_mousemove);
    header.addEventListener("mouseup", resize_mouseup);
    header.addEventListener("mouseleave", mouseleave);
  }

  widthAdj(){
    let counter = 0;
    for (let j = 0; j < this.arr2d[0].length; j++) {
      let rectData =this.arr2d[0][j];
      rectData.xpos = counter;
      rectData.width = this.arr_width[j];
      counter += this.arr_width[j];
    }
    for (let i = 1; i < this.arr2d.length; i++) {
      counter = 0;
      for (let j = 0; j < this.arr2d[0].length; j++) {
        let rectData =this.arr2d[i][j];
        rectData.xpos = counter;
        rectData.width = this.arr_width[j];
        counter += this.arr_width[j];
      }
    }
    counter=0
    for (let j = 0; j < this.header1dhead.length; j++) {
      let rectDatahead = this.header1dhead[j];
      rectDatahead.xpos = counter;
      rectDatahead.width = this.arr_width[j];
      counter += this.arr_width[j];
    }
  }

  createCell(data, x) {
  switch (x) {
    case this.stx:
        x.translate(this.scrollX, 0)
        break;
    case this.htx:
        x.translate(0, this.scrollY)
        break;
    default:
        break;
            }
 
    x.save();
    x.beginPath();
    x.rect(
      data.xpos - this.scrollX-0.5,
      data.ypos - this.scrollY-0.5,
      data.width+1,
      data.height+1
    );
    x.clip();
    x.strokeStyle = data.color;
    x.font = `${18}px areal`;
    x.fillStyle = "black";
    x.lineWidth = data.lineWidth;
    x.fillText(
      data.data,
      data.xpos + 10 - this.scrollX,
      data.ypos + data.height - 5 - this.scrollY
    );
    x.stroke();
    x.restore();
    x.setTransform(1,0,0,1,0,0)
  }

  createCellH(data,x){
  switch (x) {
    case this.stx:
        x.translate(this.scrollX, 0)
        break;
    case this.htx:
        x.translate(0, this.scrollY)
        break;
    default:
        break;
            }
 
    x.save();
    x.beginPath();
    x.fillStyle="#80808033"
    x.rect(
      data.xpos - this.scrollX,
      data.ypos - this.scrollY,
      data.width,
      data.height
    );
    x.fill()
    x.clip();
    x.strokeStyle = data.color;
    x.font = `${18}px areal`;
    x.fillStyle = "black";
    x.lineWidth = data.lineWidth;
    x.fillText(
      data.data,
      data.xpos +(data.width/2)-10 - this.scrollX,
      data.ypos + data.height - 8 - this.scrollY
    );
    x.stroke();
    x.restore();
    x.setTransform(1,0,0,1,0,0)
  }

  createCellS(data,x){
  switch (x) {
   case this.stx:
       x.translate(this.scrollX, 0)
       break;
   case this.htx:
       x.translate(0, this.scrollY)
       break;
   default:
       break;
           }
   x.save();
   x.beginPath();
   x.fillStyle="#80808033"
   x.rect(
     data.xpos - this.scrollX,
     data.ypos - this.scrollY,
     data.width,
     data.height
   );
   x.fill()
   x.clip();
   x.strokeStyle = data.color;
   x.font = `${18}px areal`;
   x.fillStyle = "black";
   x.lineWidth = data.lineWidth;
   x.fillText(
     data.data,
     data.xpos +(data.width/2)-20 - this.scrollX,
     data.ypos + data.height - 8 - this.scrollY
   );
   x.stroke();
   x.restore();
   x.setTransform(1,0,0,1,0,0)
 }
  
  createHighHeader(data, x) {
    x.save()
    x.beginPath();
    x.moveTo(data.xpos-this.scrollX,30)
    x.lineTo(data.xpos-this.scrollX+data.width,30); 
    x.lineTo(data.xpos-this.scrollX+data.width,0); 
    x.lineTo(data.xpos-this.scrollX,0); 
    x.fillStyle="#03723C33"
    x.fill() 
    x.restore()
    x.save()
    x.beginPath()
    x.strokeStyle = "green";
    x.lineWidth = 4;
    x.moveTo(data.xpos-this.scrollX,30)
    x.lineTo(data.xpos-this.scrollX+data.width,30); 
    x.stroke()
    x.restore()
 
  }

  createHighSide(data, x) {
    x.save()
    x.beginPath();
    x.moveTo(data.xpos+60,data.ypos-this.scrollY)
    x.lineTo(data.xpos+60,data.ypos-this.scrollY+data.height);  
    x.lineTo(data.xpos+0,data.ypos-this.scrollY+data.height);  
    x.lineTo(data.xpos+0,data.ypos-this.scrollY);  
    x.fillStyle="#03723C33"
    x.fill() 
    x.restore()
    x.save()
    x.beginPath()
    x.strokeStyle = "green";
    x.lineWidth = 4;
    x.moveTo(data.xpos+60,data.ypos-this.scrollY)
    x.lineTo(data.xpos+60,data.ypos-this.scrollY+data.height);  
    x.stroke();
    x.restore()
 
  }

  createHighCell(data, x) {
    x.beginPath();
    x.rect(
      data.xpos - this.scrollX,
      data.ypos - this.scrollY,
      data.width,
      data.height
    );
    x.strokeStyle = "green";
    x.font = `${18}px areal`;
    x.fillStyle = "black";
    x.lineWidth = 4;
    x.stroke();
  }

  clearCell(data, x) {
    x.clearRect(
      data.xpos - this.scrollX,
      data.ypos - this.scrollY,
      data.width,
      data.height
    );
  }

  clearHighCell(data, x) {
    x.clearRect(
      data.xpos - 2 - this.scrollX,
      data.ypos - 2 - this.scrollY,
      data.width + 4,
      data.height + 4
    );
  }

  clearHighHS(data, x) {
    x.clearRect(
      data.xpos - this.scrollX,
      data.ypos - this.scrollY,
      data.width ,
      data.height 
    );
  }

  double_click(e, canvas) {
    let [x5, y5, sum] = this.showCoords(this.canvas, e);
    this.cell = this.arr2d[y5][x5 - 1];
    this.textbox_visible(this.cell);
  }

  textbox_visible(cell) {
    this.textbox.style.display = "block";
    this.textbox.style.width = `${cell.width}px`;
    this.textbox.style.left = `${cell.xpos + 60 - this.scrollX}px`;
    this.textbox.style.top = `${cell.ypos - this.scrollY}px`;
    this.textbox.style.height = `${cell.height}px`;
    this.textbox.style.boxSizing = "border-box";
    this.textbox.style.zIndex = "1";
    this.textbox.value = cell.data;
    this.textbox.focus();
  }

  textset(event, canvas) {
    var t1 = event.target.value;
    this.cell.data = t1;
    this.clearCell(this.cell, this.ctx);
    this.createCell(this.cell, this.ctx);
  }

  keyMove(e, canvas, x5, y5) { 
    if(e.target==this.textbox){
      return
    }
    if (this.arr_selected.length > 1) {
      this.arr_selected.forEach((c) => this.clearHighCell(c, this.ctx));
      this.arr_selected.forEach((c) => this.createCell(c, this.ctx));
    }
    this.clearHighCell(this.activeCell, this.ctx);
    this.createCell(this.activeCell, this.ctx);
    let {rows,cols} = this.activeCell;

    if(e.key.match(/^\w$/)){
      this.textbox_visible(this.activeCell)
    }
    if (e.which == 37) {
      if(this.activeCell.xpos - this.activeCell.width < this.scrollX)
        {
          this.scrollX=Math.max(0,this.scrollX-100)
          this.drawOptimized()
        }
      this.textbox.style.display = "none";
      if (cols <= 0) {
        this.activeCell = this.arr2d[rows][cols];
        // this.textbox_visible(this.activeCell);
        // this.textbox.style.display = "none";
        this.createHighCell(this.activeCell, this.ctx);
      } else {
        this.activeCell = this.arr2d[rows][cols - 1];
        cols--;
        this.createHighCell(this.activeCell, this.ctx);
      }
    }else if (e.which == 39) {
      if(this.activeCell.xpos+200>this.scrollX+this.canvas.width)
      {
        this.scrollX+=100
        this.drawOptimized()
      }
      this.textbox.style.display = "none";
      this.activeCell = this.arr2d[rows][cols + 1];
      this.createHighCell(this.activeCell, this.ctx);
    }else if (e.which == 38) {
      if(this.activeCell.ypos - this.activeCell.height < this.scrollY)
        {
          this.scrollY=Math.max(0,this.scrollY-30)
          this.drawOptimized()
        }
      this.textbox.style.display = "none";
      if (rows <= 0) {
        this.activeCell = this.arr2d[rows][cols];
        this.createHighCell(this.activeCell, this.ctx);
      } else {
        this.activeCell = this.arr2d[rows - 1][cols];
        rows--;
        this.createHighCell(this.activeCell, this.ctx);
      }
    }else if (e.which == 40) {

      if(this.activeCell.ypos+30>this.scrollY+this.canvas.height)
        {
          this.scrollY+=30
          this.drawOptimized()
        }
      this.textbox.style.display = "none";
      this.activeCell = this.arr2d[rows + 1][cols];
      this.createHighCell(this.activeCell, this.ctx);
    } else if (e.which == 27) {
      if (this.arr_selected.length > 1) {
        this.arr_selected.forEach((c) => this.clearHighCell(c, this.ctx));
        this.arr_selected.forEach((c) => this.createCell(c, this.ctx));
      }
    } else if (e.which == 9) {
      this.activeCell = this.arr2d[rows][cols + 1];
      this.createHighCell(this.activeCell, this.ctx);
    } else if (e.which == 46) {
      this.arr_selected.forEach((c) => (c.data = ""));
      this.arr_selected.forEach((c) => this.clearCell(c, this.ctx));
      this.arr_selected.forEach((c) => this.createCell(c, this.ctx));
      this.activeCell.data = "";
      this.clearCell(this.activeCell, this.ctx);
      this.createCell(this.activeCell, this.ctx);
    }
    else if (e.which == 13) {
      this.textbox.style.display = "none";
      this.activeCell = this.arr2d[rows + 1][cols];
      this.createHighCell(this.activeCell, this.ctx);
    }
  }

  showCoords(canvas, event) {
    let rect = this.canvas.getBoundingClientRect();
    let x = Math.max(0, event.clientX - rect.left + this.scrollX);
    let y = Math.max(0, event.clientY - rect.top + this.scrollY);
    var sum = 0;
    var rows = 0;
    for (var i = 0; i < this.arr_width.length; i++) {
      if (x > sum) {
        rows++;
      } else {
        break;
      }
      sum += this.arr_width[i];
    }
    let y1 = Math.floor(y / 30);
    return [rows, y1, sum - this.arr_width[rows - 1]];
  }

  mousedown(e, canvas) {

    this.htx.clearRect(0, 0, this.header.width, this.header.height);
    this.stx.clearRect(0, 0, this.sidebar.width, this.sidebar.height);
    this.drawHead()
    this.drawSide()

    let n = (e) => this.keyMove(e, this.canvas, x5, y5);
    this.textbox.style.display = "none";
  
    if(this.counter> 1){
      this.clearHighCell(this.activeCell, this.ctx);
      this.clearHighHS(this.activeRow, this.htx);
      this.clearHighHS(this.activeCol, this.stx);
      this.createCell(this.activeCell, this.ctx);
      this.createCellH(this.activeRow, this.htx);
      this.createCellS(this.activeCol, this.stx);
    }
    this.counter++;
    let [x1, y1, sum1] = this.showCoords(this.canvas, e);
    this.activeRow=this.header1dhead[x1-1]
    this.activeCol=this.header1dside[y1]
    console.log(this.activeRow)
    console.log(this.activeCol)
    this.activeCell = this.arr2d[y1][x1 - 1];
    this.createHighCell(this.activeCell, this.ctx);
    this.createHighHeader(this.activeRow, this.htx);
    this.createHighSide(this.activeCol, this.stx);
    if (!this.val) {
      window.addEventListener("keydown", n);
      this.val = true;
    }
    this.arr_selected = [];
    let [x5, y5, sum] = this.showCoords(this.canvas, e);
    this.cell_initial = this.arr2d[y5][x5 - 1];
    for (var i = this.min_r; i <= this.max_r; i++) {
      for (var j = this.min_c; j <= this.max_c; j++) {
        this.final_cell = this.arr2d[i][j];
        this.clearHighCell(this.final_cell, this.ctx);
        this.createCell(this.final_cell, this.ctx);
      }
    }
    var mousemove = (e) => {
      let [x1, y1, sum] = this.showCoords(this.canvas, e);
      this.cell_final = this.arr2d[y1][x1 - 1];
      let r1 = this.cell_initial.rows;
      let r2 = this.cell_final.rows;
      let c1 = this.cell_initial.cols;
      let c2 = this.cell_final.cols;
      this.max_r = Math.max(r1, r2);
      this.min_r = Math.min(r1, r2);
      this.max_c = Math.max(c1, c2);
      this.min_c = Math.min(c1, c2);
      this.math_sum = 0;
      this.arr_select_temp = [];
      this.ele = 0;
      for (var i = this.min_r; i <= this.max_r; i++) {
        for (var j = this.min_c; j <= this.max_c; j++) {
          this.final_cell = this.arr2d[i][j];
          this.arr_select_temp.push(this.final_cell);
          this.math_sum += parseInt(this.final_cell.data) || 0;
          this.arr_selected.push(parseInt(this.final_cell.data) || 0);
        }
      }
      this.arr_diff = this.arr_selected.filter(
        (c) => this.arr_select_temp.indexOf(c) === -1
      );
      this.arr_diff.forEach((c) => this.clearHighCell(c, this.ctx));
      this.arr_diff.forEach((c) => this.createCell(c, this.ctx));
      this.arr_selected = this.arr_select_temp;
    

      for (let index = 0; index < this.arr_selected.length; index++) {
        if (this.arr_selected[index].data != "") this.ele++;
      }
      this.highlightCells(this.cell_initial, this.cell_final);
    };
    var mouseup = (e) => {
      this.cell=this.activeCell

      this.activeCell=this.cell_initial
      this.createHighCell(this.activeCell,this.ctx)
      canvas.removeEventListener("mousemove", mousemove);
      canvas.removeEventListener("mousedown", this.mousedown);
      console.log("MAX = " + Math.max(...this.arr_selected.map((c) => parseInt(c.data) ? c.data : 0)));
      console.log("MIN = " + Math.min(...this.arr_selected.map((c) => parseInt(c.data) ? c.data : Infinity)));
      console.log("SUM = " + this.math_sum);
      console.log("Number Of Selected Elements= " + this.ele);
      canvas.removeEventListener("mouseup", mouseup);
    };
    var mouseleave=(e)=>{
      this.canvas.removeEventListener("mousemove", mousemove);
      
    };
    canvas.addEventListener("mousemove", mousemove);
    canvas.addEventListener("mouseup", mouseup);
    canvas.addEventListener("mouseleave", mouseleave);
  }

  highlightCells(cell_initial, cell_final) {
    this.arr_selected.forEach((c) => {
      this.clearHighCell(c, this.ctx);
      this.createCell(c, this.ctx);
      this.htx.clearRect(0, 0, this.header.width, this.header.height);
      this.stx.clearRect(0, 0, this.sidebar.width, this.sidebar.height);
      this.drawHead()
      this.drawSide()
    });
    let context = this.ctx;
    context.translate(-this.scrollX,-this.scrollY)
    let leftX1 = Math.min(
      cell_initial.xpos,
      cell_final.xpos,
      cell_initial.xpos + cell_initial.width,
      cell_final.xpos + cell_final.width
    );
    let leftX2 = Math.max(
      cell_initial.xpos,
      cell_final.xpos,
      cell_initial.xpos + cell_initial.width,
      cell_final.xpos + cell_final.width
    );
    let topX1 = Math.min(
      cell_initial.ypos,
      cell_final.ypos + cell_final.height,
      cell_initial.ypos + cell_initial.height,
      cell_final.ypos
    );
    let topX2 = Math.max(
      cell_initial.ypos,
      cell_final.ypos + cell_final.height,
      cell_initial.ypos + cell_initial.height,
      cell_final.ypos
    );
    context.save()
    context.beginPath();
    context.moveTo(leftX1, topX1);
    context.lineTo(leftX2, topX1);
    context.lineTo(leftX2, topX2);
    context.lineTo(leftX1, topX2);
    context.lineTo(leftX1, topX1);

    if(this.arr_selected.length>1){
      context.fillStyle="#03723C33"
      context.fill()
    }
    context.strokeStyle = "#03723C";
    context.lineWidth = 3;
    context.stroke()
    context.restore()

    this.clearCell(this.cell_initial,this.ctx)
    this.createCell(this.cell_initial,this.ctx)

    this.htx.save()
    this.htx.beginPath();
    this.htx.moveTo(leftX1-this.scrollX,30);
    this.htx.lineTo(leftX2-this.scrollX,30);
    this.htx.lineTo(leftX2-this.scrollX,0);
    this.htx.lineTo(leftX1-this.scrollX,0);
    this.htx.lineTo(leftX1-this.scrollX,30);
    this.htx.fillStyle="#03723C33"
    this.htx.fill()
    this.htx.restore()
    this.htx.save()
    this.htx.beginPath()
    this.htx.strokeStyle="green"
    this.htx.lineWidth = 4;
    this.htx.moveTo(leftX1-this.scrollX,30);
    this.htx.lineTo(leftX2-this.scrollX,30);
    this.htx.stroke()
    this.htx.restore()
    
    this.stx.moveTo(60,topX1-this.scrollY);
    this.stx.lineTo(60,topX2-this.scrollY);
    this.stx.lineTo(0,topX2-this.scrollY);
    this.stx.lineTo(0,topX1-this.scrollY);
    this.stx.lineTo(60,topX1-this.scrollY);
    this.stx.fillStyle="#03723C33"
    this.stx.fill()
    this.stx.restore()
    this.stx.save()
    this.stx.beginPath()
    this.stx.strokeStyle = "green";
    this.stx.lineWidth = 4;
    this.stx.moveTo(60,topX1-this.scrollY);
    this.stx.lineTo(60,topX2-this.scrollY);
    this.stx.stroke()
    this.stx.restore()
    context.setTransform(1,0,0,1,0,0)
  }

  mouseup(e, canvas) {
    canvas.removeEventListener("mousemove", this.mousemove);
    canvas.removeEventListener("mousedown", this.mousemove);
  }

  Xscroll(event) {
    if (event.shiftKey) {
      this.xscroll = true;
    } else {
      this.xscroll = false;
    }
  }

  scroller(event) {
    this.textbox.style.display="none"
    this.createHighCell(this.activeCell,this.ctx)
    let {deltaX, deltaY } = event;
    if (this.xscroll) {
      this.scrollX = Math.max(0, this.scrollX + deltaY);
    } else {
      this.scrollY =Math.max(0, this.scrollY + (deltaY < 0 ? -30 : 30));
    }
    this.drawOptimized();
  }

  extendData(count, axis) {
    if (axis === 1) {
      this.arr2d.forEach((row, i) => {
        let prevColumns = row.length;
        for (let j = prevColumns; j < prevColumns + count; j++) {
          let left = row[row.length - 1].xpos + row[row.length - 1].width;
          let top = row[row.length - 1].ypos;
          let rectData = {};
          rectData["xpos"] = left;
          rectData["ypos"] = top;
          rectData["width"] = 100;
          this.arr_width.push(100)
          rectData["height"] = 30;
          rectData["color"] = "#9A9A9AFF";
          rectData["data"] = "";
          rectData["lineWidth"] = 1;
          rectData["rows"] = i;
          rectData["cols"] = j;
          row.push(rectData);
          this.createCell(rectData, this.ctx);
        }
      });
      this.extendHeader(count)
    } 
    else {
      let prevRows = this.arr2d.length;
      for (let i = prevRows; i < prevRows + count; i++) {
        let row = this.arr2d[i - 1];
        let extend1d = [];
        for (let j = 0; j < row.length; j++) {
          let left = row[j].xpos;
          let top = row[j].ypos + row[j].height;
          let rectData = {};
          rectData["xpos"] = left;
          rectData["ypos"] = top;
          rectData["width"] = this.arr_width[j];
          rectData["height"] = 30;
          rectData["color"] = "#9A9A9AFF";
          rectData["data"] = "";
          rectData["lineWidth"] = 1;
          rectData["rows"] = i;
          rectData["cols"] = j;
          extend1d.push(rectData);
          this.createCell(rectData, this.ctx);
        }
        this.arr2d.push(extend1d);
      }
      this.extendSidebar(count)
    }
  }

  extendHeader(count){
    let row=this.header1dhead  
    let prevColumns = row.length;
    for (let j = prevColumns; j < prevColumns + count; j++) {
      let left = row[row.length - 1].xpos + row[row.length - 1].width;
      let top = row[row.length - 1].ypos;
      let rectData = {};
      rectData["xpos"] = left;
      rectData["ypos"] = top;
      rectData["width"] = 100;
      rectData["height"] = 30;
      rectData["color"] = "#9A9A9AFF";
      rectData["data"] =this.toLetters(j+1);
      rectData["lineWidth"] = 1;
      row.push(rectData);
    }
  }

  extendSidebar(count){
    let row=this.header1dside
    let prevColumns = row.length;
        for (let j = prevColumns; j < prevColumns+count; j++) {
          let left = 0;
          let top = row[j-1].ypos + row[j-1].height;
          let rectData = {};
          rectData["xpos"] = left;
          rectData["ypos"] = top;
          rectData["width"] = 100;
          rectData["height"] = 30;
          rectData["color"] = "#9A9A9AFF";
          rectData["data"] = j+1;
          rectData["lineWidth"] = 1;
          row.push(rectData);
    }
  }

  toLetters(num){
    var mod = num % 26,
        pow = num / 26 | 0,
        out = mod ? String.fromCharCode(64 + mod) : (--pow, 'Z');
    return pow ? this.toLetters(pow) + out : out;
  }

  drawOptimized() {
    this.htx.clearRect(0, 0, this.header.width, this.header.height);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.stx.clearRect(0, 0, this.sidebar.width, this.sidebar.height);
    let canvaWidth = this.canvas.offsetWidth;
    let canvaHeight = this.canvas.offsetHeight;
    let initHeight = 0;
    let newScrollY = this.scrollY;
    let newScrollX = this.scrollX;
    for (let i = newScrollY / 30; i < this.arr2d.length; i++) {  
      const row = this.arr2d[i];
      if (i === this.arr2d.length - 1) {
        this.extendData(10, 2);
      }
      if (initHeight > canvaHeight + newScrollY) {
        break;
      } 
      else {
        let initWidth = 0;
        initHeight += row[0].height;
        this.createCellS(this.header1dside[i],this.stx)
        for (let j = 0; j < row.length; j++) {
          if (j === row.length - 2) {
            this.extendData(10, 1);
          }
          if (initWidth > canvaWidth + newScrollX) {
            break;
          } 
          else {
            initWidth += row[j].width;
            const col = row[j];
            this.createCell(col, this.ctx);
            if( i == newScrollY / 30)
            this.createCellH(this.header1dhead[j],this.htx)
          }
        }
      }
    }
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
      25,Glo,Ter,23,191,Male,359,527,Male,695,863,Male,1031,1199,Male,1367,1535,Male,1703,1871,Male,2039
      `;

let excel = new Excel(csv.repeat(2), document.querySelector(".container"));
