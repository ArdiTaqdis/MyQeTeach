function openPage(page, el) {
  // 🔥 sembunyikan semua halaman
  document.querySelectorAll(".page").forEach((p) => p.classList.add("hidden"));

  const target = document.getElementById("page-" + page);

  // 🔥 kalau page tidak ada
  if (!target) {
    console.warn("Page tidak ditemukan:", page);

    if (typeof showToast !== "undefined") {
      showToast("Halaman belum tersedia", "warning");
    }

    return;
  }

  // 🔥 tampilkan halaman
  target.classList.remove("hidden");

  // 🔥 aktifkan menu
  document
    .querySelectorAll(".menu")
    .forEach((btn) => btn.classList.remove("active"));
  if (el) el.classList.add("active");

  // 🔥 mapping function loader
  const pageLoader = {
    dashboard: window.loadDashboard,
    kelas: window.loadKelas,
    siswa: window.loadSiswa,
    jadwal: window.loadJadwal,
    absensi: window.loadAbsensi,
    nilai: window.loadNilai,
    ulangan: window.loadUlangan,
    jurnal: window.loadJurnal,
    rekap: window.loadRekap,
    user: window.loadUsers,
  };

  // 🔥 jalankan loader jika ada
  if (typeof pageLoader[page] === "function") {
    pageLoader[page]();
  } else {
    console.warn("Loader belum dibuat:", page);
  }

  // 🔥 auto close sidebar (mobile)
  if (window.innerWidth < 768) {
    if (typeof closeSidebar === "function") {
      closeSidebar();
    }
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const firstMenu = document.querySelector(".menu.active");
  openPage("dashboard", firstMenu);
});

function setLoading(btn, isLoading) {
  if (!btn) return;

  if (isLoading) {
    btn.disabled = true;
    btn.innerHTML = "⏳ Menyimpan...";
  } else {
    btn.disabled = false;
    btn.innerHTML = "Simpan";
  }
}

window.onload = function () {
  openPage("dashboard", document.querySelector(".menu.active"));
};

function showToast(msg, type = "success") {
  const toast = document.getElementById("toast");
  if (!toast) return; // 🔥 biar gak error

  let icon = "";

  if (type === "success") icon = "✔️";
  if (type === "error") icon = "❌";
  if (type === "warning") icon = "⚠️";

  toast.className = "";
  toast.classList.add("show", "toast-" + type);

  toast.innerHTML = `${icon} ${msg}`;

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}
