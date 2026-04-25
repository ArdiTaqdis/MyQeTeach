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
