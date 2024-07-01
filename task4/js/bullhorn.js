let bullhorn=[
    {
        "PA": "Wilson Kumar",
        "notice":"No classes will be held on 21st Nov",
        "time":"07:21 pm",
        "date":"15-Sep-2018",
        // "course":none,
        "attach":"2 files are attached",
    },

    {
        "PA": "Samson White",
        "notice":"No classes will be held on 21st Nov",
        "time":"07:21 pm",
        "date":"15-Sep-2018",
        // "course":none,
        "attach":"2 files are attached",
    },

    {
        "PA": "Wilson Kumar",
        "notice":"No classes will be held on 21st Nov",
        "time":"07:21 pm",
        "date":"15-Sep-2018",
        // "course":none,
        "attach":"2 files are attached",
    },

    {
        "PA": "Wilson Kumar",
        "notice":"No classes will be held on 21st Nov",
        "time":"07:21 pm",
        "date":"15-Sep-2018",
        // "course":none,
        "attach":"2 files are attached",
    },

    {
        "PA": "Wilson Kumar",
        "notice":"No classes will be held on 21st Nov",
        "time":"07:21 pm",
        "date":"15-Sep-2018",
        // "course":none,
        "attach":"2 files are attached",
    },

    {
        "PA": "Wilson Kumar",
        "notice":"No classes will be held on 21st Nov",
        "time":"07:21 pm",
        "date":"15-Sep-2018",
        // "course":none,
        "attach":"2 files are attached",
    },
]

let markup2=``;

for(let i=0;i<bullhorn.length;i++){

  markup2 +=`
    <div class="div-child">
        <div style="display: flex;">
            <div style="margin-bottom: 10px;font-size: small;">
                    <span style="color: #6E6E6E;">PA:</span><span style="color: black" >${bullhorn[i].PA}</span>
            </div>
        </div>
                
        <div style="margin-bottom: 10px;">
            ${bullhorn[i].notice}
        </div>
                            
        <div style="display: flex; justify-content: space-between;font-size: 12px;color: #6E6E6E;">
            <div>
                ${bullhorn[i].attach}
            </div>

            <div style="font-size: small;color: #6E6E6E;">
                ${bullhorn[i].date}at ${bullhorn[i].time}
            </div>
        </div>
                
    </div>
  `}

  document.getElementById("bullhorn").innerHTML=markup2;


