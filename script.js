//Getting all the variables for the input and the ul element
const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearAll = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

//Functions
function displayItems() {
  const itemFromStorage = getItemFromStorage();

  itemFromStorage.forEach((item) => addItemToDom(item));

  checkUI();
}

function onAddItemSubmit(e) {
  e.preventDefault();

  const newItem = itemInput.value;

  if (newItem === '') {
    alert('Please add an item');
    return;
  }

  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');

    removeItemFromStorage(itemToEdit.textContent);

    itemToEdit.classList.remove('.edit-mode');

    itemToEdit.remove();

    isEditMode = false;
  } else {
    if (ifItemExist(newItem)) {
      alert('Item already exist');
      return;
    }
  }

  addItemToDom(newItem);

  addItemToStorage(newItem);

  checkUI();

  itemInput.value = '';
}

//Function to create new elements and to add to DOM
function addItemToDom(item) {
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));

  const button = createBtn('remove-item btn-link text-red');
  const icon = createIcon('fa-solid fa-xmark');

  //Adding input item into the DOM
  button.appendChild(icon);
  li.appendChild(button);
  itemList.appendChild(li);
}

function createBtn(classes) {
  const button = document.createElement('button');
  button.className = classes;

  return button;
}

function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;

  return icon;
}

//Adding items to local storage
function addItemToStorage(item) {
  const itemFromStorage = getItemFromStorage();

  //adding the items to the array
  itemFromStorage.push(item);
  //Covert JSON object to string and setting it into the local storage
  localStorage.setItem('items', JSON.stringify(itemFromStorage));
}

//Displaying item from local storage
function getItemFromStorage() {
  let itemFromStorage;

  if (localStorage.getItem('items') === null) {
    itemFromStorage = [];
  } else {
    //Converting the item into a JSON object
    itemFromStorage = JSON.parse(localStorage.getItem('items'));
  }

  return itemFromStorage;
}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
}

//Prevent Duplicate
function ifItemExist(item) {
  const itemFromStorage = getItemFromStorage();

  return itemFromStorage.includes(item);
}

//Editing/Updating Item
function setItemToEdit(item) {
  isEditMode = true;

  itemList
    .querySelectorAll('li')
    .forEach((i) => i.classList.remove('edit-mode'));

  item.classList.add('edit-mode');

  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
  formBtn.style.backgroundColor = '#74e174';

  itemInput.value = item.textContent.trim();
}

//Removing of item
function removeItem(item) {
  if (confirm('Are you sure')) {
    item.remove();

    removeItemFromStorage(item.textContent);

    checkUI();
  }
}

function removeItemFromStorage(item) {
  let itemFromStorage = getItemFromStorage();

  itemFromStorage = itemFromStorage.filter((i) => i !== item);

  localStorage.setItem('items', JSON.stringify(itemFromStorage));
}

//Clearing all item
function clearItem() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }

  localStorage.removeItem('items');

  checkUI();
}

//Filtering item
function filterItem(e) {
  const items = itemList.querySelectorAll('li');
  const text = e.target.value.toLowerCase();

  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();

    if (itemName.indexOf(text) != -1) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

//Clearing IU if there's no item saved
function checkUI() {
  itemInput.value = '';

  const items = itemList.querySelectorAll('li');

  if (items.length === 0) {
    clearAll.style.display = 'none';
    itemFilter.style.display = 'none';
  } else {
    clearAll.style.display = 'block';
    itemFilter.style.display = 'block';
  }

  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = '#bbb8b8';

  isEditMode = false;
}

//Event Listeners
function init() {
  itemForm.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', onClickItem);
  clearAll.addEventListener('click', clearItem);
  itemFilter.addEventListener('input', filterItem);
  document.addEventListener('DOMContentLoaded', displayItems);

  checkUI();
}

init();
