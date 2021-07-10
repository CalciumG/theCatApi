var url =
  "https://api.thecatapi.com/v1/images/search?limit=3&size=small&category_ids=4";
const categoryUrl = "https://api.thecatapi.com/v1/categories";
const categories = document.getElementById("select");
const loadMoreButton = document.getElementById("load-more-btn");
const list = document.getElementById("list");
const modal = document.getElementById("image-modal");
const modalImg = document.getElementById("modal-image");
const close = document.getElementsByClassName("close-btn")[0];

// Error handling - if there is no statusText then show a generic message
function handleErrors(response) {
  var errorMessage =
    response.statusText == ""
      ? "There has been a problem with thecatapi."
      : response.statusText;
  var newLine = "\r\n";

  if (!response.ok) {
    alert(`Error code - ${response.status}: ${newLine}${errorMessage}`);
    throw Error(response.status, response.statusText);
  }
  return response;
}

// get categories from thecatapi
function getCategories(categoryUrl, callback) {
  fetch(categoryUrl)
    .then(handleErrors)
    .then((response) => response.json())
    .then((result) => callback(result));
}
getCategories(categoryUrl, (categories) => listCategories(categories));

// populate the category dropdown and set default value to sunglasses
function listCategories(categories) {
  categories.forEach((category) => {
    opt = document.createElement("option");
    opt.id = category.id;
    opt.value = category.id;
    opt.innerHTML = category.name;
    select.appendChild(opt);
    select.selectedIndex = 5;
  });
}

// update the url based on the selected category
function handleCategoryChange() {
  var categorySelected = categories.options[categories.selectedIndex].value;
  url = url.substring(0, url.lastIndexOf("=") + 1) + categorySelected;

  // clear the existing items and load a base list with 3 items
  clearList();
  getCats(url, (cats) => createListItems(cats));
}

function clearList() {
  list.innerHTML = "";
}

function getCats(url, callback) {
  fetch(url)
    .then(handleErrors)
    .then((response) => response.json())
    .then((result) => callback(result));
}
getCats(url, (cats) => createListItems(cats));

// create the list of cat pictures
function createListItems(cats) {
  cats.forEach((cat, index) => {
    // file names can't have '/' in them, so we can get the fileName like this
    // create an unique id for each item - note this isn't guarenteed to be unique
    // so if this wasn't a small test project it would should be guarenteed
    let fileName = cat.url.substring(cat.url.lastIndexOf("/") + 1);
    var imageId = index + Math.random().toString(16).slice(2);

    var catListItem = document.createElement("div");
    catListItem.id = `cat-list-item-${imageId}`;
    catListItem.className = "list-item";
    catListItem.innerHTML = `<img id="${imageId}" src="${cat.url}" alt="A Cat" class="list-image" />
    <h3 id="fileName" class="content">${fileName}</h3>`;
    list.append(catListItem);

    showModal(imageId, cat);
  });
}

loadMoreButton.onclick = function () {
  getCats(url, (cats) => createListItems(cats));
};

// Get the image and insert it inside the modal
function showModal(imageId, cat) {
  var img = document.getElementById(imageId);

  img.onclick = function () {
    modal.style.display = "block";
    modalImg.src = cat.url;
  };

  close.onclick = function () {
    modal.style.display = "none";
  };
}
