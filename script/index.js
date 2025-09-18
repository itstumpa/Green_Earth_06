// Dom 
const categoriesList = document.getElementById('categories');
const treesContainer = document.getElementById('trees');
const categoryTitle = document.getElementById('category-title');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');

let cart = [];

// Loading spinner
function showLoading(container) {
  container.innerHTML = `<span class="loading loading-bars loading-sm"></span>`;
}

// Fetch & render categories
fetch('https://openapi.programming-hero.com/api/categories')
  .then(res => res.json())
  .then(data => {
    const categories = data.categories;
    categoriesList.innerHTML = '';
    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.textContent = cat.category_name;
      btn.className = "block w-full text-center md:text-left cursor-pointer p-2 rounded hover:bg-[#15803D] hover:text-white transition";
      btn.addEventListener('click', () => {
        Array.from(categoriesList.children).forEach(c => c.classList.remove('bg-[#15803D]', 'text-white'));
        btn.classList.add('bg-[#15803D]', 'text-white');
        loadTreesByCategory(cat.category_name);
      });
      categoriesList.appendChild(btn);
    });
  });

// Load all plants
function loadAllPlants() {
  showLoading(treesContainer);
  fetch("https://openapi.programming-hero.com/api/plants")
    .then(res => res.json())
    .then(data => renderTrees(data.plants || []))
    .catch(err => treesContainer.textContent = 'Failed to load trees.');
}

// Load trees by category
function loadTreesByCategory(categoryName) {
  categoryTitle.textContent = `Trees in "${categoryName}"`;
  showLoading(treesContainer);
  fetch("https://openapi.programming-hero.com/api/plants")
    .then(res => res.json())
    .then(data => {
      const filtered = data.plants.filter(p => p.category === categoryName);
      renderTrees(filtered);
    })
    .catch(err => treesContainer.textContent = 'Failed to load trees.');
}

// Render tree cards
cartItems.parentElement.style.backgroundColor = "white";
function renderTrees(trees) {
  treesContainer.innerHTML = '';
  trees.forEach(tree => {
    const div = document.createElement('div');
    div.className = "p-4 rounded shadow hover:shadow-lg transition bg-white h-[440px]";
    div.innerHTML = `
      <img src="${tree.image}" alt="${tree.name}" class="w-full h-40 object-cover rounded mb-3" />
      <h3 class="font-semibold text-[#15803D] mb-2 cursor-pointer">${tree.name}</h3>
      <p class="text-sm text-gray-500 mb-2 line-clamp-3">${tree.description}</p>
      <div class="flex justify-between items-center my-2">
        <span class="bg-[#caffda] p-2 rounded-full text-sm text-[#15803D]">${tree.category}</span>
        <span class="font-bold text-[#1E1E1E]">৳ ${tree.price}</span>
      </div>
      <button class="mt-3 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg">Add to Cart</button>
    `;
    div.querySelector('h3').addEventListener('click', () => showTreeModal(tree));
    div.querySelector('button').addEventListener('click', () => addToCart(tree));
    treesContainer.appendChild(div);
  });
}

// Dynamic alert
  // note active later 

function showAlert(message) {
  const alertDiv = document.createElement('div');
  alertDiv.textContent = message;
  alertDiv.className = "fixed bottom-5 right-7 bg-red-500 text-white p-2 rounded shadow animate-fade-in-out";
  document.body.appendChild(alertDiv);
  setTimeout(() => alertDiv.remove(), 2000);
}


// Show modal
function showTreeModal(tree) {
  const modalContent = document.getElementById("modal-content");
  modalContent.innerHTML = `
    <h3 class="font-bold text-[#1E1E1E] text-xl mb-3">${tree.name}</h3>
    <img src="${tree.image}" alt="${tree.name}" class="w-full h-48 object-cover rounded mb-3" />
    <div class="flex flex-col  my-2">
      <span class="rounded-full text-sm text-[#1E1E1E]"><span class="font-semibold">Category: </span>${tree.category}</span>
      <span class="mt-2 text-[#1E1E1E]"><span class="font-semibold">Price: </span>৳ ${tree.price}</span>
    </div>
    <p class="text-sm mb-2 line-clamp-4"><span class="font-semibold">Description: </span>${tree.description}</p>
    <div class="flex justify-between gap-2 mt-3">
      <button id="modal-add" class="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg">Add to Cart</button>
      <button onclick="document.getElementById('tree-modal').close()" class="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded-lg">Close</button>
    </div>
  `;
  document.getElementById("tree-modal").showModal();

  document.getElementById("modal-add").addEventListener('click', () => addToCart(tree));
}

// Cart functions
function addToCart(tree) {
  const item = cart.find(i => i.id === tree.id);
  item ? item.quantity++ : cart.push({ ...tree, quantity: 1 });
  renderCart();
    // note delete later 
  //  alert(`${tree.name} has been added to the cart!`);
  // note active later 
  showAlert(`${tree.name} has been added to the cart!`);
}

function removeFromCart(treeId) {
  const index = cart.findIndex(i => i.id === treeId);
  if (index > -1) {
    cart[index].quantity > 1 ? cart[index].quantity-- : cart.splice(index, 1);
  }
  renderCart();
   

}

function renderCart() {
  cartItems.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.quantity;
    const div = document.createElement('div');
    div.className = "flex justify-between items-center bg-green-50 p-2 rounded mb-2";
    div.innerHTML = `
      <div>
        <p class="font-semibold">${item.name}</p>
        <p class="text-sm text-gray-600">৳${item.price} × ${item.quantity}</p>
      </div>
      <span class="cursor-pointer text-black text-lg">✖</span>
    `;
    div.querySelector('span').addEventListener('click', () => removeFromCart(item.id));
    cartItems.appendChild(div);
  });
  cartTotal.textContent = total;
}

// Run
document.addEventListener('DOMContentLoaded', loadAllPlants);