let editId = null;

// ============================
// LOAD DATA KELAS
// ============================
function loadKelas() {
  showTableSkeleton("tableKelas", 5);

  apiGet("getKelas")
    .then((data) => {
      const tbody = document.querySelector("#tableKelas tbody");

      let html = "";

      data.forEach((row) => {
        html += `
          <tr>
            <td>${row[1]}</td>
            <td>${row[3]}</td>
            <td>${row[2] || "-"}</td>
            <td>${row[4]}</td>
            <td>
              <button class="btn-edit"
                onclick="editKelas('${row[0]}','${row[1]}','${row[2]}','${row[3]}','${row[4]}')">
                ✏️
              </button>

              <button class="btn-delete"
                onclick="confirmDeleteKelas('${row[0]}')">
                🗑️
              </button>
            </td>
          </tr>
        `;
      });

      tbody.innerHTML = html;
    })
    .catch(() => showToast("Gagal load data", "error"));
}

// ============================
// SIMPAN KELAS
// ============================
function simpanKelas(btn) {
  setLoading(btn, true);

  const kelas = document.getElementById("kelasNama").value.trim();
  const tingkat = document.getElementById("kelasTingkat").value;
  const jurusan = document.getElementById("kelasJurusan").value.trim();

  // 🔥 ambil data dulu
  apiGet("getKelas").then((list) => {
    if (
      (tingkat.includes("SMA") ||
        tingkat.includes("SMK") ||
        tingkat.includes("MA")) &&
      !jurusan
    ) {
      showToast("Jurusan wajib untuk SMA/SMK/MA", "warning");
      setLoading(btn, false);
      return;
    }

    // 🔥 CEK DUPLIKAT

    if (!kelas) {
      showToast("Kelas wajib diisi", "warning");
      setLoading(btn, false);
      return;
    }

    if (!tingkat) {
      showToast("Tingkat wajib dipilih", "warning");
      setLoading(btn, false);
      return;
    }

    if (!document.getElementById("kelasWali").value.trim()) {
      showToast("Wali kelas wajib diisi", "warning");
      setLoading(btn, false);
      return;
    }

    if (isDuplicateKelas(list, kelas, tingkat, jurusan)) {
      showToast("Kelas sudah ada!", "warning");
      setLoading(btn, false);
      return;
    }

    const data = {
      action: editId ? "updateKelas" : "simpanKelas",
      id: editId,
      nama: generateNamaKelas(),
      jurusan: jurusan,
      tingkat: tingkat,
      wali: document.getElementById("kelasWali").value.trim(),
    };

    apiPost(data)
      .then(() => {
        setLoading(btn, false);

        showToast(
          editId ? "Berhasil diupdate" : "Berhasil disimpan",
          "success",
        );

        resetFormKelas();
        loadKelas();
      })
      .catch(() => {
        setLoading(btn, false);
        showToast("Server error", "error");
      });
  });
}

function handleTingkat() {
  const tingkat = document.getElementById("kelasTingkat").value;
  const jurusan = document.getElementById("kelasJurusan");

  if (
    tingkat.includes("SMA") ||
    tingkat.includes("SMK") ||
    tingkat.includes("MA")
  ) {
    jurusan.disabled = false;
    jurusan.placeholder = "Contoh: IPA / IPS / TKJ";
  } else {
    jurusan.value = "";
    jurusan.disabled = true;
    jurusan.placeholder = "Tidak diperlukan";
  }
}

function generateNamaKelas() {
  const tingkat = document.getElementById("kelasTingkat").value;
  const kelas = document.getElementById("kelasNama").value;
  const jurusan = document.getElementById("kelasJurusan").value;

  let nama = "";

  if (
    (tingkat.includes("SMA") ||
      tingkat.includes("SMK") ||
      tingkat.includes("MA")) &&
    jurusan
  ) {
    nama = kelas + " " + jurusan.toUpperCase();
  } else {
    nama = kelas;
  }

  return nama;
}

// ============================
// EDIT DELETE KELAS
// ============================

function editKelas(id, nama, jurusan, tingkat, wali) {
  editId = id;

  // 🔥 pecah nama kelas (ambil angka doang)
  let kelas = nama.split(" ")[0];

  document.getElementById("editKelasNama").value = kelas;
  document.getElementById("editKelasTingkat").value = tingkat;
  document.getElementById("editKelasJurusan").value = jurusan;
  document.getElementById("editKelasWali").value = wali;

  // 🔥 jalankan logic seperti form utama
  handleEditTingkat();

  document.getElementById("modalKelas").classList.add("show");
}

function closeModal() {
  document.getElementById("modalKelas").classList.remove("show");
}

function handleEditTingkat() {
  const tingkat = document.getElementById("editKelasTingkat").value;
  const jurusan = document.getElementById("editKelasJurusan");

  if (
    tingkat.includes("SMA") ||
    tingkat.includes("SMK") ||
    tingkat.includes("MA")
  ) {
    jurusan.disabled = false;
    jurusan.placeholder = "Contoh: IPA / IPS / TKJ";
  } else {
    jurusan.value = "";
    jurusan.disabled = true;
    jurusan.placeholder = "Tidak diperlukan";
  }
}

function validasiEditKelas() {
  const kelas = document.getElementById("editKelasNama").value.trim();
  const tingkat = document.getElementById("editKelasTingkat").value;
  const wali = document.getElementById("editKelasWali").value.trim();

  if (!kelas) {
    showToast("Kelas wajib diisi", "warning");
    return false;
  }

  if (!tingkat) {
    showToast("Tingkat wajib dipilih", "warning");
    return false;
  }

  if (!wali) {
    showToast("Wali kelas wajib diisi", "warning");
    return false;
  }

  return true;
}

function updateKelas(btn) {
  if (!validasiEditKelas()) return;

  setLoading(btn, true);

  const kelas = document.getElementById("editKelasNama").value.trim();
  const tingkat = document.getElementById("editKelasTingkat").value;
  const jurusan = document.getElementById("editKelasJurusan").value.trim();
  const wali = document.getElementById("editKelasWali").value.trim();

  apiGet("getKelas").then((list) => {
    // 🔥 VALIDASI DUPLIKAT (exclude diri sendiri)
    if (isDuplicateKelas(list, kelas, tingkat, jurusan, editId)) {
      setLoading(btn, false);
      showToast("Data kelas sudah ada!", "warning");
      return;
    }

    let nama = "";

    if (
      (tingkat.includes("SMA") ||
        tingkat.includes("SMK") ||
        tingkat.includes("MA")) &&
      jurusan
    ) {
      nama = kelas + " " + jurusan.toUpperCase();
    } else {
      nama = kelas;
    }

    const data = {
      action: "updateKelas",
      id: editId,
      nama,
      jurusan,
      tingkat,
      wali,
    };

    apiPost(data)
      .then(() => {
        setLoading(btn, false);
        showToast("Berhasil diupdate", "success");

        closeModal();
        loadKelas();
      })
      .catch(() => {
        setLoading(btn, false);
        showToast("Gagal update", "error");
      });
  });
}

function resetFormKelas() {
  editId = null;

  document.getElementById("kelasNama").value = "";
  document.getElementById("kelasJurusan").value = "";
  document.getElementById("kelasTingkat").value = "";
  document.getElementById("kelasWali").value = "";

  document.getElementById("kelasJurusan").disabled = true;

  document.getElementById("btnSimpanKelas").innerText = "Simpan";
}

function confirmDeleteKelas(id) {
  openDeleteModal("Yakin hapus data kelas ini?", () => {
    deleteKelas(id);
  });
}

function deleteKelas(id) {
  apiPost({
    action: "deleteKelas",
    id: id,
  })
    .then(() => {
      showToast("Berhasil dihapus", "success");
      loadKelas();
    })
    .catch((err) => {
      console.error(err);
      showToast("Gagal hapus", "error");
    });
}

function isDuplicateKelas(dataList, kelas, tingkat, jurusan, excludeId = null) {
  return dataList.some((row) => {
    const id = row[0];
    const nama = String(row[1] || ""); // 🔥 FIX WAJIB
    const jur = String(row[2] || "");
    const ting = String(row[3] || "");

    let kelasRow = String(nama).split(" ")[0];

    if (excludeId && id === excludeId) return false;

    if (
      tingkat.includes("SMA") ||
      tingkat.includes("SMK") ||
      tingkat.includes("MA")
    ) {
      return (
        kelasRow === kelas &&
        ting === tingkat &&
        jur.toUpperCase() === jurusan.toUpperCase()
      );
    } else {
      return kelasRow === kelas && ting === tingkat;
    }
  });
}

const jurusan = document.getElementById("kelasJurusan");

if (jurusan) {
  jurusan.addEventListener("input", (e) => {
    e.target.value = e.target.value.toUpperCase();
  });
}
