// ============================
// LOAD DATA KELAS
// ============================

function loadKelas() {
  apiGet("getKelas")
    .then((data) => {
      const tbody = document.querySelector("#tableKelas tbody");
      tbody.innerHTML = "";

      data.forEach((row) => {
        const tr = `
          <tr>
            <td>${row[1]}</td>
            <td>${row[2]}</td>
            <td>${row[3]}</td>
            <td>${row[4]}</td>
          </tr>
        `;
        tbody.innerHTML += tr;
      });
    })
    .catch((err) => {
      console.error(err);
      showToast("Gagal load data", "error");
    });
}

// ============================
// SIMPAN KELAS
// ============================
function simpanKelas(btn) {
  if (!CONFIG || !CONFIG.API_URL) {
    console.error("API_URL belum tersedia!");
    showToast("Config error", "error");
    return;
  }

  setLoading(btn, true);

  const data = {
    action: "simpanKelas",
    nama: document.getElementById("kelasNama").value.trim(),
    jurusan: document.getElementById("kelasJurusan").value.trim(),
    tingkat: document.getElementById("kelasTingkat").value.trim(),
    wali: document.getElementById("kelasWali").value.trim(),
  };

  apiPost(data)
    .then(() => {
      // 🔥 karena no-cors → gak bisa baca response
      setLoading(btn, false);
      showToast("Berhasil disimpan", "success");

      // reset form
      document.getElementById("kelasNama").value = "";
      document.getElementById("kelasJurusan").value = "";
      document.getElementById("kelasTingkat").value = "";
      document.getElementById("kelasWali").value = "";

      loadKelas();
    })
    .catch((err) => {
      setLoading(btn, false);
      showToast("Server error", "error");
      console.error(err);
    });
}
