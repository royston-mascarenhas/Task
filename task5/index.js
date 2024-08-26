let list = [];
function createFileCard(Name, Size,Id) {
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
function fetchFile(){
  fetch("http://localhost:5183/api/Files").then((response) => {
    response.json().then((data) => {
      list = data;
      $(".index-file-grid").html(
        list.map((file) => createFileCard(file.name, Math.floor(file.size/1024),file.id))
      );
    });
  });

  $("i.fa.fa-trash").click(function(){
    const id=$(this).attr("data-id")
  })

  $(".file_child").click(function(){
    const id=$(this).attr("data-id")
    
  })
}
$(function () {
  fetchFile()
});

function delete_file(id){
  fetch("http://localhost:5183/api/Files/"+id,{
    method: "DELETE",
  }).then((response) => {
    fetchFile()
  });
}

function open_file(id){
  window.open(
    window.location.origin + "/task5/excel.html?id="+id,"_blank"
  );
}
async function data(ele) {
   const input =ele.files[0]
   const reader = new FileReader();
   reader.onload = function (e) {

     const text = e.target.result;
     for (let index = 0; index < 1; index++){
        fetch("http://localhost:5183/api/Files",{
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
        }).then((response) => {
          response.json().then((data) => {
            console.log(data);
            fetchFile()
          });
        });        
      }
      // document.querySelector(".container").innerHTML=""
      // let excel = new Excel(text, document.querySelector(".container"));
   };
   reader.readAsText(input);

};


