

// $(function () {
 
//   $("#rateYo.id2").rateYo({
//     rating: 3.2,
//     readOnly: true,
//     starWidth: "20px"
//   });
// });

function filterFunction() {
  if (event.key == "Enter") {
    var input, filter, q, api_url;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    if (filter.length > 3) {
      q = filter.replace(" ", "+");
      api_url =
        "https://openlibrary.org/search.json?q=" +
        q +
        "&fields=cover_i,title,author_name&limit=5";
      getapi(api_url);
    } else {
      document.getElementById("contents").style.display = "none";
    }
  }
}

// Defining async function
async function getapi(url) {
  // Storing response
  const response = await fetch(url);
  var data = await response.json();
  if (response) {
    show(data.docs);
  }
}
function show(data) {
  var li, a, i, data, p, span, img;
  text = "";
  div = document.getElementById("myDropdown");
  li = div.getElementsByTagName("li");
  for (var i = 0; i < 5; i++) {
    a = li[i].getElementsByTagName("a")[0];
    p = li[i].getElementsByTagName("p")[0];
    p.textContent = "";
    for (var j = 0; j < data[i].author_name.length; j++) {
      span = document.createElement("span");
      if (j == 0) {
        text = document.createTextNode("by " + data[i].author_name[j]);
      } else {
        text = document.createTextNode(", " + data[i].author_name[j]);
      }
      span.appendChild(text);
      p.appendChild(span);
    }
    img = li[i].getElementsByTagName("img")[0];
    img.src =
      "https://covers.openlibrary.org/b/id/" + data[i].cover_i + "-S.jpg";
    a.innerText = data[i].title;
    a.id = data[i].cover_i;
    li[i].id = data[i].cover_i;
  }
  document.getElementById("contents").style.display = "";
}

function addContainer(ele) {
  document.getElementById("contents").style.display = "none";
  const li = document.getElementById(ele.id);
  var authors = li.getElementsByTagName("p")[0].getElementsByTagName("span")[0];
  // document.getElementById("book_title").setAttribute('value',ele.innerText);
  document.getElementById("book_title").innerText = ele.innerText;

  document
    .getElementById("book_authors")
    .setAttribute("value", authors.innerText);
  // document.getElementById("book_authors").innerHTML = authors;

  document
    .getElementById("book_image")
    .setAttribute(
      "src",
      "https://covers.openlibrary.org/b/id/" + ele.id + "-M.jpg"
    );
  document.getElementById("noteform").style.display = "";

  return true;
}

function createForm(action) {
  const form = document.getElementById("form");
  var rateYo = $("#rateYo").rateYo();
  var rating = rateYo.rateYo("rating");
  const img = document.getElementById("form").getElementsByTagName("img")[0];
  // const submitter = form.getElementById("contactbtn");
  const url = img.getAttribute("src");
  var formData = new FormData(form);
  formData.append("rating", rating);
  formData.append("cover",url);

  const formDataObj = {};
  formData.forEach((value, key) => (formDataObj[key] = value));
  // console.log(formDataObj);

  try {
    fetch("http://localhost:3000/"+action, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      // Set the FormData instance as the request body
      body: JSON.stringify(formDataObj)
    }).then(response=>{
      if(response.redirected){
        window.location.href = response.url;
      }
    });
  } catch (e) {
    console.error(e);
  }
}

function auto_grow(element) {
  element.style.height = "5px";
  element.style.height = (element.scrollHeight) + "px";
}
function editForm(){
  document.getElementById("notes1").disabled = false;
  // document.getElementById("deletebtn").style.display = "none";
  document.getElementById("editbtn").style.display = "none";
  document.getElementById("submitedit").style.display = "";
  document.getElementById("viewbtn").style.display = "";

  $("#rateYo").rateYo("option", "readOnly", false);
  $("#rateYo").rateYo("option", "halfStar", true); 

}