const CONFIG = {
  API_URL:
    "https://script.google.com/macros/s/AKfycbwo70dYMpPsQqXa3c5O0YcaeuUmA6ROS84AIQrgjCKicJxGwaGKF1rM9Q75gyEpd4_i/exec",
  MODE: "no-cors", // 🔥 WAJIB
};

function apiPost(data) {
  return fetch(CONFIG.API_URL, {
    method: "POST",
    mode: CONFIG.MODE,
    body: JSON.stringify(data),
  });
}

function apiGet(action) {
  return fetch(CONFIG.API_URL + "?action=" + action).then((res) => res.json());
}
