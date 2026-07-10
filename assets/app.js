const STORAGE_KEYS = {
  settings: 'jslw-settings',
  products: 'jslw-products',
  categories: 'jslw-categories',
  cart: 'jslw-cart',
  orders: 'jslw-orders',
  auth: 'jslw-admin-auth'
};

const demoProducts = [
  {
    id: 'belt-01',
    name: 'Classic Belt',
    price: 85,
    description: 'Hand-stitched bridle leather belt with a polished buckle.',
    category: 'Belts',
    featured: true,
    images: ['https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80'],
    modifiers: [{ id: crypto.randomUUID(), type: 'text', label: 'Personalization', placeholder: 'Initials or name', required: false }],
    listModifiers: [{ id: crypto.randomUUID(), label: 'Finish', options: 'Matte,Gloss' }],
    variableModifiers: [{ id: crypto.randomUUID(), label: 'Size', options: '30,32,34,36' }],
    attributes: [{ id: crypto.randomUUID(), name: 'Material', value: 'Bridle leather' }]
  },
  {
    id: 'wallet-01',
    name: 'Minimal Wallet',
    price: 70,
    description: 'Slim wallet with card slots and a pocket for cash.',
    category: 'Wallets',
    featured: true,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80'],
    modifiers: [{ id: crypto.randomUUID(), type: 'text', label: 'Monogram', placeholder: 'Optional initials', required: false }],
    listModifiers: [{ id: crypto.randomUUID(), label: 'Color', options: 'Black,Brown' }],
    variableModifiers: [],
    attributes: [{ id: crypto.randomUUID(), name: 'Style', value: 'Slim' }]
  }
];

const demoSettings = {
  siteTitle: 'JS Leather Works',
  logoText: 'JS Leather Works',
  heroTitle: 'JS Leather Works',
  heroSubtitle: 'Custom leather goods crafted with care.',
  footerText: 'Copyright © 2026 JS Leather Works',
  primaryColor: '#111111',
  backgroundStyle: 'topographic',
  layoutMode: 'classic',
  visiblePages: ['home','shop','custom','cart','checkout','admin'],
  paymentMethods: { venmo: '@jsleatherworks', paypal: 'jsleatherworks', cashapp: '$jsleatherworks' }
};

function loadState() {
  const settings = JSON.parse(localStorage.getItem(STORAGE_KEYS.settings) || 'null') || demoSettings;
  const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.products) || 'null') || demoProducts;
  const categories = JSON.parse(localStorage.getItem(STORAGE_KEYS.categories) || 'null') || ['Belts', 'Wallets', 'Bags', 'Accessories'];
  const cart = JSON.parse(localStorage.getItem(STORAGE_KEYS.cart) || 'null') || [];
  const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.orders) || 'null') || [];
  return { settings, products, categories, cart, orders };
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(state.settings));
  localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(state.products));
  localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(state.categories));
  localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(state.cart));
  localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(state.orders));
}

let state = loadState();

function getPageName() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  if (path === '' || path === 'index.html') return 'home';
  if (path === 'shop.html') return 'shop';
  if (path === 'custom-orders.html') return 'custom';
  if (path === 'cart.html') return 'cart';
  if (path === 'checkout.html') return 'checkout';
  if (path === 'admin-login.html') return 'admin-login';
  if (path === 'admin.html') return 'admin';
  return 'home';
}

function applyPageClass() {
  document.body.classList.remove('layout-classic', 'layout-modern');
  document.body.classList.add(state.settings.layoutMode === 'modern' ? 'layout-modern' : 'layout-classic');
}

function buildHeader() {
  const visiblePages = state.settings.visiblePages || ['home','shop','custom','cart','checkout','admin'];
  const links = [
    { key: 'home', label: 'Home', href: 'index.html' },
    { key: 'shop', label: 'Shop All', href: 'shop.html' },
    { key: 'custom', label: 'Custom Orders', href: 'custom-orders.html' },
    { key: 'cart', label: 'Cart', href: 'cart.html' }
  ].filter(link => visiblePages.includes(link.key));
  return `
    <header>
      <div class="navbar">
        <a class="brand" href="index.html">
          <img src="assets/logo.svg" alt="JS Leather Works logo">
          <span>${state.settings.logoText}</span>
        </a>
        <nav class="nav-links">
          ${links.map(link => `<a href="${link.href}">${link.label}</a>`).join('')}
        </nav>
      </div>
    </header>
  `;
}

function buildFooter() {
  return `
    <footer class="footer">
      <p>${state.settings.footerText}</p>
      <a class="admin-link" href="admin-login.html" aria-label="Admin access">Admin</a>
    </footer>
  `;
}

function renderLayout() {
  document.body.insertAdjacentHTML('afterbegin', buildHeader());
  document.body.insertAdjacentHTML('beforeend', buildFooter());
  document.querySelector('main').insertAdjacentHTML('afterend', '');
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

function createProductCard(product) {
  const image = product.images?.[0] || 'https://via.placeholder.com/600x400?text=Leather+Product';
  return `
    <article class="card">
      <img src="${image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p class="meta">${product.category}</p>
      <p>${product.description}</p>
      <p><strong>${formatCurrency(product.price)}</strong></p>
      <div class="pill-row">
        ${product.featured ? '<span class="badge">Featured</span>' : ''}
      </div>
      <button class="button" data-product-id="${product.id}">Add to cart</button>
    </article>
  `;
}

function renderHome() {
  const hero = document.querySelector('[data-home-hero]');
  if (!hero) return;
  hero.innerHTML = `
    <section class="hero">
      <div>
        <h1>${state.settings.heroTitle}</h1>
        <p>${state.settings.heroSubtitle}</p>
        <a class="btn" href="shop.html">Shop All</a>
      </div>
    </section>
  `;
  const featured = state.products.filter(product => product.featured);
  const featuredContainer = document.querySelector('[data-featured-products]');
  if (featuredContainer) {
    featuredContainer.innerHTML = featured.length ? featured.map(createProductCard).join('') : '<div class="empty-state">Featured products will appear here after you mark them in the admin dashboard.</div>';
    featuredContainer.querySelectorAll('[data-product-id]').forEach(button => {
      button.addEventListener('click', () => openProductModal(button.dataset.productId));
    });
  }
}

function renderShop() {
  const categoryList = document.querySelector('[data-categories]');
  const productGrid = document.querySelector('[data-products]');
  if (!categoryList || !productGrid) return;
  const activeCategory = new URLSearchParams(window.location.search).get('category') || 'All';
  categoryList.innerHTML = ['All', ...state.categories].map(category => `<button class="category-pill ${category === activeCategory ? 'active' : ''}" data-category="${category}">${category}</button>`).join('');
  const filtered = activeCategory === 'All' ? state.products : state.products.filter(product => product.category === activeCategory);
  productGrid.innerHTML = filtered.length ? filtered.map(createProductCard).join('') : '<div class="empty-state">No products in this category yet.</div>';
  categoryList.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
      const url = new URL(window.location.href);
      url.searchParams.set('category', button.dataset.category);
      window.location.href = url.toString();
    });
  });
  productGrid.querySelectorAll('[data-product-id]').forEach(button => {
    button.addEventListener('click', () => openProductModal(button.dataset.productId));
  });
}

function openProductModal(productId) {
  const product = state.products.find(item => item.id === productId);
  if (!product) return;
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="order-summary" style="max-width: 520px; margin: 3rem auto;">
      <h2>${product.name}</h2>
      <p>${product.description}</p>
      <p><strong>${formatCurrency(product.price)}</strong></p>
      <div class="form-stack">
        ${product.modifiers?.map(mod => `
          <label>${mod.label}
            <input type="text" data-modifier="${mod.id}" placeholder="${mod.placeholder || ''}">
          </label>
        `).join('') || ''}
        ${product.listModifiers?.map(mod => `
          <label>${mod.label}
            <select data-list-modifier="${mod.id}">
              ${mod.options.split(',').map(option => `<option value="${option.trim()}">${option.trim()}</option>`).join('')}
            </select>
          </label>
        `).join('') || ''}
        ${product.variableModifiers?.map(mod => `
          <label>${mod.label}
            <input type="number" min="1" value="1" data-variable-modifier="${mod.id}">
          </label>
        `).join('') || ''}
        <label>Quantity
          <input type="number" min="1" value="1" id="product-modal-qty">
        </label>
      </div>
      <div class="pill-row">
        ${product.attributes?.map(attr => `<span class="badge">${attr.name}: ${attr.value}</span>`).join('') || ''}
      </div>
      <div class="pill-row">
        <button class="button" id="add-modal-item">Add to cart</button>
        <button class="secondary" id="close-modal">Cancel</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.querySelector('#close-modal').addEventListener('click', () => modal.remove());
  modal.querySelector('#add-modal-item').addEventListener('click', () => {
    const selected = [];
    modal.querySelectorAll('[data-modifier]').forEach(input => { if (input.value) selected.push(`${product.modifiers.find(m => m.id === input.dataset.modifier)?.label}: ${input.value}`); });
    modal.querySelectorAll('[data-list-modifier]').forEach(select => { selected.push(`${product.listModifiers.find(m => m.id === select.dataset.listModifier)?.label}: ${select.value}`); });
    modal.querySelectorAll('[data-variable-modifier]').forEach(input => { selected.push(`${product.variableModifiers.find(m => m.id === input.dataset.variableModifier)?.label}: ${input.value}`); });
    const item = { id: `${product.id}-${Date.now()}`, productId: product.id, name: product.name, price: product.price, quantity: Number(modal.querySelector('#product-modal-qty').value || 1), selected }; 
    state.cart.push(item);
    saveState(state);
    window.location.href = 'cart.html';
  });
}

function renderCart() {
  const container = document.querySelector('[data-cart-items]');
  const total = document.querySelector('[data-cart-total]');
  if (!container || !total) return;
  if (!state.cart.length) {
    container.innerHTML = '<div class="empty-state">Your cart is empty.</div>';
    total.textContent = formatCurrency(0);
    return;
  }
  container.innerHTML = state.cart.map(item => `
    <div class="cart-item">
      <div>
        <h3>${item.name}</h3>
        <p class="small">Qty: ${item.quantity}</p>
        ${item.selected?.length ? `<p class="small">${item.selected.join(' • ')}</p>` : ''}
      </div>
      <div>
        <p><strong>${formatCurrency(item.price * item.quantity)}</strong></p>
        <button class="secondary" data-remove-item="${item.id}">Remove</button>
      </div>
    </div>
  `).join('');
  total.textContent = formatCurrency(state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0));
  container.querySelectorAll('[data-remove-item]').forEach(button => {
    button.addEventListener('click', () => {
      state.cart = state.cart.filter(item => item.id !== button.dataset.removeItem);
      saveState(state);
      renderCart();
    });
  });
}

function renderCheckout() {
  const summary = document.querySelector('[data-checkout-summary]');
  if (summary) {
    summary.innerHTML = state.cart.length ? state.cart.map(item => `<p>${item.name} × ${item.quantity} — ${formatCurrency(item.price * item.quantity)}</p>`).join('') : '<p>Your cart is empty.</p>';
  }
}

function handleCheckoutSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const values = new FormData(form);
  const order = {
    id: `order-${Date.now()}`,
    createdAt: new Date().toISOString(),
    email: values.get('email'),
    phone: values.get('phone'),
    shipping: values.get('shipping'),
    paymentMethod: values.get('paymentMethod'),
    items: state.cart,
    total: state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  };
  state.orders.push(order);
  state.cart = [];
  saveState(state);
  const success = document.querySelector('[data-checkout-success]');
  if (success) {
    success.innerHTML = `<div class="order-summary"><h2>Order received</h2><p>Thanks for your order. We will reach out shortly.</p></div>`;
    form.reset();
  }
}

function setAdminLoggedIn(value) {
  localStorage.setItem(STORAGE_KEYS.auth, value ? 'true' : 'false');
}

function isAdminLoggedIn() {
  return localStorage.getItem(STORAGE_KEYS.auth) === 'true';
}

function renderAdminLogin() {
  const form = document.querySelector('[data-admin-login-form]');
  if (!form) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const code = formData.get('code');
    const message = document.querySelector('[data-login-message]');
    if (code === '1012') {
      setAdminLoggedIn(true);
      window.location.href = 'admin.html';
    } else {
      if (message) message.textContent = 'Access denied.';
    }
  });
}

function renderAdmin() {
  if (!isAdminLoggedIn()) {
    window.location.href = 'admin-login.html';
    return;
  }
  renderAdminContent();
}

function renderAdminContent() {
  const sections = document.querySelectorAll('.admin-section');
  document.querySelectorAll('[data-admin-nav] a').forEach(link => link.addEventListener('click', () => {
    const target = link.dataset.section;
    sections.forEach(section => section.classList.toggle('active', section.id === target));
  }));

  const paymentForm = document.querySelector('[data-payment-form]');
  if (paymentForm) {
    paymentForm.innerHTML = `
      <label>Venmo<input name="venmo" value="${state.settings.paymentMethods?.venmo || ''}"></label>
      <label>PayPal<input name="paypal" value="${state.settings.paymentMethods?.paypal || ''}"></label>
      <label>Cash App<input name="cashapp" value="${state.settings.paymentMethods?.cashapp || ''}"></label>
      <button type="submit">Save payment methods</button>
    `;
    paymentForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(paymentForm);
      state.settings.paymentMethods = {
        venmo: data.get('venmo'),
        paypal: data.get('paypal'),
        cashapp: data.get('cashapp')
      };
      saveState(state);
      alert('Payment methods updated.');
    });
  }

  const ordersList = document.querySelector('[data-orders-list]');
  const orderDetail = document.querySelector('[data-order-detail]');
  if (ordersList) {
    ordersList.innerHTML = state.orders.length ? state.orders.map(order => `
      <button class="card" data-order-id="${order.id}">
        <strong>${order.id}</strong>
        <p class="small">${order.email} • ${order.phone}</p>
        <p class="small">${formatCurrency(order.total)}</p>
      </button>
    `).join('') : '<div class="empty-state">No orders yet.</div>';
    ordersList.querySelectorAll('[data-order-id]').forEach(button => button.addEventListener('click', () => {
      const order = state.orders.find(item => item.id === button.dataset.orderId);
      if (!order) return;
      orderDetail.innerHTML = `
        <div class="order-summary">
          <h3>${order.id}</h3>
          <p><strong>Email:</strong> ${order.email}</p>
          <p><strong>Phone:</strong> ${order.phone}</p>
          <p><strong>Shipping:</strong> ${order.shipping}</p>
          <p><strong>Payment:</strong> ${order.paymentMethod}</p>
          <ul>${order.items.map(item => `<li>${item.name} × ${item.quantity}${item.selected?.length ? ' — ' + item.selected.join(' • ') : ''}</li>`).join('')}</ul>
        </div>
      `;
    }));
  }

  const shippingList = document.querySelector('[data-shipping-list]');
  if (shippingList) {
    shippingList.innerHTML = state.orders.length ? state.orders.map(order => `
      <div class="card">
        <p><strong>${order.email}</strong></p>
        <p class="small">${order.shipping}</p>
      </div>
    `).join('') : '<div class="empty-state">No shipping info yet.</div>';
  }

  const siteForm = document.querySelector('[data-site-form]');
  if (siteForm) {
    siteForm.innerHTML = `
      <label>Logo text<input name="logoText" value="${state.settings.logoText}"></label>
      <label>Hero title<input name="heroTitle" value="${state.settings.heroTitle}"></label>
      <label>Hero subtitle<input name="heroSubtitle" value="${state.settings.heroSubtitle}"></label>
      <label>Footer text<input name="footerText" value="${state.settings.footerText}"></label>
      <label>Background style<select name="backgroundStyle"><option value="topographic" ${state.settings.backgroundStyle === 'topographic' ? 'selected' : ''}>Topographic</option><option value="minimal" ${state.settings.backgroundStyle === 'minimal' ? 'selected' : ''}>Minimal</option></select></label>
      <label>Layout mode<select name="layoutMode"><option value="classic" ${state.settings.layoutMode === 'classic' ? 'selected' : ''}>Classic</option><option value="modern" ${state.settings.layoutMode === 'modern' ? 'selected' : ''}>Modern</option></select></label>
      <div>${['home','shop','custom','cart','checkout','admin'].map(page => `<label><input type="checkbox" name="visiblePages" value="${page}" ${state.settings.visiblePages?.includes(page) ? 'checked' : ''}> ${page}</label>`).join('')}</div>
      <button type="submit">Save site settings</button>
    `;
    siteForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(siteForm);
      state.settings.logoText = data.get('logoText');
      state.settings.heroTitle = data.get('heroTitle');
      state.settings.heroSubtitle = data.get('heroSubtitle');
      state.settings.footerText = data.get('footerText');
      state.settings.backgroundStyle = data.get('backgroundStyle');
      state.settings.layoutMode = data.get('layoutMode');
      state.settings.visiblePages = data.getAll('visiblePages');
      saveState(state);
      applyPageClass();
      window.location.reload();
    });
  }

  renderCategoryEditor();

  const productList = document.querySelector('[data-product-list]');
  const productForm = document.querySelector('[data-product-form]');
  if (productList && productForm) {
    renderProductAdminList(productList);
    productForm.addEventListener('submit', handleProductSubmit);
    productForm.querySelector('[data-add-modifier]')?.addEventListener('click', () => addModifierRow(productForm));
    productForm.querySelector('[data-add-attribute]')?.addEventListener('click', () => addAttributeRow(productForm));
  }

  const stats = document.querySelector('[data-dashboard-stats]');
  if (stats) {
    const totalRevenue = state.orders.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = state.orders.length ? totalRevenue / state.orders.length : 0;
    stats.innerHTML = `
      <div class="card"><h3>Orders</h3><p>${state.orders.length}</p></div>
      <div class="card"><h3>Total Revenue</h3><p>${formatCurrency(totalRevenue)}</p></div>
      <div class="card"><h3>Average Order Value</h3><p>${formatCurrency(averageOrderValue)}</p></div>
      <div class="card"><h3>Payment Methods</h3><p>${state.orders.map(order => order.paymentMethod).filter(Boolean).join(', ') || 'No payments yet'}</p></div>
    `;
  }
}

function renderCategoryEditor() {
  const container = document.querySelector('[data-category-editor]');
  if (!container) return;
  container.innerHTML = `
    <div class="card">
      <h3>Categories</h3>
      <div class="pill-row">${state.categories.map(category => `<span class="badge">${category} <button type="button" data-remove-category="${category}">×</button></span>`).join('')}</div>
      <label>New category<input name="newCategory"></label>
      <button type="button" data-add-category>Add category</button>
    </div>
  `;
  container.querySelector('[data-add-category]')?.addEventListener('click', () => {
    const input = container.querySelector('input[name="newCategory"]');
    const categoryName = input?.value.trim();
    if (!categoryName) return;
    if (!state.categories.includes(categoryName)) state.categories.push(categoryName);
    saveState(state);
    renderCategoryEditor();
  });
  container.querySelectorAll('[data-remove-category]').forEach(button => button.addEventListener('click', () => {
    state.categories = state.categories.filter(category => category !== button.dataset.removeCategory);
    saveState(state);
    renderCategoryEditor();
  }));
}

function renderProductAdminList(productList) {
  productList.innerHTML = state.products.map(product => `
    <div class="card">
      <h3>${product.name}</h3>
      <p class="small">${product.price}</p>
      <div class="pill-row">
        <button data-edit-product="${product.id}">Edit</button>
        <button class="secondary" data-remove-product="${product.id}">Remove</button>
      </div>
    </div>
  `).join('');
  productList.querySelectorAll('[data-edit-product]').forEach(button => button.addEventListener('click', () => populateProductForm(button.dataset.editProduct)));
  productList.querySelectorAll('[data-remove-product]').forEach(button => button.addEventListener('click', () => {
    state.products = state.products.filter(product => product.id !== button.dataset.removeProduct);
    saveState(state);
    renderProductAdminList(productList);
  }));
}

function populateProductForm(productId) {
  const form = document.querySelector('[data-product-form]');
  const product = state.products.find(item => item.id === productId);
  if (!form || !product) return;
  form.querySelector('[name="productId"]').value = product.id;
  form.querySelector('[name="name"]').value = product.name;
  form.querySelector('[name="price"]').value = product.price;
  form.querySelector('[name="description"]').value = product.description;
  form.querySelector('[name="category"]').value = product.category;
  form.querySelector('[name="featured"]').checked = product.featured;
  const preview = form.querySelector('[data-image-preview]');
  preview.innerHTML = '';
  if (product.images?.length) {
    preview.className = 'image-preview-grid';
    preview.innerHTML = product.images.map((image, index) => `
      <div class="card">
        <img src="${image}" alt="preview ${index + 1}">
        <div class="pill-row">
          <button type="button" data-move-image="${index}" data-direction="-1">↑</button>
          <button type="button" data-move-image="${index}" data-direction="1">↓</button>
        </div>
      </div>
    `).join('');
    preview.querySelectorAll('[data-move-image]').forEach(button => button.addEventListener('click', () => {
      moveProductImage(product.id, Number(button.dataset.moveImage), Number(button.dataset.direction));
    }));
  } else {
    preview.className = '';
    preview.innerHTML = '<p class="small">No images yet</p>';
  }
  form.querySelector('[data-modifier-editor]').innerHTML = '';
  product.modifiers?.forEach(mod => { addModifierRow(form, mod); });
  product.listModifiers?.forEach(mod => { addModifierRow(form, mod, 'list'); });
  product.variableModifiers?.forEach(mod => { addModifierRow(form, mod, 'variable'); });
  product.attributes?.forEach(attr => { addAttributeRow(form, attr); });
}

function addModifierRow(form, modifier = {}, type = 'text') {
  const group = document.createElement('div');
  group.className = 'card';
  const label = type === 'text' ? 'Text modifier' : type === 'list' ? 'List modifier' : 'Variable modifier';
  group.innerHTML = `
    <label>${label}<input type="text" name="modifierLabel" value="${modifier.label || ''}"></label>
    <label>Type<select name="modifierType"><option value="text" ${type === 'text' ? 'selected' : ''}>Text</option><option value="list" ${type === 'list' ? 'selected' : ''}>List</option><option value="variable" ${type === 'variable' ? 'selected' : ''}>Variable</option></select></label>
    <label>Options / values<input type="text" name="modifierOptions" value="${modifier.options || modifier.placeholder || ''}"></label>
    <button class="secondary" type="button" data-remove-row>Remove</button>
  `;
  group.querySelector('[data-remove-row]').addEventListener('click', () => group.remove());
  form.querySelector('[data-modifier-editor]').appendChild(group);
}

function addAttributeRow(form, attribute = {}) {
  const row = document.createElement('div');
  row.className = 'card';
  row.innerHTML = `
    <label>Attribute name<input type="text" name="attributeName" value="${attribute.name || ''}"></label>
    <label>Attribute value<input type="text" name="attributeValue" value="${attribute.value || ''}"></label>
    <button class="secondary" type="button" data-remove-row>Remove</button>
  `;
  row.querySelector('[data-remove-row]').addEventListener('click', () => row.remove());
  form.querySelector('[data-attribute-editor]').appendChild(row);
}

function handleProductSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const productId = formData.get('productId') || crypto.randomUUID();
  const product = {
    id: productId,
    name: formData.get('name'),
    price: Number(formData.get('price') || 0),
    description: formData.get('description'),
    category: formData.get('category'),
    featured: Boolean(formData.get('featured')),
    images: state.products.find(item => item.id === productId)?.images || [],
    modifiers: [],
    listModifiers: [],
    variableModifiers: [],
    attributes: []
  };
  const modifierContainers = form.querySelectorAll('[data-modifier-editor] > .card');
  modifierContainers.forEach(container => {
    const label = container.querySelector('[name="modifierLabel"]').value;
    const type = container.querySelector('[name="modifierType"]').value;
    const options = container.querySelector('[name="modifierOptions"]').value;
    if (!label) return;
    if (type === 'list') {
      product.listModifiers.push({ id: crypto.randomUUID(), label, options });
    } else if (type === 'variable') {
      product.variableModifiers.push({ id: crypto.randomUUID(), label, options });
    } else {
      product.modifiers.push({ id: crypto.randomUUID(), type, label, placeholder: options });
    }
  });
  const attributeContainers = form.querySelectorAll('[data-attribute-editor] > .card');
  attributeContainers.forEach(container => {
    const name = container.querySelector('[name="attributeName"]').value;
    const value = container.querySelector('[name="attributeValue"]').value;
    if (name) product.attributes.push({ id: crypto.randomUUID(), name, value });
  });
  const existingProduct = state.products.find(item => item.id === productId);
  if (existingProduct) {
    Object.assign(existingProduct, product);
  } else {
    state.products.push(product);
  }
  saveState(state);
  form.reset();
  const productList = document.querySelector('[data-product-list]');
  if (productList) renderProductAdminList(productList);
}

function moveProductImage(productId, index, direction) {
  const product = state.products.find(item => item.id === productId);
  if (!product?.images) return;
  const swapIndex = index + direction;
  if (swapIndex < 0 || swapIndex >= product.images.length) return;
  [product.images[index], product.images[swapIndex]] = [product.images[swapIndex], product.images[index]];
  saveState(state);
  populateProductForm(productId);
}

function wireAdminProductImageUpload() {
  const form = document.querySelector('[data-product-form]');
  const input = form?.querySelector('[name="images"]');
  const preview = form?.querySelector('[data-image-preview]');
  if (!input || !preview) return;
  input.addEventListener('change', async () => {
    const files = Array.from(input.files || []);
    const converted = [];
    for (const file of files) {
      const result = await readFileAsDataUrl(file);
      converted.push(result);
    }
    const existingId = form.querySelector('[name="productId"]').value;
    const existing = state.products.find(product => product.id === existingId);
    const currentImages = existing?.images || [];
    if (existing) {
      existing.images = [...currentImages, ...converted];
    } else {
      const newProduct = { id: crypto.randomUUID(), images: converted };
      state.products.push(newProduct);
    }
    saveState(state);
    populateProductForm(existing?.id || state.products[state.products.length - 1]?.id);
  });
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function init() {
  applyPageClass();
  renderLayout();
  const page = getPageName();
  if (page === 'home') renderHome();
  if (page === 'shop') renderShop();
  if (page === 'cart') renderCart();
  if (page === 'checkout') renderCheckout();
  if (page === 'admin-login') renderAdminLogin();
  if (page === 'admin') renderAdmin();
  document.querySelectorAll('form[data-checkout-form]').forEach(form => form.addEventListener('submit', handleCheckoutSubmit));
  document.querySelectorAll('[data-logout]').forEach(button => button.addEventListener('click', () => { setAdminLoggedIn(false); window.location.href = 'admin-login.html'; }));
  wireAdminProductImageUpload();
}

init();
