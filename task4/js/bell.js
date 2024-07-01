let bell=[
    {
        "alert":"License for Introduction to Algebra has been assigned to your school",
        'date':"15-Sep-2018",
        "time":"07:21 pm"
    },
    {
        "alert":"Lesson 3 Practice Worksheet overdue for Amy Santiago",
        'date':"15-Sep-2018",
        "time":"05:21 pm"
    },
    {
        "alert":"23 new students created",
        'date':"14-Sep-2018",
        "time":"01:21 pm"
    },
    {
        "alert":"15 submissions ready for evaluation",
        'date':"13-Sep-2018",
        "time":"01:15 pm"
    },
    {
        "alert":"License for Basic Concepts in Geometry has been assigned to your...",
        'date':"15-Sep-2018",
        "time":"07:21 pm"
    },
    {
        "alert":"Lesson 3 Practice Worksheet overdue for Sam Diego",
        'date':"15-Sep-2018",
        "time":"07:21 pm"
    },
    {
        "alert":"Lesson 3 Practice Worksheet overdue for Sam Diego",
        'date':"15-Sep-2018",
        "time":"07:21 pm"
    },
    {
        "alert":"Lesson 3 Practice Worksheet overdue for Sam Diego",
        'date':"15-Sep-2018",
        "time":"07:21 pm"
    },
    {
        "alert":"Lesson 3 Practice Worksheet overdue for Sam Diego",
        'date':"15-Sep-2018",
        "time":"07:21 pm"
    },
]


let markup1=``;

for(let i=0;i<bell.length;i++){

  markup1 +=`
  <div class="div-child">
  <i class="fa-solid fa-circle-minus"></i>
        <div style="margin-bottom: 10px;">
        ${bell[i].alert}
        </div>
                
        <div style="text-align: end;">
            <div style="font-size: small;color: #6E6E6E;">
                ${bell[i].date} at  ${bell[i].time}
            </div>
        </div>
                
    </div>
  `
}
document.getElementById("bell").innerHTML=markup1;