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
        "claases":[
            {
                "name":"Mr Frank's Class B",
                "students":50,
                "date":{
                    "from":"21-Jan-2020",
                    "to":"21-Aug-2020",
                },
                "select":true
            },
            {
                "name":"Mr Frank's Class A",
                "students":50,
                "date":{
                    "from":"21-Jan-2020",
                    "to":"21-Aug-2020",
                },
                "select":false
            }
        ],
        "expired":false,
        "star":true
    },
    {
        "name":"Displacement, Velocity and Speed",
        "image":"../quantum_screen_assets/images/imageMask-1.png",
        "subject":"Physics 2",
        "grade":{
            "year":6,
            "addition":3
        },
        "unit":2,
        "lesson":15,
        "topics":20,
        "claases":[],
        "expired":false,
        "star":true
    },
    {
        "name":"Introduction to biology: Micro organism and how they affect...",
        "image":"../quantum_screen_assets/images/imageMask-3.png",
        "subject":"Biology",
        "grade":{
            "year":4,
            "addition":1
        },
        "unit":4,
        "lesson":18,
        "topics":24,
        "claases":[
            {
                "name":"Mr Frank's Class B",
                "students":50,
                "date":{
                    "from":"21-Jan-2020",
                    "to":"21-Aug-2020",
                },
                "select":false
            },
            {
                "name":"Mr Frank's Class A",
                "students":50,
                "date":{
                    "from":"21-Jan-2020",
                    "to":"21-Aug-2020",
                },
                "select":false
            }
        ],
        "expired":false,
        "star":true
    },
    {
        "name":"Introduction to High School Mathematics",
        "image":"../quantum_screen_assets/images/imageMask-2.png",
        "subject":"Physics",
        "grade":{
            "year":7,
            "addition":2
        },
        "unit":4,
        "lesson":18,
        "topics":24,
        "claases":[
            {
                "name":"Mr Frank's Class B",
                "students":50,
                "date":{
                    "from":"21-Jan-2020",
                    "to":"21-Aug-2020",
                },
                "select":true
            },
            {
                "name":"Mr Frank's Class A",
                "students":50,
                "date":{
                    "from":"14-Oct-2019",
                    "to":"20-Oct-2020",
                },
                "select":true
            }
        ],
        "expired":true,
        "star":false
    }
]
let markup=`
          <div class="course-card">
            <div class="course-card-top">
              <img  class="course-img" src="../quantum_screen_assets/images/imageMask.png" />
    
              <div class="course-info">
  
                <div style="margin-bottom: 7px;display: flex; justify-content: space-between;align-items: center;">
                  
                  <div class="course-name"><h4 style="padding: 0; margin: 0;">Acceleration</h4></div>
                  <i class="fa-solid fa-star fa-lg" style="color: gold;align-self: flex-start;padding: 8px;"></i>
  
                </div>
    
                <div class="grade" style="margin-bottom: 7px; display: flex;height: 15px;">
                  <div style="border-right: 1px solid grey; padding-right: 9px;font-size: small;">
                    Physics
                  </div>
    
                  <div style="padding-left: 9px;font-size: small;">Grade 7<span style="color: #1F7A54;">+2</span></div>
                </div>
    
                <div style="margin-bottom: 20px;font-size:small; height: 15px;">
                  <span> <b >4</b> unit </span>
    
                  <span> <b>18</b> lesson </span>
    
                  <span> <b>24</b> topics </span>
                </div>
    
                <div style="margin-bottom: 10px">
                  <select name="MrFrank" id="MrFrank" style="font-family: myfontTitle; font-weight:700 ;">
                    <option value="MrFrank">Mr Frank's Class B</option>
                  </select>
                </div>
    
                <div style="margin-bottom: 10px; height: 15px;">
                  <span style="border-right: 1px solid grey; font-size:small;">
                    50 Students
                  </span>
    
                  <span style="padding-left: 20px;font-size:small;"> 21-Jan-2020  -</span>
    
                  <span style="font-size:small;"> 21-Aug-2020 </span>
                </div>
              </div>
            </div>
    
            <div class="course-card-bottom">
              <i class="fa fa-lg fa-eye" style="color: green"></i>
              <i class="fa fa-lg fa-calendar" style="color: green"></i>
              <i class="fa fa-lg fa-calendar" style="color: green"></i>
              <i class="fa fa-lg fa-chart-simple" style="color: green"></i>
            </div>
          </div>`;