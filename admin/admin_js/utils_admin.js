function openPage(page, el) {
  document.querySelectorAll(".page").forEach((p) => p.classList.add("hidden"));

  const target = document.getElementById("page-" + page);

  if (!target) {
    console.warn("Page tidak ditemukan:", page);
    showToast?.("Halaman belum tersedia", "warning");

    document.getElementById("page-dashboard")?.classList.remove("hidden");
    return;
  }

  target.classList.remove("hidden");

  document
    .querySelectorAll(".menu")
    .forEach((btn) => btn.classList.remove("active"));
  el?.classList.add("active");

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

  pageLoader[page]?.();

  if (window.innerWidth < 768) {
    closeSidebar?.();
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

function showToast(msg, type = "success") {
  const toast = document.getElementById("toast");
  if (!toast) return;

  let icon = "";

  // 🎓 ICON KHUSUS EDUKASI
  switch (type) {
    case "success":
      icon = "📘"; // buku
      break;
    case "error":
      icon = "❌";
      break;
    case "warning":
      icon = "⚠️";
      break;
    case "info":
      icon = "🎓"; // topi wisuda
      break;
  }

  toast.className = "";
  toast.classList.add("show", "toast-" + type);

  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span>${msg}</span>
  `;

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// ===============================
// DELETE GLOBAL SYSTEM
// ===============================

let deleteCallback = null;

function openDeleteModal(message, callback) {
  const modal = document.getElementById("modalDelete");
  const msg = document.getElementById("deleteMessage");

  msg.innerText = message || "Yakin ingin menghapus data ini?";
  deleteCallback = callback;

  modal.classList.add("show");
}

function closeDeleteModal() {
  const modal = document.getElementById("modalDelete");
  modal.classList.remove("show");
  deleteCallback = null;
}

// 🔥 tombol confirm
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btnConfirmDelete");

  if (btn) {
    btn.onclick = () => {
      if (deleteCallback) deleteCallback();
      closeDeleteModal();
    };
  }
});

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  sidebar.classList.toggle("active");
  overlay.classList.toggle("show");
}

function closeSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  sidebar.classList.remove("active");
  overlay.classList.remove("show");
}
