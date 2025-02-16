const paymentForm = document.getElementById("payment-form");

paymentForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const cardName = document.getElementById("card-name");
  const cardNumber = document.getElementById("card-number");
  const expirationDate = document.getElementById("expiration-date");
  const cvv = document.getElementById("cvv");

  const products = JSON.parse(localStorage.getItem("products")) || [];

  // Validimi i numrit te kartes,dates dhe cvv(duhet ti kete 16 numra pa hapesira);
  const cardNameRegex = /^[a-zA-Z ]+$/;
  if (!cardNameRegex.test(cardName.value)) {
    cardName.style.borderColor = "red";
    alert("Please enter a valid name.");
    return;
  }

  const cardNumberRegex = /^[0-9]{16}$/;
  if (!cardNumberRegex.test(cardNumber.value.replace(/\s+/g, ""))) {
    alert("Please enter a valid 16-digit card number.");
    return;
  }

  const expirationDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  if (!expirationDateRegex.test(expirationDate.value)) {
    alert("Please enter a valid expiration date (MM/YY).");
    return;
  }

  const cvvRegex = /^[0-9]{3}$/;
  if (!cvvRegex.test(cvv.value)) {
    alert("Please enter a valid 3-digit CVV.");
    return;
  }

  if(products.length === 0) {
        alert("There's no products in your carts");
        return;
  }

  const modal = document.getElementById("success-modal");
  modal.style.display = "flex";
  setTimeout(function () {
    modal.style.display = "none";
  }, 3000);
  localStorage.removeItem("products");
  cardName.value = "";
  cardNumber.value = "";
  expirationDate.value = "";
  cvv.value = "";
  renderProducts();
  updateCartBadge();
  updatePrices();
});

const cardNumberInput = document.getElementById("card-number");
cardNumberInput.addEventListener("input", function (event) {
  let input = event.target.value.replace(/\D/g, ""); //i fshin te gjitha karakteret qe nuk jane numra
  input = input.substring(0, 16); //limiton numrat per userin

  const formattedCardNumber = input.match(/.{1,4}/g)?.join(" ") || input;
  event.target.value = formattedCardNumber;
});

const expirationDateInput = document.getElementById("expiration-date");
expirationDateInput.addEventListener("input", function (e) {
  let input = e.target.value.replace(/\D/g, "");
  input = input.substring(0, 4);
  if (input.length >= 3) {
    e.target.value = `${input.substring(0, 2)}/${input.substring(2)}`;
  } else {
    e.target.value = input;
  }
});

function updatePrices() {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  let subTotalCalculated = 0;

  products.forEach((product) => {
    subTotalCalculated += product.price * product.quantity;
  });
  const totalPrice = (subTotalCalculated + 5).toFixed(2);
  document.querySelector(
    ".sub-total"
  ).textContent = `$${subTotalCalculated.toFixed(2)}`;
  document.querySelector(".total-price").textContent = `$${totalPrice}`;
}

function updateCartBadge() {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const totalUniqueItems = products.length;

  document.querySelector(
    ".section-count"
  ).innerHTML = `<p>You have ${totalUniqueItems} items in your cart</p>`;
}

function renderProducts() {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const productsContainer = document.getElementById("shopping-action-wrapper");

  productsContainer.innerHTML = "";

  products.forEach((product, index) => {
    const productsItems = document.createElement("div");
    productsItems.classList.add("shopping-action");

    productsItems.innerHTML = `
          <img
            width="120px"
            class="shopping-image"
            src="${product.image}"
            alt="Italy Pizza"
          />
          <div class="item-title section-text">
            <h2>${product.title}</h2>
            <p>${product.description} </p>
          </div>
          <div class="item-data">
            <div class="item-amount">
              <span>${product.quantity}</span>
              <div class="item-action">
                <i data-index="${index}" class="fa-solid fa-caret-up increase"></i>
                <i data-index="${index}" class="fa-solid fa-caret-down decrease"></i>
              </div>
            </div>
            <p>$${product.price * product.quantity}</p>
           <i data-index="${index}" class="fa-regular fa-trash-can delete-product"></i>
          </div>
        `;
    productsContainer.appendChild(productsItems);
  });
  const deleteButtons = document.querySelectorAll(".delete-product");
  const increaseButtons = document.querySelectorAll(".increase");
  const decreaseButtons = document.querySelectorAll(".decrease");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const itemIndex = e.target.dataset.index;

      const filteredProducts = products.filter(
        (item, index) => index != itemIndex
      );
      localStorage.setItem("products", JSON.stringify(filteredProducts));
      renderProducts();
      updatePrices();
      updateCartBadge();
    });
  });
  increaseButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const index = e.target.dataset.index;
      updateCartQuantity(index, 1);
    });
  });

  decreaseButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const index = e.target.dataset.index;
      updateCartQuantity(index, -1);
    });
  });
}
function updateCartQuantity(index, change) {
  let products = JSON.parse(localStorage.getItem("products")) || [];
  const item = products[index];

  if (item) {
    item.quantity += change;
    if (item.quantity < 1) {
      // cart.splice(index, 1);
      products = products.filter((product) => product.id !== item.id);
    }
  }

  localStorage.setItem("products", JSON.stringify(products));

  renderProducts();
  updatePrices();
  updateCartBadge();
}
renderProducts();
updateCartBadge();
updatePrices();
