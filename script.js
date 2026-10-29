// PageTurner Online Bookstore — sample product data
const books = [
  { id: 1, title: "The Midnight Library", author: "Matt Haig", category: "Fiction", price: 399, cover: "c1", label: "THE MIDNIGHT<br>LIBRARY" },
  { id: 2, title: "Atomic Habits", author: "James Clear", category: "Personal Growth", price: 499, cover: "c2", label: "ATOMIC<br>HABITS" },
  { id: 3, title: "The Silent Patient", author: "Alex Michaelides", category: "Mystery", price: 349, cover: "c3", label: "THE SILENT<br>PATIENT" },
  { id: 4, title: "A Court of Thorns", author: "Sarah J. Maas", category: "Fantasy", price: 599, cover: "c4", label: "A COURT OF<br>THORNS" },
  { id: 5, title: "The Things We Leave", author: "Rebecca Yarros", category: "Fiction", price: 429, cover: "c5", label: "THE THINGS<br>WE LEAVE" },
  { id: 6, title: "Think Like a Monk", author: "Jay Shetty", category: "Personal Growth", price: 379, cover: "c6", label: "THINK LIKE<br>A MONK" },
  { id: 7, title: "The Thursday Murder Club", author: "Richard Osman", category: "Mystery", price: 459, cover: "c7", label: "THE THURSDAY<br>MURDER CLUB" },
  { id: 8, title: "A Brief History of Time", author: "Stephen Hawking", category: "Non-fiction", price: 329, cover: "c8", label: "A BRIEF HISTORY<br>OF TIME" }
];

let activeCategory = "All";
const cart = {};
const money = amount => "₹" + amount.toLocaleString("en-IN");

const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");
const booksGrid = document.getElementById("books-grid");
const cartOverlay = document.getElementById("cart-overlay");

function renderBooks() {
  const query = searchInput.value.trim().toLowerCase();
  let visibleBooks = books.filter(book => {
    const matchesCategory = activeCategory === "All" || book.category === activeCategory;
    const matchesSearch = [book.title, book.author, book.category]
      .some(value => value.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  switch (sortSelect.value) {
    case "low": visibleBooks.sort((a, b) => a.price - b.price); break;
    case "high": visibleBooks.sort((a, b) => b.price - a.price); break;
    case "az": visibleBooks.sort((a, b) => a.title.localeCompare(b.title)); break;
  }

  document.getElementById("result-count").textContent =
    `${visibleBooks.length} book${visibleBooks.length === 1 ? "" : "s"} to discover`;

  if (!visibleBooks.length) {
    booksGrid.innerHTML = '<div class="empty">No books found. Try another search or category.</div>';
    return;
  }

  booksGrid.innerHTML = visibleBooks.map(book => `
    <article class="book-card">
      <div class="cover ${book.cover}"><span><small>PageTurner edition</small>${book.label}</span></div>
      <div class="book-info">
        <div class="genre">${book.category}</div>
        <h3>${book.title}</h3>
        <div class="author">by ${book.author}</div>
        <div class="card-bottom">
          <span class="price">${money(book.price)}</span>
          <button class="add-btn" data-add="${book.id}" aria-label="Add ${book.title} to bag">+</button>
        </div>
      </div>
    </article>`).join("");
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  updateCart();
  showToast("Added to your book bag ✦");
}

function updateCart() {
  const count = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  const entries = books.filter(book => cart[book.id]);
  const total = entries.reduce((sum, book) => sum + book.price * cart[book.id], 0);

  document.getElementById("cart-count").textContent = count;
  document.getElementById("cart-total").textContent = money(total);

  const itemsContainer = document.getElementById("cart-items");
  if (!entries.length) {
    itemsContainer.innerHTML = '<div class="cart-empty">Your bag is waiting for a good story.<br>Go find your next read ✦</div>';
  } else {
    itemsContainer.innerHTML = entries.map(book => `
      <div class="cart-item">
        <div>
          <strong>${book.title}</strong>
          <small>${book.author} · ${money(book.price)}</small>
          <div class="qty">
            <button data-change="${book.id}" data-delta="-1" aria-label="Remove one ${book.title}">−</button>
            <span>${cart[book.id]}</span>
            <button data-change="${book.id}" data-delta="1" aria-label="Add one ${book.title}">+</button>
          </div>
        </div>
        <strong>${money(book.price * cart[book.id])}</strong>
      </div>`).join("");
  }

  document.getElementById("checkout").disabled = entries.length === 0;
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2200);
}

// Event delegation keeps the cart controls working after each re-render.
document.addEventListener("click", event => {
  const addButton = event.target.closest("[data-add]");
  if (addButton) addToCart(Number(addButton.dataset.add));

  const changeButton = event.target.closest("[data-change]");
  if (changeButton) {
    const id = Number(changeButton.dataset.change);
    cart[id] = (cart[id] || 0) + Number(changeButton.dataset.delta);
    if (cart[id] <= 0) delete cart[id];
    updateCart();
  }
});

searchInput.addEventListener("input", renderBooks);
sortSelect.addEventListener("change", renderBooks);

document.getElementById("categories").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  document.querySelectorAll(".chip").forEach(chip => {
    chip.classList.toggle("active", chip === button);
  });
  renderBooks();
});

document.getElementById("explore-btn").addEventListener("click", () => {
  document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
});
document.getElementById("open-cart").addEventListener("click", () => cartOverlay.classList.add("open"));
document.getElementById("close-cart").addEventListener("click", () => cartOverlay.classList.remove("open"));
cartOverlay.addEventListener("click", event => {
  if (event.target === cartOverlay) cartOverlay.classList.remove("open");
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape") cartOverlay.classList.remove("open");
});
document.getElementById("checkout").addEventListener("click", () => {
  if (Object.keys(cart).length) showToast("Demo checkout — no order has been placed.");
});
document.getElementById("join-btn").addEventListener("click", () => {
  showToast("Thanks for your interest! Reading club sign-up is coming soon.");
});

renderBooks();
updateCart();
