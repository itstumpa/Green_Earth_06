const categoriesList = document.getElementById('categories');
const treesContainer = document.getElementById('trees');
const categoryTitle = document.getElementById('category-title');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');

let cart = [];
let activeCategory = null;

// Loading spinner
function showLoading(container) {
  container.innerHTML = `
<span class="loading loading-bars loading-sm"></span>`;
}

// Render categories with active state
fetch('https://openapi.programming-hero.com/api/categories')
  .then(res => res.json())
  .then(data => {
    const categories = data.categories;
    categoriesList.innerHTML = '';
    categories.forEach(cat => {
      const li = document.createElement('li');
      li.textContent = cat.category_name;
      li.className = "cursor-pointer p-2 rounded hover:bg-[#15803D] hover:text-white transition";
      li.addEventListener('click', () => {
        activeCategory = cat.id;
        Array.from(categoriesList.children).forEach(c => c.classList.remove('bg-[#15803D]', 'text-white'));
        li.classList.add('bg-[#15803D]', 'text-white');
        loadTreesByCategory(cat.id, cat.category_name);
      });
      categoriesList.appendChild(li);
    });
  })
  .catch(err => console.error(err));

// Load all plants by default
function loadAllPlants() {
  showLoading(treesContainer);
  fetch("https://openapi.programming-hero.com/api/plants")
    .then(res => res.json())
    .then(data => renderTrees(data.plants || []))
    .catch(err => {
      treesContainer.textContent = 'Failed to load trees.';
      console.error(err);
    });
}

// Load trees by category
function loadTreesByCategory(categoryId, categoryName) {
  categoryTitle.textContent = `Trees in "${categoryName}"`;
  showLoading(treesContainer);
  fetch(`https://openapi.programming-hero.com/api/category/${categoryId}`)
    .then(res => res.json())
    .then(data => renderTrees(data.data || []))
    .catch(err => {
      treesContainer.textContent = 'Failed to load trees.';
      console.error(err);
    });
}

// Render trees
function renderTrees(trees) {
  treesContainer.innerHTML = '';
  trees.forEach(tree => {
    const div = document.createElement('div');
    div.className = " p-4 rounded shadow hover:shadow-lg transition bg-white h-[440px]";
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

    // Open modal on name click
    div.querySelector('h3').addEventListener('click', () => showTreeModal(tree.id));

    // Add to cart
    div.querySelector('button').addEventListener('click', () => addToCart(tree));

    treesContainer.appendChild(div);
  });
}

// Show modal
function showTreeModal(treeId) {
  fetch(`https://openapi.programming-hero.com/api/plant/${treeId}`)
    .then(res => res.json())
    .then(data => {
      const tree = data.plant;
      const modalContent = document.getElementById("modal-content");
      modalContent.innerHTML = `
        <div class="bg-white p-4 rounded shadow hover:shadow-lg transition">
          <img src="${tree.image}" alt="${tree.name}" class="w-full h-48 object-cover rounded mb-3" />
          <h3 class="font-semibold text-[#15803D] text-xl mb-2">${tree.name}</h3>
          <p class="text-sm text-gray-500 mb-2 line-clamp-5">${tree.description}</p>
          <div class="flex justify-between items-center my-2">
            <span class="bg-[#caffda] p-2 rounded-full text-sm text-[#15803D]">${tree.category}</span>
            <span class="font-bold text-[#1E1E1E]">৳ ${tree.price}</span>
          </div>
          <button class="mt-3 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg">Add to Cart</button>
        </div>
      `;
      document.getElementById("tree-modal").checked = true;
    })
    .catch(err => console.error(err));
}

// Cart functions

// Cart array
let totalCart = [];

// Add item to cart
function addToCart(tree) {
  const existingItem = cart.find(item => item.id === tree.id);
  if (existingItem) {
    existingItem.quantity += 1;  // increase quantity
  } else {
    cart.push({ ...tree, quantity: 1 }); // add new item
  }
  renderCart();
}

// Remove item from cart (decrease quantity or remove fully)
function removeFromCart(treeId) {
  const itemIndex = cart.findIndex(item => item.id === treeId);
  if (itemIndex > -1) {
    if (cart[itemIndex].quantity > 1) {
      cart[itemIndex].quantity -= 1; // decrease quantity
    } else {
      cart.splice(itemIndex, 1); // remove completely
    }
  }
  renderCart();
}

// render cart 
cartItems.parentElement.style.backgroundColor = "white";
function renderCart() {
  cartItems.innerHTML = '';
  let total = 0;
  
  
  
  cart.forEach(item => {
    total += parseFloat(item.price * item.quantity);

    const li = document.createElement('li');
    li.className = "flex justify-between items-center bg-green-50 p-2 rounded mb-2";

    li.innerHTML = `
      <div>
        <p class="font-semibold">${item.name}</p>
        <p class="text-sm text-gray-600">৳${item.price} × ${item.quantity}</p>
      </div>
      <span class="cursor-pointer text-black text-lg">✖</span>
    `;
    li.querySelector('span').addEventListener('click', () => removeFromCart(item.id));
    cartItems.appendChild(li);
  });
  cartTotal.textContent = total;
}

// Run default
document.addEventListener('DOMContentLoaded', loadAllPlants);