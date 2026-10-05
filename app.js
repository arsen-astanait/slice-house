(() => {
  const key = 'slice-house-demo-cart';
  const load = () => {
    try { const value = JSON.parse(localStorage.getItem(key) || '[]'); return Array.isArray(value) ? value : []; }
    catch { return []; }
  };
  let items = load();
  const save = () => { try { localStorage.setItem(key, JSON.stringify(items)); } catch { /* Private mode can disable storage. */ } };
  const draw = () => {
    const list = document.querySelector('#cart-items');
    list.replaceChildren();
    let sum = 0;
    items.forEach(({name, price}, index) => {
      const row = document.createElement('li');
      row.className = 'list-group-item d-flex justify-content-between align-items-center gap-2';
      const label = document.createElement('span');
      label.textContent = `${name} · ${price.toLocaleString('en-US')} ₸`;
      const remove = document.createElement('button');
      remove.type = 'button'; remove.className = 'btn btn-outline-primary btn-sm';
      remove.textContent = 'Remove'; remove.setAttribute('aria-label', `Remove ${name}`);
      remove.addEventListener('click', () => { items.splice(index, 1); save(); draw(); });
      row.append(label, remove); list.append(row); sum += price;
    });
    document.querySelector('#cart-count').textContent = items.length;
    document.querySelector('#cart-empty').hidden = items.length > 0;
    document.querySelector('#cart-total').textContent = items.length ? `Total: ${sum.toLocaleString('en-US')} ₸` : '';
    document.querySelector('#clear-cart').disabled = items.length === 0;
  };
  document.querySelectorAll('[data-add-to-cart]').forEach(button => button.addEventListener('click', () => {
    const card = button.closest('.product-card, .promo-card');
    const name = card.querySelector('h3').textContent.trim();
    const price = Number(card.querySelector('.price').textContent.replace(/[^0-9]/g, ''));
    items.push({name, price}); save(); draw();
    bootstrap.Offcanvas.getOrCreateInstance(document.querySelector('#cartPanel')).show();
  }));
  document.querySelector('#clear-cart').addEventListener('click', () => { items = []; save(); draw(); });
  const form = document.querySelector('#contact-form');
  if (form) {
    const previewToggle = document.querySelector('#preview-toggle');
    const preview = document.querySelector('#message-preview');
    const previewText = document.querySelector('#message-preview-text');
    const message = document.querySelector('#message');
    const updatePreview = () => {
      preview.hidden = !previewToggle.checked;
      previewText.textContent = message.value.trim() || 'Your message will appear here.';
    };
    previewToggle.addEventListener('change', updatePreview);
    message.addEventListener('input', updatePreview);
    updatePreview();
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const status = document.querySelector('#form-status');
      status.className = 'alert alert-info mt-3';
      status.textContent = 'Demo only: your message was not sent. Please use the contact details shown on this page.';
    });
  }
  draw();
})();
