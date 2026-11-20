/**
 * KONFIGURASI NOMOR WHATSAPP PENJUAL
 * Ganti nomor di bawah ini dengan nomor WhatsApp asli Cheesecake 404.
 * Gunakan format kode negara tanpa tanda '+' atau spasi (contoh Indonesia: 6281234567890).
 */
const WHATSAPP_NUMBER = "6285183378236";

/**
 * Data 2 Menu Utama Cheesecake 404
 */
const MENU_ITEMS = {
  ori: {
    id: 'ori',
    name: 'Cheesecake Ori',
    price: 15000,
    unit: 'potong',
    emoji: '🍰',
  },
  strawberry: {
    id: 'strawberry',
    name: 'Cheesecake Strawberry',
    price: 17000,
    unit: 'potong',
    emoji: '🍓',
  },
};

// State jumlah sementara pada masing-masing kartu menu
const cardQuantities = {
  ori: 1,
  strawberry: 1,
};

// State keranjang belanja utama (tersinkronisasi antara Navbar, Drawer, dan Form Order)
const cart = {
  ori: 0,
  strawberry: 0,
};

/**
 * Format angka ke format Rupiah (contoh: Rp15.000)
 */
function formatRupiah(amount) {
  return 'Rp' + Number(amount).toLocaleString('id-ID');
}

/**
 * Menampilkan notifikasi toast yang rapi (pengganti alert())
 */
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  const bgColor = type === 'error' ? 'bg-strawberry text-cream' : 'bg-maroon text-cream';
  const icon = type === 'error' ? '⚠️' : '✅';

  toast.className = `${bgColor} pointer-events-auto px-4 py-3 rounded-2xl shadow-xl border border-cream/20 text-sm font-semibold flex items-center gap-2.5 transform transition-all duration-300 translate-y-[-10px] opacity-0 max-w-sm ml-auto`;
  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;

  container.appendChild(toast);

  // Animasi masuk
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-[-10px]', 'opacity-0');
  });

  // Hapus otomatis setelah 3.2 detik
  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-[-10px]');
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

/**
 * Ubah angka jumlah pada kartu menu sebelum ditambahkan ke keranjang
 */
function changeCardQty(itemId, delta) {
  const nextVal = cardQuantities[itemId] + delta;
  if (nextVal < 1) return;
  cardQuantities[itemId] = nextVal;
  const el = document.getElementById(`qty-${itemId}`);
  if (el) el.textContent = nextVal;
}

/**
 * Tambahkan item dari kartu menu ke keranjang belanja
 */
function addToCartFromCard(itemId) {
  const qtyToAdd = cardQuantities[itemId] || 1;
  cart[itemId] += qtyToAdd;

  // Reset angka di kartu kembali ke 1 setelah ditambahkan
  cardQuantities[itemId] = 1;
  const el = document.getElementById(`qty-${itemId}`);
  if (el) el.textContent = 1;

  renderAllCartViews();
  showToast(`${qtyToAdd}x ${MENU_ITEMS[itemId].name} ditambahkan ke keranjang!`);
}

/**
 * Ubah jumlah item langsung di dalam keranjang (Drawer atau Form Order)
 */
function updateCartQty(itemId, delta) {
  const nextVal = cart[itemId] + delta;
  cart[itemId] = nextVal < 0 ? 0 : nextVal;
  renderAllCartViews();
}

/**
 * Kosongkan keranjang belanja
 */
function clearCart() {
  cart.ori = 0;
  cart.strawberry = 0;
  renderAllCartViews();
  showToast('Keranjang belanja telah dikosongkan.');
}

/**
 * Hitung total item dan total harga keranjang
 */
function getCartSummary() {
  const totalQty = cart.ori + cart.strawberry;
  const totalPrice =
    cart.ori * MENU_ITEMS.ori.price +
    cart.strawberry * MENU_ITEMS.strawberry.price;
  return { totalQty, totalPrice };
}

/**
 * Render ulang badge navbar, drawer keranjang, dan panel ringkasan form order
 */
function renderAllCartViews() {
  const { totalQty, totalPrice } = getCartSummary();

  // 1. Update Badge di Navbar
  const badge = document.getElementById('cart-badge');
  if (badge) {
    badge.textContent = totalQty;
    badge.classList.add('scale-125');
    setTimeout(() => badge.classList.remove('scale-125'), 180);
  }

  // 2. Render Panel Ringkasan di Section Cara Pesan
  const orderListEl = document.getElementById('order-items-list');
  if (orderListEl) {
    orderListEl.innerHTML = Object.values(MENU_ITEMS)
      .map((item) => {
        const qty = cart[item.id];
        const subtotal = qty * item.price;
        return `
          <div class="bg-cream/10 border border-cream/15 rounded-2xl p-4 flex items-center justify-between gap-3">
            <div>
              <div class="flex items-center gap-1.5">
                <span>${item.emoji}</span>
                <h4 class="font-bold text-sm sm:text-base text-cream">${item.name}</h4>
              </div>
              <p class="text-xs text-cream/75 mt-0.5">${formatRupiah(item.price)} / ${item.unit}</p>
              ${qty > 0 ? `<p class="text-xs font-bold text-cream mt-1">Subtotal: ${formatRupiah(subtotal)}</p>` : ''}
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onclick="updateCartQty('${item.id}', -1)"
                aria-label="Kurangi ${item.name}"
                class="w-8 h-8 rounded-xl bg-cream/15 hover:bg-cream text-cream hover:text-maroon font-extrabold transition-colors flex items-center justify-center cursor-pointer"
              >−</button>
              <span class="w-6 text-center font-extrabold text-sm text-cream">${qty}</span>
              <button
                type="button"
                onclick="updateCartQty('${item.id}', 1)"
                aria-label="Tambah ${item.name}"
                class="w-8 h-8 rounded-xl bg-cream/15 hover:bg-cream text-cream hover:text-maroon font-extrabold transition-colors flex items-center justify-center cursor-pointer"
              >+</button>
            </div>
          </div>
        `;
      })
      .join('');
  }

  const orderQtyEl = document.getElementById('order-total-qty');
  const orderPriceEl = document.getElementById('order-total-price');
  if (orderQtyEl) orderQtyEl.textContent = `${totalQty} potong`;
  if (orderPriceEl) orderPriceEl.textContent = formatRupiah(totalPrice);

  // 3. Render Isi Drawer Keranjang Belanja
  const drawerItemsEl = document.getElementById('drawer-cart-items');
  const drawerTotalEl = document.getElementById('drawer-total-price');
  if (drawerTotalEl) drawerTotalEl.textContent = formatRupiah(totalPrice);

  if (drawerItemsEl) {
    if (totalQty === 0) {
      drawerItemsEl.innerHTML = `
        <div class="h-full flex flex-col items-center justify-center text-center py-10">
          <div class="w-16 h-16 rounded-full bg-cream-soft flex items-center justify-center text-3xl mb-4">🍰</div>
          <p class="font-bold text-maroon text-base">Keranjang masih kosong</p>
          <p class="text-sm text-ink/65 mt-1 max-w-xs">Yuk pilih Cheesecake Ori atau Cheesecake Strawberry favoritmu dulu!</p>
        </div>
      `;
    } else {
      drawerItemsEl.innerHTML = Object.values(MENU_ITEMS)
        .filter((item) => cart[item.id] > 0)
        .map((item) => {
          const qty = cart[item.id];
          const subtotal = qty * item.price;
          return `
            <div class="bg-cream-soft rounded-2xl p-4 border border-cream-border flex items-center justify-between gap-3">
              <div>
                <h4 class="font-extrabold text-maroon text-sm sm:text-base">${item.emoji} ${item.name}</h4>
                <p class="text-xs text-ink/70 mt-0.5">${formatRupiah(item.price)} x ${qty} = <strong class="text-ink">${formatRupiah(subtotal)}</strong></p>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onclick="updateCartQty('${item.id}', -1)"
                  class="w-8 h-8 rounded-xl bg-cream hover:bg-maroon hover:text-cream text-maroon font-bold border border-cream-border transition-colors flex items-center justify-center cursor-pointer"
                >−</button>
                <span class="w-6 text-center font-extrabold text-sm">${qty}</span>
                <button
                  type="button"
                  onclick="updateCartQty('${item.id}', 1)"
                  class="w-8 h-8 rounded-xl bg-cream hover:bg-maroon hover:text-cream text-maroon font-bold border border-cream-border transition-colors flex items-center justify-center cursor-pointer"
                >+</button>
              </div>
            </div>
          `;
        })
        .join('');
    }
  }
}

/**
 * Pesan langsung 1 varian dari kartu menu menuju WhatsApp
 */
function orderSingleViaWA(itemId) {
  const item = MENU_ITEMS[itemId];
  const qty = cardQuantities[itemId] || 1;
  const total = qty * item.price;

  const text =
    `Halo *Cheesecake 404*! 🍰\n` +
    `Saya ingin memesan:\n\n` +
    `• *${item.name}* (${qty} potong) — ${formatRupiah(total)}\n\n` +
    `*Total Estimasi:* ${formatRupiah(total)}\n\n` +
    `Apakah stoknya tersedia? Terima kasih!`;

  openWhatsApp(text);
}

/**
 * Chat cepat umum via WhatsApp (tombol Hero / Floating WA / Footer)
 */
function quickChatWhatsApp() {
  const text =
    `Halo *Cheesecake 404*! 🍰\n` +
    `Saya tertarik untuk memesan Cheesecake Ori / Cheesecake Strawberry. Boleh info ketersediaannya hari ini?`;
  openWhatsApp(text);
}

/**
 * Helper membuka URL wa.me di tab baru dengan aman
 */
function openWhatsApp(messageText) {
  try {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(messageText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  } catch (err) {
    showToast('Gagal membuka WhatsApp. Silakan coba lagi.', 'error');
  }
}

/**
 * Kontrol Buka & Tutup Drawer Keranjang
 */
const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-drawer-overlay');

function openCartDrawer() {
  cartOverlay.classList.remove('hidden');
  requestAnimationFrame(() => {
    cartOverlay.classList.remove('opacity-0');
    cartDrawer.classList.remove('translate-x-full');
  });
}

function closeCartDrawer() {
  cartOverlay.classList.add('opacity-0');
  cartDrawer.classList.add('translate-x-full');
  setTimeout(() => {
    cartOverlay.classList.add('hidden');
  }, 300);
}

function goToCheckoutForm() {
  closeCartDrawer();
  const target = document.getElementById('cara-pesan');
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
}

// Event Listener Drawer & Menu Mobile
document.getElementById('open-cart-btn').addEventListener('click', openCartDrawer);
document.getElementById('close-cart-btn').addEventListener('click', closeCartDrawer);
cartOverlay.addEventListener('click', closeCartDrawer);

const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
mobileMenuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});
document.querySelectorAll('.mobile-nav-link').forEach((link) => {
  link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
});

/**
 * Handler Submit Form Pemesanan Lengkap ke WhatsApp
 */
document.getElementById('whatsapp-order-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const { totalQty, totalPrice } = getCartSummary();
  const customerName = document.getElementById('customer-name').value.trim();
  const deliveryMethod = document.querySelector('input[name="deliveryMethod"]:checked')?.value || 'Ambil di Tempat';
  const customerNotes = document.getElementById('customer-notes').value.trim();

  // Validasi keranjang tidak kosong
  if (totalQty === 0) {
    showToast('Pilih minimal 1 potong cheesecake terlebih dahulu ya!', 'error');
    return;
  }

  // Validasi nama pemesan wajib diisi
  if (!customerName) {
    showToast('Mohon isi Nama Pemesan terlebih dahulu.', 'error');
    document.getElementById('customer-name').focus();
    return;
  }

  // Susun rincian menu
  const itemLines = [];
  if (cart.ori > 0) {
    itemLines.push(`• ${MENU_ITEMS.ori.name} (${cart.ori} potong) — ${formatRupiah(cart.ori * MENU_ITEMS.ori.price)}`);
  }
  if (cart.strawberry > 0) {
    itemLines.push(`• ${MENU_ITEMS.strawberry.name} (${cart.strawberry} potong) — ${formatRupiah(cart.strawberry * MENU_ITEMS.strawberry.price)}`);
  }

  const formattedMessage =
    `Halo *Cheesecake 404*! 🍰\n` +
    `Saya mau pesan cheesecake dengan rincian berikut:\n\n` +
    `*Nama Pemesan:* ${customerName}\n` +
    `*Metode:* ${deliveryMethod}\n\n` +
    `*Detail Pesanan:*\n` +
    `${itemLines.join('\n')}\n\n` +
    `*Total Pesanan:* ${totalQty} potong\n` +
    `*Total Harga:* ${formatRupiah(totalPrice)}\n` +
    `*Alamat / Catatan:* ${customerNotes ? customerNotes : '-'}\n\n` +
    `Mohon konfirmasi pesanannya ya. Terima kasih! 🙏`;

  showToast('Mengarahkan pesanan ke WhatsApp...');
  openWhatsApp(formattedMessage);
});

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('current-year').textContent = new Date().getFullYear();
  renderAllCartViews();
});
