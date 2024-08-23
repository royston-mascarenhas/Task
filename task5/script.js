class Excel {
  arr_width = [
    100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
    100, 100, 100, 100, 100, 100, 100,
  ];

  /**
   * @typedef{object} Cell
   * @property{number} xpos
   * @property{number} ypos
   * @property{number} width
   * @property{number} height
   * @property{string} color
   * @property{string} data
   * @property{number} lineWidth
   * @property{number} rows
   * @property{number} cols
   */

  /**
   *
   * @param {string} csv CSV is string
   * @param {HTMLDivElement} container wrapper for Excel
   */
  constructor(data, container) {
    // this.csv = csv;
    this.lineDashOffset = 0;
    this.container = container;
    this.header1dhead = [];
    this.header1dside = [];
    this.createcanvas();
    this.jsonToExcel(data);
    this.math_sum = 0;
    this.scrollX = 0;
    this.scrollY = 0;
    this.xscroll = false;
    this.busy = null;
    this.dx = 0;
    this.dy = 0;
    this.first = true;
    this.col_selection = false;
    this.render();
  }

  // async upload(){
  //   try {
  //     const response = await fetch('http://localhost:5056/api/messages/send', {
  //         method: 'POST',
  //         headers: {
  //             'Content-Type': 'application/json'
  //         },
  //         body: JSON.stringify(this.arr2d)
  //     });

  //     if (response.ok) {
  //         console.log('Data sent successfully');
  //         alert('Data sent successfully');
  //     } else {
  //         console.error('Error sending data');
  //         alert('Error sending data');
  //     }
  // } catch (error) {
  //     console.error('Error:', error);
  //     alert('Error sending data');
  // }
  // }

  /**
   * Render Function with Request Animation
   * @returns {boolean} Indicates whether busy or not
   */
  render() {
    if (this.busy) return;

    this.busy = requestAnimationFrame(() => {
      this.busy = null;
      this.drawOptimized();
      this.highlightCells();
      this.smooth();
      this.infiX.style.width = `${this.arr2d[0].length * 100}px`;
      this.infiY.style.height = `${this.arr2d.length * 30}px`;
      this.lineDashOffset -= 1;
      if (this.cut) this.render();
    });
  }

  /**
   * Smooth increment in scroll value
   */
  smooth() {
    this.scrollX += (this.dx - this.scrollX) * 0.1;
    this.scrollY += (this.dy - this.scrollY) * 0.1;
    if (
      Math.round(this.scrollX) != this.dx ||
      Math.round(this.scrollY) != this.dy
    ) {
      this.render();
    }
  }

  /**
   * Converts csv file to string
   */
  // csvToExcel() {
  //   const lines = this.csv.trim().split("\n");
  //   let headers = lines[0].split(",");
  //   this.arr2d = [];
  //   this.header1d = [];
  //   let counter = 0;

  //   for (let j = 0; j < headers.length; j++) {
  //     let rectData = {};
  //     rectData["xpos"] = counter;
  //     rectData["ypos"] = 0;
  //     rectData["width"] = this.arr_width[j];
  //     rectData["height"] = 30;
  //     rectData["color"] = "#9A9A9AFF";
  //     rectData["data"] = headers[j];
  //     rectData["lineWidth"] = 1;
  //     rectData["rows"] = 0;
  //     rectData["cols"] = j;
  //     this.header1d.push(rectData);
  //     counter += this.arr_width[j];
  //   }
  //   this.arr2d.push(this.header1d);

  //   for (let i = 1; i < lines.length; i++) {
  //     counter = 0;
  //     let data1d = [];
  //     for (let j = 0; j < headers.length; j++) {
  //       let rectData = {};
  //       rectData["xpos"] = counter;
  //       rectData["ypos"] = i * 30;
  //       rectData["width"] = this.arr_width[j];
  //       rectData["height"] = 30;
  //       rectData["color"] = "#9A9A9AFF";
  //       rectData["data"] = lines[i].split(",")[j];
  //       rectData["lineWidth"] = 1;
  //       rectData["rows"] = i;
  //       rectData["cols"] = j;
  //       data1d.push(rectData);
  //       counter += this.arr_width[j];
  //     }
  //     this.arr2d.push(data1d);

  //   }
  //   this.extendHeader(this.arr2d[0].length)
  //   this.extendSidebar(this.arr2d.length)

  //   this.activeCell = this.arr2d[0][0];
  //   this.arr_selected=[this.activeCell]
  // }

  jsonToExcel(data) {
    console.log(data);
    let counter = 0;
    this.arr2d = [];

    let max_col = Math.max(...data.map((d) => d.col));
    console.log(max_col);
    let max_row = Math.max(...data.map((d) => d.row));
    console.log(max_row);

    for (let i = 0; i < max_row; i++) {
      counter = 0;
      let data1d = [];
      for (let j = 0; j < max_col; j++) {
        let d = {};
        d["xpos"] = counter;
        d["ypos"] = i * 30;
        d["width"] = this.arr_width[j];
        d["height"] = 30;
        d["color"] = "#9A9A9AFF";
        d["data"] = data[i * (max_col) + j]['data'];
        d["lineWidth"] = 1;
        d["rows"] = i;
        d["cols"] = j;
        console.log(data[i * j + j]['data'])
        data1d.push(d);
        counter += this.arr_width[j];
      }
      this.arr2d.push(data1d);
      data1d=[]
    }
    console.log(this.arr2d);

    this.extendHeader(this.arr2d[0].length);
    this.extendSidebar(this.arr2d.length);

    this.activeCell = this.arr2d[0][0];
    this.arr_selected = [this.activeCell];

    this.render()
  }
  /**
   * Creates HTML Elements
   */
  createcanvas() {
    document.body.style.margin = "0";
    let emptyBox = document.createElement("div");

    this.rightclick = document.createElement("div");
    this.rightclick.style.cursor = "pointer";
    this.rightclick.style.borderRadius = "10px";
    this.rightclick.style.fontFamily = "Segoe UI";
    this.rightclick.style.fontSize = "14px";

    this.rightclick_1 = document.createElement("div");
    this.rightclick_2 = document.createElement("div");
    this.rightclick_3 = document.createElement("div");
    this.rightclick_4 = document.createElement("div");
    this.rightclick_5 = document.createElement("div");
    this.rightclick_6 = document.createElement("div");

    this.rightclick.style.textAlign = "left";
    this.rightclick.style.padding = "10px";
    this.rightclick.style.border = "solid 1px black";

    this.rightclick_1.style.height = "40px";
    this.rightclick_1.textContent = "CUT";

    this.rightclick_2.style.height = "40px";
    this.rightclick_2.textContent = "COPY";

    this.rightclick_3.style.height = "40px";
    this.rightclick_3.textContent = "PASTE";

    this.rightclick_4.style.height = "40px";
    this.rightclick_4.textContent = "DELETE";

    this.rightclick_5.style.height = "40px";
    this.rightclick_5.textContent = "SORT";

    this.rightclick_6.style.height = "40px";
    this.rightclick_6.textContent = "GRAPH";

    let infiX_parent = document.createElement("div");
    this.infiX_parent = infiX_parent;
    this.infiX = document.createElement("div");
    let infiY_parent = document.createElement("div");
    this.infiY_parent = infiY_parent;
    this.infiY = document.createElement("div");
    emptyBox.style.width = "60px";
    emptyBox.style.height = "30px";
    emptyBox.style.boxSizing = "border-box";
    emptyBox.style.display = "inline-block";
    emptyBox.style.background = "#80808044";
    this.container.appendChild(emptyBox);

    this.textbox = document.createElement("input");
    this.textbox.style.display = "none";
    this.textbox.style.border = "2px solid green";
    this.textbox.style.boxSizing = "border-box";

    let header = document.createElement("canvas");
    header.width = this.container.offsetWidth - 90;
    header.height = 30;
    this.container.appendChild(header);
    this.header = header;
    this.htx = header.getContext("2d");

    let sidebar = document.createElement("canvas");
    sidebar.width = 60;
    sidebar.height = this.container.offsetHeight - 30;
    this.sidebar = sidebar;
    this.stx = sidebar.getContext("2d");

    this.canvas_parent = document.createElement("div");
    this.canvas_parent.id = "canvas_parent";

    this.canvas_parent.style.position = "relative";
    this.textbox.style.position = "absolute";

    let canvas = document.createElement("canvas");
    canvas.width = this.container.offsetWidth - 90;
    canvas.height = this.container.offsetHeight - 30;
    canvas.id = "canvas";

    this.canvas = canvas;
    infiX_parent.style.width = "1860px";
    infiX_parent.style.height = "20px";
    infiX_parent.style.overflowX = "scroll";
    infiX_parent.style.position = "fixed";
    infiX_parent.style.bottom = 0;
    infiX_parent.style.left = "60px";

    infiY_parent.style.width = "20px";
    infiY_parent.style.height = "906px";
    infiY_parent.style.overflowY = "scroll";
    infiY_parent.style.position = "fixed";
    infiY_parent.style.top = "30px";
    infiY_parent.style.right = 0;

    this.rightclick.style.display = "none";
    this.textbox.style.outline = "none";
    this.textbox.style.paddingLeft = "8px";
    this.textbox.style.paddingTop = "9px";
    this.textbox.style.font = "Arial";
    this.textbox.style.fontSize = "16px";
    this.canvas_parent.appendChild(this.canvas);
    this.canvas_parent.appendChild(this.textbox);
    this.container.appendChild(this.canvas_parent);
    this.ctx = canvas.getContext("2d");

    this.container.appendChild(sidebar);
    this.container.appendChild(canvas);
    this.container.appendChild(infiX_parent);
    this.container.appendChild(infiY_parent);
    infiX_parent.appendChild(this.infiX);
    infiY_parent.appendChild(this.infiY);
    this.container.appendChild(this.rightclick);

    this.rightclick.appendChild(this.rightclick_1);
    this.rightclick.appendChild(this.rightclick_2);
    this.rightclick.appendChild(this.rightclick_3);
    this.rightclick.appendChild(this.rightclick_4);
    this.rightclick.appendChild(this.rightclick_5);
    this.rightclick.appendChild(this.rightclick_6);

    this.canvas.style.cursor = "cell";
    this.container.style.fontSize = "0px";
    // this.canvas.addEventListener("click", (e) => this.click(e, this.canvas));
    this.canvas.addEventListener("dblclick", (e) =>
      this.double_click(e, this.canvas)
    );
    this.canvas.addEventListener("contextmenu", (e) =>
      this.right_click(e, this.canvas)
    );
    this.canvas.addEventListener("mousedown", (e) =>
      this.mousedown(e, this.canvas)
    );
    this.textbox.addEventListener("blur", (e) => this.textset(e, this.canvas));
    this.header.addEventListener("mousemove", (e) =>
      this.resize(e, this.header)
    );

    this.canvas.addEventListener("mousemove", (e) => this.grab(e, this.canvas));

    this.header.addEventListener("mousedown", (e) =>
      this.resize_mousedown(e, this.header)
    );

    window.addEventListener("keyup", (e) => {
      this.xscroll = false;
    });
    this.canvas.addEventListener("wheel", this.scroller.bind(this));
    // this.canvas.addEventListener("mouseleave",this.mouseleave.bind(this));
    window.addEventListener("resize", this.resize_event.bind(this));
    window.addEventListener("keydown", this.keyMove.bind(this));
    infiX_parent.addEventListener("scroll", this.infi1.bind(this));
    infiY_parent.addEventListener("scroll", this.infi2.bind(this));
    this.rightclick_1.addEventListener("click", this.cut_cell);
    this.rightclick_2.addEventListener("click", this.copy_cell);
    this.rightclick_3.addEventListener("click", this.paste_cell);
    this.rightclick_4.addEventListener("click", this.delete_cell);
    this.rightclick_5.addEventListener("click", this.sort_cell);
    this.rightclick_6.addEventListener("click", this.graph_cell);
  }

  /**
   * Used to grab and replace
   * @param {MouseEvent} e
   * @param {HTMLCanvasElement} canvas
   */
  grab(e, canvas) {
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left + this.scrollX;
    let y = e.clientY - rect.top + this.scrollY;
    if (
      (x > this.l1 - 3 &&
        x < this.l1 + 5 &&
        y > this.t1 - 3 &&
        y < this.t1 + 5) ||
      (x > this.l2 - 3 &&
        x < this.l2 + 5 &&
        y > this.t1 - 3 &&
        y < this.t1 + 5) ||
      (x > this.l1 - 3 && x < this.l1 + 5 && y > this.t2 - 3 && y < this.t2 + 5)
    ) {
      if (this.crosshair_detected) return;

      if (this.selection_mode) return;
      this.canvas.style.cursor = "grab";
      this.grab_detected = true;
    } else if (
      x > this.l2 - 5 &&
      x < this.l2 &&
      y > this.t2 - 5 &&
      y < this.t2
    ) {
      if (this.grab_detected) return;

      if (this.selection_mode) return;
      this.canvas.style.cursor = "crosshair";
      this.crosshair_detected = true;
    } else {
      if (!this.nograbchange) {
        this.canvas.style.cursor = "cell";
        this.grab_detected = false;
        this.crosshair_detected = false;
      }
    }
  }

  /**
   * Enables X-axis Scroll using scrollbar
   * @param {DragEvent} event
   */
  infi1(event) {
    this.dx = event.target.scrollLeft;
    this.render();
  }

  /**
   * Enables Y-axis Scroll using scrollbar
   * @param {DragEvent} event
   */
  infi2(event) {
    this.dy = Math.floor(event.target.scrollTop / 30) * 30;
    this.render();
  }

  /**
   * Converts 1D Array to 2D Array
   */
  arrayConverter() {
    let arr_selected_2d = [];
    let arr_selected_1d = [];

    let i = 0;
    for (; i < this.arr_selected.length - 1; i++) {
      arr_selected_1d.push(this.arr_selected[i]);
      if (this.arr_selected[i].ypos != this.arr_selected[i + 1].ypos) {
        arr_selected_2d.push(arr_selected_1d);
        arr_selected_1d = [];
      }
    }
    arr_selected_2d.push(arr_selected_1d);
    arr_selected_2d[arr_selected_2d.length - 1].push(this.arr_selected[i]);
    this.arr_selected_2d = arr_selected_2d;
  }

  /**
   * Used to handle resizing of window
   */
  resize_event() {
    canvas.width = this.container.offsetWidth - 60;
    canvas.height = this.container.offsetHeight - 30;
    this.infiX_parent.style.width = this.container.offsetWidth - 60;
    this.infiY_parent.style.height = this.container.offsetHeight - 30;
    this.header.width = this.container.offsetWidth - 60;
    this.header.height = 30;
    this.sidebar.width = 60;
    this.sidebar.height = this.container.offsetHeight - 30;
    this.render();
  }

  /**
   * Used to detectEdge while using mousemove in header
   * @param {Event} e
   * @param {HTMLCanvasElement} header
   */
  resize(e, header) {
    let rect = header.getBoundingClientRect();
    let x = e.clientX - rect.left + this.scrollX;
    let sum = 0;
    this.edge_detected = false;

    for (let i = 0; i < this.arr_width.length; i++) {
      const edge = this.arr_width[i];
      if (sum + 4 > x && x > sum) {
        header.style.cursor = "col-resize";
        this.edge_detected = true;
        this.col_selection = false;
        break;
      } else {
        // this.header.addEventListener("mousedown", (e) =>
        //   this.select_col(e, this.header)
        // );
        if (this.mousedown_resize) this.edge_detected = true;
        else this.edge_detected = false;
        this.col_selection = true;
        header.style.cursor = "default";
      }
      sum += edge;
    }
  }

  /**
   * Used for resizing Columns
   * @param {MouseEvent} e
   * @param {HTMLCanvasElement} header
   */
  resize_mousedown(e, header) {
    let addition = 0;
    let arr_select_t = [];
    let [x7, y1, total] = this.showCoords(this.header, e);
    this.col_selected = x7 - 1;
    this.prev_width = this.arr_width[x7 - 2];
    if (this.edge_detected) this.mousedown_resize = true;

    if (this.col_selection) {
      for (let i = 0; i < this.arr2d.length; i++) {
        arr_select_t.push(this.arr2d[i][x7 - 1]);
      }
      this.arr_selected = arr_select_t;
      this.render();
    }

    var resize_mousemove = (e) => {
      if (this.edge_detected) {
        let rect = header.getBoundingClientRect();
        let x2 = e.clientX - rect.left + this.scrollX;
        addition = x2 - total;

        if (this.edge_detected) {
          this.arr_width[x7 - 2] = this.prev_width + addition;

          if (this.arr_width[x7 - 2] < 50) {
            this.arr_width[x7 - 2] = 50;
          } else {
            this.arr_width[x7 - 2] = this.prev_width + addition;
          }
          this.widthAdj();
          this.render();
        }
      }
    };

    var mouseleave = (e) => {
      this.mousedown_resize = false;

      this.header.removeEventListener("mousemove", resize_mousemove);
    };

    var resize_mouseup = (e) => {
      this.mousedown_resize = false;

      header.removeEventListener("mousemove", resize_mousemove);
      header.removeEventListener("mouseup", resize_mouseup);
    };
    header.addEventListener("mousemove", resize_mousemove);
    header.addEventListener("mouseup", resize_mouseup);
    header.addEventListener("mouseleave", mouseleave);
  }

  /**
   * Used Adjust left position of cell after resize
   */
  widthAdj() {
    let counter = 0;
    for (let j = 0; j < this.arr2d[0].length; j++) {
      let rectData = this.arr2d[0][j];
      rectData.xpos = counter;
      rectData.width = this.arr_width[j];
      counter += this.arr_width[j];
    }
    for (let i = 1; i < this.arr2d.length; i++) {
      counter = 0;
      for (let j = 0; j < this.arr2d[0].length; j++) {
        let rectData = this.arr2d[i][j];
        rectData.xpos = counter;
        rectData.width = this.arr_width[j];
        counter += this.arr_width[j];
      }
    }
    counter = 0;
    for (let j = 0; j < this.header1dhead.length; j++) {
      let rectDatahead = this.header1dhead[j];
      rectDatahead.xpos = counter;
      rectDatahead.width = this.arr_width[j];
      counter += this.arr_width[j];
    }
  }

  /**
   * Used for cell creation  using rect
   * @param {Cell} data
   * @param {CanvasRenderingContext2D} x
   */
  createCell(data, x) {

    // console.log(data)
    switch (x) {
      case this.stx:
        x.translate(this.scrollX, 0);
        break;
      case this.htx:
        x.translate(0, this.scrollY);
        break;
      default:
        break;
    }

    x.restore();
    x.save();
    x.beginPath();
    x.rect(
      data.xpos - this.scrollX - 0.5,
      data.ypos - this.scrollY - 0.5,
      data.width + 1,
      data.height + 1
    );
    x.clip();
    x.strokeStyle = data.color;
    x.font = `${16}px Arial`;
    x.fillStyle = "black";
    x.lineWidth = data.lineWidth;
    x.fillText(
      data.data,
      data.xpos + 10 - this.scrollX,
      data.ypos + data.height - 5 - this.scrollY
    );
    x.stroke();
    x.restore();
    x.setTransform(1, 0, 0, 1, 0, 0);
    x.save();
  }

  /**
   * Used for header cell creation  using rect
   * @param {Cell} data
   * @param {CanvasRenderingContext2D} x
   */
  createCellH(data, x) {
    switch (x) {
      case this.stx:
        x.translate(this.scrollX, 0);
        break;
      case this.htx:
        x.translate(0, this.scrollY);
        break;
      default:
        break;
    }

    x.save();
    x.beginPath();
    x.fillStyle = "#80808033";
    x.rect(
      data.xpos - this.scrollX,
      data.ypos - this.scrollY,
      data.width,
      data.height
    );
    x.fill();
    x.clip();
    x.strokeStyle = data.color;
    x.font = `${16}px Arial`;
    x.fillStyle = "black";
    x.lineWidth = data.lineWidth;
    x.fillText(
      data.data,
      data.xpos + data.width / 2 - 10 - this.scrollX,
      data.ypos + data.height - 8 - this.scrollY
    );
    x.stroke();
    x.restore();
    x.setTransform(1, 0, 0, 1, 0, 0);
  }

  /**
   * Used for sidebar cell creation using rect
   * @param {Cell} data
   * @param {CanvasRenderingContext2D} x
   */
  createCellS(data, x) {
    switch (x) {
      case this.stx:
        x.translate(this.scrollX, 0);
        break;
      case this.htx:
        x.translate(0, this.scrollY);
        break;
      default:
        break;
    }
    x.save();
    x.beginPath();
    x.fillStyle = "#80808033";
    x.rect(
      data.xpos - this.scrollX,
      data.ypos - this.scrollY,
      data.width,
      data.height
    );
    x.fill();
    x.clip();
    x.strokeStyle = data.color;
    x.font = `${16}px Arial`;
    x.fillStyle = "black";
    x.lineWidth = data.lineWidth;
    x.fillText(
      data.data,
      data.xpos + data.width / 2 - 20 - this.scrollX,
      data.ypos + data.height - 8 - this.scrollY
    );
    x.stroke();
    x.restore();
    x.setTransform(1, 0, 0, 1, 0, 0);
  }

  /**
   * Used to create rectangle at the bottom right of active cell using rect
   * @param {number} l2
   * @param {number} t2
   */
  createActiveBottom(l2, t2) {
    this.ctx.restore();
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.fillStyle = "green";
    this.ctx.clearRect(l2 - this.scrollX - 5, t2 - this.scrollY - 5, 10, 10);
    this.ctx.rect(l2 - this.scrollX - 3, t2 - this.scrollY - 3, 6, 6);
    this.ctx.fill();
    this.ctx.save();
  }

  /**
   * Used to active TextBox on Double click
   * @param {MouseEvent} e
   * @param {HTMLCanvasElementCanvas} canvas
   */
  double_click(e, canvas) {
    e.preventDefault();
    let [x5, y5, sum] = this.showCoords(this.canvas, e);
    this.cell = this.arr2d[y5][x5 - 1];
    this.textbox_visible(this.cell);
  }

  /**
   * Right Click/Contextmenu to perform operations like cut/copy/paste/sort etc
   * @param {MouseEvent} e
   * @param {HTMLCanvasElementCanvas} canvas
   */
  right_click(e, canvas) {
    e.preventDefault();
    let [x1, y1, sum] = this.showCoords(this.canvas, e);
    this.px1 = x1;
    this.py1 = y1;
    if (this.arr_selected.length > 1) {
      this.cell = this.activeCell;
    } else {
      let [x5, y5, sum] = this.showCoords(this.canvas, e);
      this.activeCell = this.arr2d[y5][x5 - 1];
      this.cell = this.activeCell;
    }
    this.rightclick.style.display = "block";
    this.rightclick.style.zIndex = 1;
    this.rightclick.style.width = "200px";
    this.rightclick.style.position = "absolute";
    if (this.cell.ypos + 270 - this.scrollY < window.innerHeight) {
      this.rightclick.style.top = `${this.cell.ypos + 50 - this.scrollY}px`;
    } else {
      this.rightclick.style.top = `${this.cell.ypos - 180 - this.scrollY}px`;
    }
    if (this.cell.xpos + 350 - this.scrollX < window.innerWidth) {
      this.rightclick.style.left = `${
        this.cell.xpos + this.cell.width + 70 - this.scrollX
      }px`;
    } else {
      this.rightclick.style.left = `${this.cell.xpos - 165 - this.scrollX}px`;
    }
    this.rightclick.style.background = "white";
  }
  /**
   * Delete value inside a cell or set of cells
   * @param {MouseEvent|KeyboardEvent} e
   */
  delete_cell = (e) => {
    this.rightclick.style.display = "none";
    this.arr_selected.forEach((c) => (c.data = ""));
    this.activeCell.data = "";
    this.render();
  };
  /**
   * Cuts  a cell or set of cells
   * @param {MouseEvent|KeyboardEvent} e
   */
  cut_cell = (e) => {
    this.rightclick.style.display = "none";
    this.cut = true;
    this.op_cut = true;
    this.first = false;
    this.render();
    this.arrayConverter();
    let clipboard = this.arr_selected_2d
      .map((r) => r.map((c) => c.data).join(","))
      .join("\n");
    navigator.clipboard.writeText(clipboard);
  };
  /**
   * Copys a cell or set of cells
   * @param {MouseEvent|KeyboardEvent} e
   */
  copy_cell = (e) => {
    this.rightclick.style.display = "none";
    this.cut = true;
    this.first = false;
    this.render();
    this.arrayConverter();
    let clipboard = this.arr_selected_2d
      .map((r) => r.map((c) => c.data).join(","))
      .join("\n");
    navigator.clipboard.writeText(clipboard);
  };
  /**
   * Paste value inside a cell or set of cells
   * @param {MouseEvent|KeyboardEvent} e
   */
  paste_cell = (e) => {
    if (this.first) return;

    this.rightclick.style.display = "none";

    if (this.arr_selected_2d.length > 1) {
      for (let i = 0; i < this.arr_selected_2d.length; i++) {
        for (let j = 0; j < this.arr_selected_2d[0].length; j++) {
          this.arr2d[this.activeCell.rows + i][this.activeCell.cols + j].data =
            this.arr_selected_2d[i][j].data;
          if (this.op_cut) {
            this.arr_selected_2d[i][j].data = "";
            this.first = true;
          }
        }
      }
      this.op_cut = false;
    } else {
      this.arr2d[this.activeCell.rows][this.activeCell.cols].data =
        this.arr_selected_2d[0][0].data;
      if (this.op_cut) {
        this.arr_selected_2d[0][0].data = "";
        this.op_cut = false;
        this.first = true;
      }
    }
    this.render();
  };
  /**
   * Delete value inside a cell or set of cells
   * @param {MouseEvent|KeyboardEvent} e
   */
  graph_cell = (e) => {
    this.rightclick.style.display = "none";
    this.arrayConverter();
    const config = {
      height: 300,
      width: 500,
      x: 100,
      y: 100,
    };

    const a = new Graph(
      this.arr_selected_2d,
      this.canvas_parent,
      config,
      "line"
    );
    a.render();
  };
  /**
   * Delete value inside a cell
   * @param {MouseEvent|KeyboardEvent} e
   */
  sort_cell = (e) => {
    let sort = [];
    for (let i = 0; i < this.arr_selected.length; i++) {
      sort.push(parseInt(this.arr_selected[i].data));
    }
    sort.sort((a, b) => a - b);

    for (let i = 0; i < this.arr_selected.length; i++) {
      if (sort[i] == NaN) continue;
      this.arr_selected[i].data = sort[i];
    }
    this.render();
    // this.arr_selected.sort((a,b) => (0+a.data)-(0+b.data));
    // this.arr_selected=this.arr_selected.map((c,i)=>{ c.data=this.arr_selected[i].data})
    // this.render()
  };

  /**
   * Used to make Textbox Visible ondbkClick Event
   * @param {Cell} cell
   */
  textbox_visible(cell) {
    this.textbox.style.display ="block";
    this.textbox.style.width = `${cell.width}px`;
    this.textbox.style.left = `${cell.xpos + 60 - this.scrollX}px`;
    this.textbox.style.top = `${cell.ypos - this.scrollY}px`;
    this.textbox.style.height = `${cell.height}px`;
    this.textbox.style.boxSizing = "border-box";
    this.textbox.style.zIndex = "1";
    this.textbox.value = cell.data;
    this.textbox.focus();
  }

  /**
   * Used to Update Text Value on blur
   * @param {Event} event
   * @param {HTMLCanvasElementCanvas} canvas
   */
  textset(event, canvas) {
    var t1 = event.target.value;
    this.cell.data = t1;
  }

  /**
   * Used to perform keyword key-actions
   * @param {KeyboardEvent} e
   * @returns
   */
  keyMove(e) {
    if (e.shiftKey) {
      this.xscroll = true;
    } else {
      this.xscroll = false;
    }

    if (e.target == this.textbox) {
      return;
    }

    let { rows, cols } = this.activeCell;

    if (e.key == "ArrowLeft") {
      if (this.arr_width.length > 1 && this.textbox.style.display == "none") {
        this.arr_selected = [];
      }
      if (this.activeCell.xpos - this.activeCell.width < this.scrollX) {
        this.dx = Math.max(0, this.dx - 100);
      }
      this.textbox.style.display = "none";
      if (cols <= 0) {
        this.activeCell = this.arr2d[rows][cols];
      } else {
        this.activeCell = this.arr2d[rows][cols - 1];

        this.activeRow = this.header1dhead[cols - 1];
        cols--;
      }
    } else if (e.key == "ArrowRight") {
      console.log("h");
      if (this.arr_width.length > 1 && this.textbox.style.display == "none") {
        this.arr_selected = [];
        console.log("ello");
      }
      if (this.activeCell.xpos + 200 > this.scrollX + this.canvas.width) {
        this.dx += 100;
      }
      this.textbox.style.display = "none";
      this.activeCell = this.arr2d[rows][cols + 1];
      console.log(this.activeCell);
      this.activeRow = this.header1dhead[cols + 1];
    } else if (e.key == "ArrowUp") {
      if (this.arr_width.length > 1 && this.textbox.style.display == "none") {
        this.arr_selected = [];
      }
      if (this.activeCell.ypos - this.activeCell.height < this.scrollY) {
        this.dy = Math.max(0, this.dy - 90);
      }
      this.textbox.style.display = "none";
      if (rows <= 0) {
        this.activeCell = this.arr2d[rows][cols];
      } else {
        this.activeCell = this.arr2d[rows - 1][cols];
        this.activeCol = this.header1dside[rows - 1];
        rows--;
      }
    } else if (e.key == "ArrowDown") {
      if (this.arr_width.length > 1 && this.textbox.style.display == "none") {
        this.arr_selected = [];
      }
      if (this.activeCell.ypos + 30 > this.scrollY + this.canvas.height) {
        this.dy += 90;
      }
      this.textbox.style.display = "none";
      this.activeCell = this.arr2d[rows + 1][cols];
      this.activeCol = this.header1dside[rows + 1];
    } else if (e.which == 27) {
    } else if (e.key == "Tab") {
      e.preventDefault();
      this.activeCell = this.arr2d[rows][cols + 1];
    } else if (e.key == "Delete") {
      console.log(this.arr_selected);
      this.arr_selected.forEach((c) => (c.data = ""));
      this.activeCell.data = "";
      this.render();
    } else if (e.key == "Backspace") {
      this.activeCell.data = "";
      this.textbox_visible(this.activeCell);
      this.render();
    } else if (e.key == "Enter") {
      this.textbox.style.display = "none";
      this.activeCell = this.arr2d[rows + 1][cols];
    } else if (e.ctrlKey && e.key == "c") {
      this.copy_cell();
    } else if (e.ctrlKey && e.key == "v") {
      this.paste_cell();
      return;
    } else if (e.ctrlKey && e.key == "x") {
      this.cut_cell();
    }

    if (e.key.match(/^\w$/)) {
      this.textbox_visible(this.activeCell);
    }

    this.arr_selected.push(this.activeCell);

    !e.shiftKey && this.render();
  }

  /**
   * Used to identify the selected cell
   * @param {HTMLCanvasElement} canvas
   * @param {MouseEvent} event
   * @returns
   */
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

  /**
   * Used to identify the mousedown event
   * @param {MouseEvent} e
   * @param {HTMLCanvasElement} canvas
   * @returns
   */
  mousedown(e, canvas) {
    this.col_selection = false;
    this.nograbchange = true;
    this.selection_mode = true;
    var mousemove = (e) => {
      if (this.grab_detected) {
        if (this.crosshair_detected) return;
        if (this.selection_mode) return;
        this.canvas.style.cursor = "grabbing";
        let [x1, y1, sum] = this.showCoords(this.canvas, e);
        this.cell_final = this.arr2d[y1][x1 - 1];
        this.render();
        return;
      }
      if (this.crosshair_detected) {
        this.canvas.style.cursor = "crosshair";
        let [x1, y1, sum] = this.showCoords(this.canvas, e);
        let rect = canvas.getBoundingClientRect();
        let x = e.clientX - rect.left + this.scrollX;
        let y = e.clientY - rect.top + this.scrollY;
        if (
          Math.abs(this.activeCell.xpos + this.activeCell.width - x) >
          Math.abs(this.activeCell.ypos + this.activeCell.height - y)
        ) {
          this.cell_final = this.arr2d[this.activeCell.rows][x1 - 1];
        } else this.cell_final = this.arr2d[y1][this.activeCell.cols];

        this.grab_detected = false;
        this.arr_selected.push(this.cell_final);
        this.render();
        return;
      }

      this.grab_detected = false;
      let [x1, y1, sum] = this.showCoords(this.canvas, e);
      this.cell_final = this.arr2d[y1][x1 - 1];
      let r1 = this.cell_initial.rows;
      let r2 = this.cell_final.rows;
      let c1 = this.cell_initial.cols;
      let c2 = this.cell_final.cols;
      this.math_sum = 0;
      this.arr_select_temp = [];
      let ele = 0;
      for (var i = Math.min(r1, r2); i <= Math.max(r1, r2); i++) {
        for (var j = Math.min(c1, c2); j <= Math.max(c1, c2); j++) {
          this.final_cell = this.arr2d[i][j];
          this.arr_select_temp.push(this.final_cell);
          this.math_sum += parseInt(this.final_cell.data) || 0;
          this.arr_selected.push(parseInt(this.final_cell.data) || 0);
        }
      }
      this.arr_diff = this.arr_selected.filter(
        (c) => this.arr_select_temp.indexOf(c) === -1
      );
      this.arr_selected = this.arr_select_temp;

      for (let index = 0; index < this.arr_selected.length; index++) {
        if (this.arr_selected[index].data != "") ele++;
      }
      console.log(this.math_sum);
      console.log(ele);
      this.render();
    };
    var mouseup = (e) => {
      let arr_selected_temp = [];
      let [x1, y1, sum] = this.showCoords(this.canvas, e);
      if (this.grab_detected) {
        this.cell_final = this.arr2d[y1][x1 - 1];
        if (this.arr_selected.length > 1) {
          this.arrayConverter();
          this.canvas.style.cursor = "grab";
          for (let i = 0; i < this.arr_selected_2d.length; i++) {
            for (let j = 0; j < this.arr_selected_2d[0].length; j++) {
              this.arr2d[y1 + i][x1 - 1 + j].data =
                this.arr_selected_2d[i][j].data;
              arr_selected_temp.push(this.arr2d[y1 + i][x1 - 1 + j]);
              this.arr_selected_2d[i][j].data = "";
            }
          }
          this.activeCell = arr_selected_temp[0];
          console.log(arr_selected_temp);
          this.arr_selected = arr_selected_temp;
          this.render();
        } else {
          this.arr2d[y1][x1 - 1].data = this.arr_selected[0].data;
          this.arr_selected[0].data = "";
          this.arr_selected = [this.cell_final];
          this.render();
        }

        this.nograbchange = false;
        canvas.removeEventListener("mousemove", mousemove);
        canvas.removeEventListener("mousedown", this.mousedown);
        canvas.removeEventListener("mouseup", mouseup);
        this.render();
      }
      if (this.crosshair_detected) {
        let minr = Math.min(this.cell_initial.rows, this.cell_final.rows);
        let minc = Math.min(this.cell_initial.cols, this.cell_final.cols);
        let maxr = Math.max(this.cell_initial.rows, this.cell_final.rows);
        let maxc = Math.max(this.cell_initial.cols, this.cell_final.cols);
        console.log(minr, minc, maxr, maxc);
        this.arr_selected = [];
        for (let i = minr; i <= maxr; i++) {
          for (let j = minc; j <= maxc; j++) {
            console.log("hello");
            this.arr2d[i][j].data = this.cell_initial.data;
            this.arr_selected.push(this.arr2d[i][j]);
          }
        }
        this.crosshair_detected = false;
        this.render();
        this.nograbchange = false;
        this.canvas.style.cursor = "cell";
        this.cell = this.activeCell;
        this.activeCell = this.cell_initial;
        canvas.removeEventListener("mousemove", mousemove);
        canvas.removeEventListener("mousedown", this.mousedown);
        canvas.removeEventListener("mouseup", mouseup);
        this.render();
      } else {
        this.nograbchange = false;
        this.canvas.style.cursor = "cell";
        this.cell = this.activeCell;
        this.activeCell = this.cell_initial;
        canvas.removeEventListener("mousemove", mousemove);
        canvas.removeEventListener("mousedown", this.mousedown);
        canvas.removeEventListener("mouseup", mouseup);
        this.render();
      }
      console.log(this.arr_selected);
      this.selection_mode = false;
    };
    var mouseleave = (e) => {
      this.canvas.removeEventListener("mousemove", mousemove);
    };

    if (this.grab_detected) {
      this.canvas.style.cursor = "grabbing";
      canvas.addEventListener("mousemove", mousemove);
      canvas.addEventListener("mouseup", mouseup);
      return;
    } else {
      this.cut = false;
      this.rightclick.style.display = "none";
      this.textbox.style.display = "none";
      let [x1, y1, sum1] = this.showCoords(this.canvas, e);
      if (this.arr_selected.length > 1 && e.button == 2) {
        return;
      }
      this.activeRow = this.header1dhead[x1 - 1];
      this.activeCol = this.header1dside[y1];
      this.activeCell = this.arr2d[y1][x1 - 1];
      this.arr_selected = [this.activeCell];
      this.cell_initial = this.arr2d[y1][x1 - 1];
    }
    canvas.addEventListener("mousemove", mousemove);
    canvas.addEventListener("mouseup", mouseup);
    canvas.addEventListener("mouseleave", mouseleave);
    this.render();
  }

  /**
   * Used for highlighting selected Cell, Row and Column
   */
  highlightCells() {
    let context = this.ctx;
    if (this.arr_selected.length < 1) return;
    let cell_initial = this.arr_selected[0];
    let cell_final = this.arr_selected[this.arr_selected.length - 1];
    context.translate(-this.scrollX, -this.scrollY);
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

    context.save();
    context.beginPath();
    context.moveTo(leftX1, topX1);
    context.lineTo(leftX2, topX1);
    context.lineTo(leftX2, topX2);
    context.lineTo(leftX1, topX2);
    context.lineTo(leftX1, topX1);

    if (this.arr_selected.length > 1) {
      context.fillStyle = "#03723C33";
      context.fill();
    }
    this.htx.save();
    this.htx.beginPath();
    this.htx.moveTo(leftX1 - this.scrollX, 30);
    this.htx.lineTo(leftX2 - this.scrollX, 30);
    this.htx.lineTo(leftX2 - this.scrollX, 0);
    this.htx.lineTo(leftX1 - this.scrollX, 0);
    this.htx.lineTo(leftX1 - this.scrollX, 30);
    this.htx.fillStyle = "#03723C33";

    this.htx.fill();
    this.htx.restore();
    this.htx.save();
    this.htx.beginPath();
    this.htx.strokeStyle = "green";
    this.htx.lineWidth = 4;
    this.htx.moveTo(leftX1 - this.scrollX, 30);
    this.htx.lineTo(leftX2 - this.scrollX, 30);
    this.htx.stroke();
    this.htx.restore();

    this.stx.save();
    this.stx.beginPath();
    this.stx.moveTo(60, topX1 - this.scrollY);
    this.stx.lineTo(60, topX2 - this.scrollY);
    this.stx.lineTo(0, topX2 - this.scrollY);
    this.stx.lineTo(0, topX1 - this.scrollY);
    this.stx.lineTo(60, topX1 - this.scrollY);
    this.stx.fillStyle = "#03723C33";
    this.stx.fill();
    this.stx.restore();
    this.stx.save();
    this.stx.beginPath();
    this.stx.strokeStyle = "green";
    this.stx.lineWidth = 4;
    this.stx.moveTo(60, topX1 - this.scrollY);
    this.stx.lineTo(60, topX2 - this.scrollY);
    this.stx.stroke();
    this.stx.restore();
    context.clearRect(
      this.activeCell.xpos,
      this.activeCell.ypos,
      this.activeCell.width,
      this.activeCell.height
    );
    context.restore();
    this.createCell(this.activeCell, this.ctx);
    context.save();
    context.translate(-this.scrollX, -this.scrollY);
    if (this.cut) {
      context.setLineDash([6, 2]);
      context.lineDashOffset = this.lineDashOffset;
    }
    context.beginPath();
    context.moveTo(leftX1, topX1);
    context.lineTo(leftX2, topX1);
    context.lineTo(leftX2, topX2);
    context.lineTo(leftX1, topX2);
    context.lineTo(leftX1, topX1);
    context.strokeStyle = "#03723C";
    context.lineWidth = 3;
    context.stroke();
    context.setTransform(1, 0, 0, 1, 0, 0);

    if (this.textbox.style.display == "none")
      this.createActiveBottom(leftX2, topX2);

    this.l1 = leftX1;
    this.l2 = leftX2;
    this.t1 = topX1;
    this.t2 = topX2;
  }

  /**
   * Used to Identify Wheel Event for scrolling
   * @param {WheelEvent} event
   */
  scroller(event) {
    this.rightclick.style.display = "none";
    this.textbox.style.display = "none";
    let { deltaX, deltaY } = event;
    if (this.xscroll) {
      this.dx = Math.max(0, this.dx + deltaY);
    } else {
      this.dy = Math.max(0, this.dy + (deltaY < 0 ? -90 : 90));
    }
    this.render();
  }

  /**
   * Used for creation and extention of Data
   * @param {number} count
   */
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
          this.arr_width.push(100);
          rectData["height"] = 30;
          rectData["color"] = "#9A9A9AFF";
          rectData["data"] = "";
          rectData["lineWidth"] = 1;
          rectData["rows"] = i;
          rectData["cols"] = j;
          row.push(rectData);
        }
      });
      this.extendHeader(count);
    } else {
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
        }
        this.arr2d.push(extend1d);
        if (this.col_selection && extend1d[this.col_selected]) {
          this.arr_selected.push(extend1d[this.col_selected]);
          this.render();
        }
        this.extendSidebar(count);
      }
    }
  }

  /**
   * Used for creation and extention of Header
   * @param {number} count
   */
  extendHeader(count) {
    if (this.header1dhead.length < 1) {
      let rectDatahead = {};
      rectDatahead["xpos"] = 0;
      rectDatahead["ypos"] = 0;
      rectDatahead["width"] = this.arr_width[0];
      rectDatahead["height"] = 30;
      rectDatahead["color"] = "#9A9A9AFF";
      rectDatahead["data"] = "A";
      rectDatahead["lineWidth"] = 1;
      this.header1dhead.push(rectDatahead);
    }
    let row = this.header1dhead;
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
      rectData["data"] = this.toLetters(j + 1);
      rectData["lineWidth"] = 1;
      row.push(rectData);
    }
  }

  /**
   * Used for creation and extention of sidebar
   * @param {number} count
   */
  extendSidebar(count) {
    if (this.header1dside.length < 1) {
      let rectDatahead = {};
      rectDatahead["xpos"] = 0;
      rectDatahead["ypos"] = 0;
      rectDatahead["width"] = 100;
      rectDatahead["height"] = 30;
      rectDatahead["color"] = "#9A9A9AFF";
      rectDatahead["data"] = 1;
      rectDatahead["lineWidth"] = 1;
      this.header1dside.push(rectDatahead);
    }
    let row = this.header1dside;
    let prevColumns = row.length;
    for (let j = prevColumns; j < prevColumns + count; j++) {
      let left = 0;
      let top = row[j - 1].ypos + row[j - 1].height;
      let rectData = {};
      rectData["xpos"] = left;
      rectData["ypos"] = top;
      rectData["width"] = 100;
      rectData["height"] = 30;
      rectData["color"] = "#9A9A9AFF";
      rectData["data"] = j + 1;
      rectData["lineWidth"] = 1;
      row.push(rectData);
    }
  }

  /**
   * Binary Search
   * @param {Array} arr
   * @param {number} x
   * @param {boolean} vertical
   * @returns
   */
  binarySearch(arr, x, vertical = false) {
    let low = 0;
    let high = arr.length - 1;
    let mid = 0;
    while (high >= low) {
      mid = low + Math.floor((high - low) / 2);
      if ((vertical ? arr[mid].ypos : arr[mid].xpos) == x) return mid;
      if ((vertical ? arr[mid].ypos : arr[mid].xpos) > x) high = mid - 1;
      else low = mid + 1;
    }
    return mid;
  }

  /**
   * Used to print Alphabets in header
   * @param {number} num
   * @returns {string} Alphabets
   */
  toLetters(num) {
    var mod = num % 26,
      pow = (num / 26) | 0,
      out = mod ? String.fromCharCode(64 + mod) : (--pow, "Z");
    return pow ? this.toLetters(pow) + out : out;
  }

  /**
   * Clear header, sidebar and data as necessary
   */
  clearData() {
    this.htx.clearRect(0, 0, this.header.width, this.header.height);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.stx.clearRect(0, 0, this.sidebar.width, this.sidebar.height);
  }

  /**
   * Optimized drawing as per screen width & height
   */
  drawOptimized() {
    this.extracells = 10;
    if (!this.arr2d.length) {
      return;
    }
    let initialCol = this.binarySearch(this.arr2d[0], this.scrollX);
    let initialRow = this.binarySearch(
      this.arr2d.map((d) => d[0]),
      this.scrollY,
      true
    );
    let finalRow = initialRow;
    let finalCol = 0;

    for (let j = initialRow; j < this.arr2d.length; j++) {
      finalCol = initialCol;
      finalRow++;
      for (let j = initialCol; j < this.arr2d[0].length; j++) {
        finalCol++;
        if (this.arr2d[0][j].xpos > this.canvas.offsetWidth + this.scrollX) {
          break;
        }
      }
      if (this.arr2d[j][0].ypos > this.canvas.offsetHeight + this.scrollY)
        break;
    }
    if (Math.abs(finalRow - this.arr2d.length) < 50) {
      this.extendData(100, 2);
    }
    if (Math.abs(initialCol - this.arr2d[0].length) < 50) {
      this.extendData(100, 1);
    }
    this.clearData();
    for (
      let i = Math.max(initialRow - this.extracells, 0);
      i < Math.min(finalRow + this.extracells, this.arr2d.length);
      i++
    ) {
      this.createCellS(this.header1dside[i], this.stx);
      for (
        let j = Math.max(initialCol - this.extracells, 0);
        j < Math.min(finalCol + this.extracells, this.arr2d[0].length);
        j++
      ) {
        this.createCell(this.arr2d[i][j], this.ctx);
      }
    }
    for (
      let j = Math.max(initialCol - this.extracells, 0);
      j < Math.min(finalCol + this.extracells, this.arr2d[0].length);
      j++
    ) {
      this.createCellH(this.header1dhead[j], this.htx);
    }
  }
}

class Graph {
  /**
   * @typedef{object} Config
   * @property{number} x
   * @property{number} y
   * @property{number} width
   * @property{number} height
   */
  /**
   *
   * @param {Cell[]} arr
   * @param {HTMLDivElement} container
   * @param {Config} config
   * @param {"Line"|"Bar"} type
   */
  constructor(arr, container, config, type) {
    this.arr = arr;
    this.container = container;
    this.config = config;
    this.type = type;
  }

  render() {
    this.creatediv();
    this.graph();
  }

  creatediv() {
    this.graphDiv = document.createElement("div");
    let canvas = document.createElement("canvas");
    this.ctx = canvas.getContext("2d");
    this.container.appendChild(this.graphDiv);
    this.graphDiv.appendChild(canvas);

    this.graphDiv.style.position = "absolute";
    this.graphDiv.style.height = `${this.config.height}px`;
    this.graphDiv.style.width = `${this.config.width}px`;

    this.graphDiv.style.left = `${this.config.x}px`;
    this.graphDiv.style.top = `${this.config.y}px`;

    this.graphDiv.style.zIndex = 1;
    this.graphDiv.style.background = "#FFFFFF";
  }

  parseData(data) {
    if (!data.length) return { labels: [], datasets: [] };

    const labels = data.map((_, i) => i + 1);

    const datasets = [];
    for (let i = 0; i < data[0].length; i++) {
      const dataset = {
        label: data[0][i].data,
        data: [],
        borderWidth: 1,
        backgroundColor: [
          "rgba(255, 205, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(201, 203, 207, 1)",
        ],
      };

      for (let j = 0; j < data.length; j++) {
        if (j === 0) continue;
        const cell = data[j][i];
        dataset.data.push(parseInt(cell.data));
      }
      datasets.push(dataset);
    }
    return { labels, datasets };
  }
  graph() {
    const [a, ...s] = this.arr;
    new Chart(this.ctx, {
      type: this.type.toLowerCase(),
      data: this.parseData(this.arr),
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}
const id=new URL(window.location.href).searchParams.get("id")
fetch("http://localhost:5183/api/Cells/file/"+id).then(async (response) => {
  data = await response.json();
  let excel = new Excel(data, document.querySelector(".container"));
});
