let cards=[
    {
        "name":"Acceleration",
        "image":"../quantum_screen_assets/images/imageMask.png",
        "subject":"Physics",
        "grade":{
            "year":7,
            "addition":2
        },
        "unit":4,
        "lesson":18,
        "topics":24,
        "border":"border-right: 1px solid grey",
        "class":{

                "name":"Mr Frank's Class B",
                "students":"50 Students",
                "date":{
                    "from":"21-Jan-2020",
                    "to":"21-Aug-2020",
                },
                "select":true
        },
        "expired":false,
        "star":"gold"
    },
    {
        "name":"Displacement, Velocity and Speed",
        "image":"../quantum_screen_assets/images/imageMask-1.png",
        "subject":"Physics 2",
        "grade":{
            "year":6,
            "addition":3
        },
        "border":"none",
        "unit":2,
        "lesson":15,
        "topics":20,
        "class":{

          "name":"No Class",
          "students":" ",
          "date":{
              "from":"",
              "to":"",
          },
          "select":true
  },
        "expired":false,
        "star":"gold"
    },
    {
        "name":"Introduction to biology: Micro organism and how they affect...",
        "image":"../quantum_screen_assets/images/imageMask-3.png",
        "subject":"Biology",
        "grade":{
            "year":4,
            "addition":1
        },
        "border":"none",
        "unit":4,
        "lesson":18,
        "topics":24,
        "class":{

          "name":"All Classes",
          "students":"300 Students",
          "date":{
              "from":"",
              "to":"",
          },
          "select":true
         },
           
      
        "expired":false,
        "star":"gold"
    },
    {
        "name":"Introduction to High School Mathematics",
        "image":"../quantum_screen_assets/images/imageMask-2.png",
        "subject":"Physics",
        "grade":{
            "year":7,
            "addition":2
        },
        "border":"border-right: 1px solid grey",
        "unit":4,
        "lesson":18,
        "topics":24,
        "class":{

          "name":"Mr. Frank's Class A",
          "students":"44 Students",
          "date":{
              "from":"14-Oct-2019",
              "to":"- 20-Oct-2020",
          },
          "select":true
      },
        "expired":true,
        "star":"#EEEEEE"
    }
]

let markup="";

for(let i=0;i<4;i++){

  markup +=`
          <div class="course-card">
          ${cards[i].expired ?`<div class="expired">Expired</div>` :``}
          
            <div class="course-card-top">
              <img  class="course-img" src="${cards[i].image}" />
    
              <div class="course-info">
  
                <div style="margin-bottom: 7px;display: flex; justify-content: space-between;align-items: center;">
                  
                  <div class="course-name"><h4 style="padding: 0; margin: 0;">${cards[i].name}</h4></div>
                  <i class="fa-solid fa-star fa-lg" style="color: ${cards[i].star};align-self: flex-start;padding: 8px;"></i>
  
                </div>
    
                <div class="grade" style="margin-bottom: 7px; display: flex;height: 15px;">
                  <div style="border-right: 1px solid grey; padding-right: 9px;font-size: small;">
                  ${cards[i].subject}
                  </div>
    
                  <div style="padding-left: 9px;font-size: small;">Grade ${cards[i].grade.year}<span style="color: #1F7A54;">+ ${cards[i].grade.addition}</span></div>
                </div>
    
                <div style="margin-bottom: 20px;font-size:small; height: 15px;">
                  <span> <b>${cards[i].unit}</b> unit </span>
    
                  <span> <b>${cards[i].lesson}</b> lesson </span>
    
                  <span> <b>${cards[i].topics}</b> topics </span>
                </div>

                <div style="margin-bottom: 10px">
                  <select name="MrFrank" id="MrFrank" style="font-family: myfontTitle; font-weight:700 ;">
                    <option value="MrFrank">${cards[i].class.name}</option>
                  </select>
                </div>
    
                <div style="margin-bottom: 10px; height: 15px;">
                  <span style=" ${cards[i].border}; font-size:small;">
                    ${cards[i].class.students} 
                  </span>
    
                  <span style="padding-left: 20px;font-size:small;">${cards[i].class.date.from}</span>
    
                  <span style="font-size:small;">${cards[i].class.date.to}</span>
                </div>
              </div>
            </div>

            <div class="course-card-bottom">
              <i class="fa fa-lg fa-eye" style="color: green"></i>
              <i class="fa fa-lg fa-calendar" style="color: green"></i>
              <i class="fa fa-lg fa-calendar" style="color: green"></i>
              <i class="fa fa-lg fa-chart-simple" style="color: green"></i>
            </div>

          </div>
       `;
       
      
}

document.getElementById("course-content").innerHTML=markup;
