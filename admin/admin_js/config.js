const CONFIG = {
  API_URL:
    "https://script.google.com/macros/s/AKfycbwQG8Lc2mg58-t5E3vtpOgtu8-XSn0AdkcJhnne4S8ullVsWR-eSQtv52lwnm-8OcmX/exec",
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
