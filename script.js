// Hamburger toggle
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

if (hamburger && navMenu) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });
}

// Simple slider
const track = document.querySelector(".slider-track");
const slides = track ? Array.from(track.children) : [];
const prevBtn = document.querySelector(".slider-btn.prev");
const nextBtn = document.querySelector(".slider-btn.next");

let currentIndex = 0;

function updateSlider() {
  if (!track || slides.length === 0) return;
  const width = slides[0].getBoundingClientRect().width;
  track.style.transform = `translateX(-${currentIndex * width}px)`;
}

window.addEventListener("resize", updateSlider);

if (nextBtn && prevBtn && slides.length > 0) {
  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlider();
  });

  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlider();
  });

  // initial position
  updateSlider();
}

// ----- SHOPPING CART -----

const cartItemsContainer = document.querySelector(".cart-items");
const cartTotalEl = document.getElementById("cart-total");
const clearCartBtn = document.getElementById("clear-cart");
const addToCartCards = document.querySelectorAll(".add-to-cart");

let cart = []; 


addToCartCards.forEach(card => {
  card.addEventListener("click", () => {
    const name = card.dataset.name;
    const price = parseFloat(card.dataset.price);

    const existing = cart.find(item => item.name === name);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ name, price, qty: 1 });
    }

    renderCart();
  });
});

function renderCart() {

  cartItemsContainer.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {
    const row = document.createElement("div");
    row.classList.add("cart-item-row");

    const subtotal = item.price * item.qty;
    total += subtotal;

    row.innerHTML = `
      <div class="cart-item-name">${item.name}</div>
      <div class="cart-item-qty">
        <button class="qty-decrease" data-index="${index}">-</button>
        <span>${item.qty}</span>
        <button class="qty-increase" data-index="${index}">+</button>
      </div>
      <div class="cart-item-subtotal">$${subtotal.toFixed(2)}</div>
      <button class="cart-remove" data-index="${index}">Remove</button>
    `;

    cartItemsContainer.appendChild(row);
  });

  cartTotalEl.textContent = `$${total.toFixed(2)}`;

  attachCartRowListeners();
}

function attachCartRowListeners() {
  const incButtons = document.querySelectorAll(".qty-increase");
  const decButtons = document.querySelectorAll(".qty-decrease");
  const removeButtons = document.querySelectorAll(".cart-remove");

  incButtons.forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation(); 
      const index = parseInt(btn.dataset.index, 10);
      cart[index].qty += 1;
      renderCart();
    });
  });

  decButtons.forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const index = parseInt(btn.dataset.index, 10);
      cart[index].qty -= 1;
      if (cart[index].qty <= 0) {
        cart.splice(index, 1);
      }
      renderCart();
    });
  });

  removeButtons.forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const index = parseInt(btn.dataset.index, 10);
      cart.splice(index, 1);
      renderCart();
    });
  });
}

// Clear cart
if (clearCartBtn) {
  clearCartBtn.addEventListener("click", () => {
    cart = [];
    renderCart();
  });
}
