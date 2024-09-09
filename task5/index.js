let list = [];
let x = 0;
let result;
function createFileCard(Name, Size, Id) {
  const file_card = `<div class="index-file-child" style="display: flex">
                <img src="./eximg.PNG" />
                <div onclick="open_file(${Id})" style="padding-left: 20px">
                  <div
                    style="font-size: large; font-weight: bold; margin-bottom: 10px; cursor:pointer"
                  >
                  ${Name}
                  </div>
    
                  <div style="display: flex; font-size: medium">
                    <div style="margin-right: 10px">28 April 2020</div>
                    <div style="margin-right: 10px; font-size: medium">${Size} KB</div>
                    <div>xlsx</div>
                  </div>
                </div>
                <div style="margin-left: auto">
                  <i onclick="delete_file(${Id})" class="fa fa-trash"></i>
                </div>
                <div style="padding-left: 40px"></div>
              </div>`;
  return file_card;
}
function fetchFile() {
  fetch("http://localhost:5183/api/Files").then((response) => {
    response.json().then((data) => {
      list = data;
      $(".index-file-grid").html(
        list.map((file) =>
          createFileCard(file.name, Math.floor(file.size / 1024), file.id)
        )
      );
    });
  });

  $("i.fa.fa-trash").click(function () {
    const id = $(this).attr("data-id");
  });

  $(".file_child").click(function () {
    const id = $(this).attr("data-id");
  });
}
$(function () {
  fetchFile();
});

function delete_file(id) {
  fetch("http://localhost:5183/api/Files/" + id, {
    method: "DELETE",
  }).then((response) => {
    fetchFile();
  });
}

function open_file(id) {
  window.open(window.location.origin + "/task5/excel.html?id=" + id, "_blank");
}

// async function data(ele) {
//   const input = ele.files[0];
//   const reader = new FileReader();
//   reader.onload = function (e) {
//     const text = e.target.result;
//     for (let index = 0; index < 1; index++) {
//       fetch("http://localhost:5183/api/Files", {
//         method: "POST",
//         body: JSON.stringify({
//           id: 0,
//           name: input.name,
//           extension: "csv",
//           progress: 0,
//           size: input.size,
//           data: text,
//         }),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }).then((response) => {
//         response.json().then((data) => {
//           console.log(data);
//           list.push(data);
//           fetchFile();
//           showProgress(data);
//         });
//       });
//     }
//     // document.querySelector(".container").innerHTML=""
//     // let excel = new Excel(text, document.querySelector(".container"));
//   };
//   reader.readAsText(input);
// }

async function data(ele) {
  const input = ele.files[0];
  const reader = new FileReader();
  
  reader.onload = async function (e) {
      const text = e.target.result;

      try {
          const response = await fetch("http://localhost:5183/api/Files", {
              method: "POST",
              body: JSON.stringify({
                  id: 0,
                  name: input.name,
                  extension: "csv",
                  progress: 0,
                  size: input.size,
                  data: text,
              }),
              headers: {
                  "Content-Type": "application/json",
              },
          });

          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          console.log(data);
          
          list.push(data);
          await fetchFile();
          showProgress(data);
          
      } catch (error) {
          console.error('Error uploading file:', error);
          // Optionally: Show an error message to the user
      }
  };

  reader.readAsText(input);
}


// function showProgress(file) {
//   const progressContainer = document.getElementById('progress-container');
//   progressContainer.style.display = 'flex';
//   fetch('http://localhost:5183/api/Files/'+file.Id+"/status").then(r => r.text()).then(x=>{
//     x=parseInt(x)
//     console.log(x)
//     document.querySelector('.progress-bar-inner').style.width=(file.ChunkCount/x)*100+"%";
//     console.log(file.ChunkCount/x)

//     if(file.ChunkCount/(x || 1)<1)
//     showProgress(file)
//     else{
//         document.querySelector('.progress-bar-inner').style.width="0%";
//         document.querySelector('.progress-container').style.display="none";
//     }
//   })
// }

// function showProgress(file) {
//   const progressContainer = document.getElementById('progress-container');
//   const progressBarInner = document.querySelector('.progress-bar-inner');

//   progressContainer.style.display = 'flex';

//   function updateProgress() {
//       // Fetch the progress from the server
//       fetch(`http://localhost:5183/api/Files/${file.Id}/status`)
//           .then(response => response.json())
//           .then(progress => {
//               console.log('Progress:', progress);

//               // Ensure progress is between 0 and 100
//               let progressPercentage = Math.max(0, Math.min(progress, 100));

//               // Update the progress bar width
//               progressBarInner.style.width = `${progressPercentage}%`;

//               // Check if the progress is complete
//               if (progress < 100) {
//                   // Continue polling until progress reaches 100%
//                   setTimeout(updateProgress, 1000); // Poll every 1 second
//               } else {
//                   // Complete progress handling
//                   progressBarInner.style.width = "100%";
//                   setTimeout(() => {
//                       progressContainer.style.display = "none"; // Hide the progress bar
//                   }, 500); // Optional delay before hiding
//               }
//           })
//           .catch(error => {
//               console.error('Error fetching progress:', error);
//               // Optional: Show an error message or retry after a short delay
//               setTimeout(updateProgress, 1000); // Retry after 1 second
//           });
//   }

//   updateProgress();
// }

function showProgress(file) {
  const progressContainer = document.getElementById("progress-container");
  const progressBarInner = document.querySelector(".progress-bar-inner");
  progressContainer.style.display = "flex";

  function updateProgress() {
    fetch(`http://localhost:5183/api/Files/${file.Id}/status`)
      .then((response) => response.text())
      .then((status) => {
        const x = parseInt(status);
        const chunkCount = file.ChunkCount;
        let progressPercentage =chunkCount > 0 && x > 0 ? (x / chunkCount) * 100 : 0;
        progressPercentage = Math.max(0, Math.min(progressPercentage, 100));
        progressBarInner.style.width = `${progressPercentage}%`;
        if (progressPercentage < 100) {
          setTimeout(updateProgress, 1000); 
        } else {
          progressBarInner.style.width = "100%";
          setTimeout(() => {
            progressContainer.style.display = "none";
            progressBarInner.style.width = "0%";
          }, 500);
        }
      })
      .catch((error) => {
        console.error("Error fetching progress:", error);
        setTimeout(updateProgress, 1000);
      });
  }
  updateProgress();
}
