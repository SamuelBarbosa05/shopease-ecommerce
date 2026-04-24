const products = [
  {
    id: 1,
    name: "Headset Gamer",
    category: "tecnologia",
    price: 199.9,
    icon: "🎧",
  },
  {
    id: 2,
    name: "Smartwatch Pro",
    category: "tecnologia",
    price: 299.9,
    icon: "⌚",
  },
  {
    id: 3,
    name: "Camiseta Basic",
    category: "moda",
    price: 79.9,
    icon: "👕",
  },
  {
    id: 4,
    name: "Tênis Urban",
    category: "moda",
    price: 249.9,
    icon: "👟",
  },
  {
    id: 5,
    name: "Luminária LED",
    category: "casa",
    price: 129.9,
    icon: "💡",
  },
  {
    id: 6,
    name: "Cadeira Office",
    category: "casa",
    price: 499.9,
    icon: "🪑",
  },
];

const productsList = document.getElementById("productsList");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const cart = document.getElementById("cart");
const overlay = document.getElementById("overlay");
const openCart = document.getElementById("openCart");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");

let cartData = JSON.parse(localStorage.getItem("shopease_cart")) || [];

function formatCurrency(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function saveCart() {
  localStorage.setItem("shopease_cart", JSON.stringify(cartData));
}

function renderProducts() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedCategory = categoryFilter.value;

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm);
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  productsList.innerHTML = "";

  if (filteredProducts.length === 0) {
    productsList.innerHTML = `<p class="empty">Nenhum produto encontrado.</p>`;
    return;
  }

  filteredProducts.forEach((product) => {
    const card = document.createElement("article");
    card.classList.add("product-card");

    card.innerHTML = `
      <div class="product-image">${product.icon}</div>
      <h3>${product.name}</h3>
      <p class="category">${product.category}</p>
      <p class="price">${formatCurrency(product.price)}</p>
      <button class="add-button" onclick="addToCart(${product.id})">
        Adicionar ao carrinho
      </button>
    `;

    productsList.appendChild(card);
  });
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  const itemInCart = cartData.find((item) => item.id === productId);

  if (itemInCart) {
    itemInCart.quantity += 1;
  } else {
    cartData.push({
      ...product,
      quantity: 1,
    });
  }

  saveCart();
  renderCart();
}

function removeFromCart(productId) {
  cartData = cartData.filter((item) => item.id !== productId);
  saveCart();
  renderCart();
}

function increaseQuantity(productId) {
  const item = cartData.find((item) => item.id === productId);
  item.quantity += 1;

  saveCart();
  renderCart();
}

function decreaseQuantity(productId) {
  const item = cartData.find((item) => item.id === productId);

  if (item.quantity === 1) {
    removeFromCart(productId);
    return;
  }

  item.quantity -= 1;

  saveCart();
  renderCart();
}

function renderCart() {
  cartItems.innerHTML = "";

  if (cartData.length === 0) {
    cartItems.innerHTML = `<p class="empty">Seu carrinho está vazio.</p>`;
  }

  cartData.forEach((item) => {
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");

    cartItem.innerHTML = `
      <h4>${item.icon} ${item.name}</h4>
      <p>${formatCurrency(item.price)}</p>

      <div class="cart-actions">
        <button onclick="decreaseQuantity(${item.id})">-</button>
        <span>${item.quantity}</span>
        <button onclick="increaseQuantity(${item.id})">+</button>
        <button class="remove-button" onclick="removeFromCart(${item.id})">
          Remover
        </button>
      </div>
    `;

    cartItems.appendChild(cartItem);
  });

  const total = cartData.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  const totalItems = cartData.reduce((sum, item) => {
    return sum + item.quantity;
  }, 0);

  cartTotal.textContent = formatCurrency(total);
  cartCount.textContent = totalItems;
}

function openCartMenu() {
  cart.classList.add("active");
  overlay.classList.add("active");
}

function closeCartMenu() {
  cart.classList.remove("active");
  overlay.classList.remove("active");
}

searchInput.addEventListener("input", renderProducts);
categoryFilter.addEventListener("change", renderProducts);
openCart.addEventListener("click", openCartMenu);
closeCart.addEventListener("click", closeCartMenu);
overlay.addEventListener("click", closeCartMenu);

renderProducts();
renderCart();