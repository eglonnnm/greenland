async function fetchCategories() {
  try {
    const response = await fetch("https://dummyjson.com/products/categories");
    const categories = await response.json();
    const first13Categories = categories.slice(0, 13);

    renderCategories(first13Categories);
  } catch (error) {
    console.error("Error fetching Categories:", error);
  }
}

async function fetchProductsByCategory(selectedCategory) {
  try {
    const response = await fetch(
      `https://dummyjson.com/products/category/${selectedCategory}?limit=9`
    );
    const productsByCategory = await response.json();

    renderProducts(productsByCategory.products);
  } catch (error) {
    console.error("Error fetching productsByCategory:", error);
  }
}

function renderCategories(categories) {
  const categoriesContainer = document.querySelector(".categories");

  categoriesContainer.innerHTML = `<li class="active" onclick="fetchProducts()">
              <a class="menu-category">All</a>
            </li>`;

  categories.forEach((category) => {
    const categoryElement = document.createElement("li");

    categoryElement.addEventListener("click", () => {
      document
        .querySelectorAll(".categories li")
        .forEach((el) => el.classList.remove("active"));
      categoryElement.classList.add("active");
      fetchProductsByCategory(category.slug);
    });
    categoryElement.innerHTML = `
        <a class="menu-category">${category.name}</a>
    `;
    categoriesContainer.appendChild(categoryElement);
  });
}

async function fetchProducts() {
  try {
    const response = await fetch("https://dummyjson.com/products?limit=9");
    const productData = await response.json();

    document.querySelectorAll(".categories li").forEach((el, index) => {
      el.classList.remove("active");
      if (index === 0) {
        el.className = "active";
      }
    });

    renderProducts(productData.products);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

function renderProducts(products) {
  const productsContainer = document.querySelector(".products");

  productsContainer.innerHTML = "";

  products.forEach((product) => {
    const productsItems = document.createElement("div");
    productsItems.classList.add("item-wrapped");

    productsItems.innerHTML = `
            <div class="item">
              <img
                src="${product.images}"
                alt="${product.id}"
                width="250px"
                height="300px"
                class="product-image"
              />
              <div class="item-details">
                <h1 class="product-title">${product.title}</h1>
                <p class="product-descprition">
                  ${product.description}.
                </p>
                <div class="product-actions">
                  <p class="product-price"><strong>$${product.price}</strong></p>
                  <button class="product-button">Add to Cart</button>
                  <i class="fa-solid fa-heart heart-icon"></i>
                </div>
              </div>
            </div>
          `;

    productsContainer.appendChild(productsItems);
    const addToCartButton = productsItems.querySelector(".product-button");
    addToCartButton.addEventListener("click", () => addToCart(product));
  });
}

function addToCart(selectedProduct) {
  let products = JSON.parse(localStorage.getItem("products")) || [];

  const existingItemIndex = products.findIndex(
    (item) => item.id === selectedProduct.id
  );

  if (existingItemIndex !== -1) {
    products[existingItemIndex].quantity += 1;
  } else {
    products.push({
      id: selectedProduct.id,
      price: selectedProduct.price,
      image: selectedProduct.images[0],
      description: selectedProduct.description,
      title: selectedProduct.title,
      quantity: 1,
    });
  }
  localStorage.setItem("products", JSON.stringify(products));

  updateCartBadge();
}

//*payment*//

function updateCartBadge() {
  let products = JSON.parse(localStorage.getItem("products")) || [];
  let totalUniqueItems = products.length;

  document.getElementById("cart-badge").textContent = totalUniqueItems;
}

fetchCategories();
fetchProducts();
renderCategories();
renderProducts();
