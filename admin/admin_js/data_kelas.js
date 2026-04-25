// ============================
// LOAD DATA KELAS
// ============================

function loadKelas() {
  fetch(CONFIG.API_URL + "?action=getKelas")
    .then((res) => res.json())
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

  fetch(CONFIG.API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((res) => {
      setLoading(btn, false);

      if (res.status === "success") {
        showToast("Berhasil disimpan", "success");

        // reset form 🔥
        document.getElementById("kelasNama").value = "";
        document.getElementById("kelasJurusan").value = "";
        document.getElementById("kelasTingkat").value = "";
        document.getElementById("kelasWali").value = "";

        loadKelas();
      } else {
        showToast("Gagal simpan", "error");
      }
    })
    .catch((err) => {
      setLoading(btn, false);
      showToast("Server error", "error");
      console.error(err);
    });
}
