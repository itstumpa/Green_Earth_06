fetch('https://openapi.programming-hero.com/api/categories')
    .then(res => res.json())
    .then(data => {
      const categoriesList = document.getElementById('categories');
      const categories = data.categories; // ✅ Correct path

      categories.forEach(cat => {
        const li = document.createElement('li');
        li.textContent = cat.category_name; // show category name
        li.title = cat.small_description;  // optional tooltip
        li.className = "cursor-pointer hover:bg-[#15803D] hover:text-white hover:rounded-sm hover:p-2";
        categoriesList.appendChild(li);
      });
    })
    .catch(err => console.error(err));