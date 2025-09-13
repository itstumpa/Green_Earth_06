// Dom 
const categoriesList = document.getElementById('categories');
const treesContainer = document.getElementById('trees');
const categoryTitle = document.getElementById('category-title');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');

let cart = [];
let activeCategory = null;

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
      btn.className = "block w-full text-left cursor-pointer p-2 rounded hover:bg-[#15803D] hover:text-white transition";

      btn.addEventListener('click', () => {
        activeCategory = cat.id;

        // remove active style from all
        Array.from(categoriesList.children).forEach(c => c.classList.remove('bg-[#15803D]', 'text-white'));
        
        // set active style
        btn.classList.add('bg-[#15803D]', 'text-white');

        loadTreesByCategory(cat.id, cat.category_name);
      });

      categoriesList.appendChild(btn);
    });
  })
  .catch(err => console.error(err));

// Load all plants
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

// Render tree cards
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

    // modal on name click
    div.querySelector('h3').addEventListener('click', () => showTreeModal(tree.id));

    // add to cart
    div.querySelector('button').addEventListener('click', () => addToCart(tree));

    treesContainer.appendChild(div);
  });
}

// Show tree modal
function showTreeModal(treeId) {
  fetch(`https://openapi.programming-hero.com/api/plant/${treeId}`)
    .then(res => res.json())
    .then(data => {
      const tree = data.plants;

      if (!tree) {
        console.error("No tree data found");
        return;
      }

      const modalContent = document.getElementById("modal-content");
      modalContent.innerHTML = `
        <div class="transition">
          <h3 class="font-bold text-[#1E1E1E] text-xl mb-3">${tree.name}</h3>
          <img src="${tree.image}" alt="${tree.name}" class="w-full h-48 object-cover rounded mb-3" />
          <div class="flex flex-col my-2">
            <span class="rounded-full text-sm text-[#1E1E1E]"><span class="font-semibold">Category: </span>${tree.category}</span>
            <span class="mt-2 text-[#1E1E1E]"><span class="font-semibold">Price: </span>৳ ${tree.price}</span>
          </div>
          <p class="text-sm mb-2 line-clamp-4"><span class="font-semibold">Description: </span>${tree.description}</p>
          <div class="modal-action">
            <form method="dialog">
              <button class="btn">Close</button>
            </form>
          </div>
        </div>
      `;

      document.getElementById("tree-modal").showModal();
    })
    .catch(err => console.error(err));
}

// Add to cart
function addToCart(tree) {
  const existingItem = cart.find(item => item.id === tree.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...tree, quantity: 1 });
  }
  renderCart();
}

// Remove from cart
function removeFromCart(treeId) {
  const itemIndex = cart.findIndex(item => item.id === treeId);
  if (itemIndex > -1) {
    if (cart[itemIndex].quantity > 1) {
      cart[itemIndex].quantity -= 1;
    } else {
      cart.splice(itemIndex, 1);
    }
  }
  renderCart();
}

// Render cart
cartItems.parentElement.style.backgroundColor = "white";
function renderCart() {
  cartItems.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    total += parseFloat(item.price * item.quantity);

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

// Run default
document.addEventListener('DOMContentLoaded', loadAllPlants);
