// ===============================
// GLOBAL SKELETON
// ===============================

function showTableSkeleton(tableId, rows = 5) {
  const tbody = document.querySelector(`#${tableId} tbody`);
  if (!tbody) return;

  tbody.innerHTML = "";

  let html = "";

  for (let i = 0; i < rows; i++) {
    html += `
      <tr>
        <td><div class="skeleton skeleton-text"></div></td>
        <td><div class="skeleton skeleton-text"></div></td>
        <td><div class="skeleton skeleton-text"></div></td>
        <td><div class="skeleton skeleton-text"></div></td>
        <td><div class="skeleton skeleton-box"></div></td>
      </tr>
    `;
  }

  tbody.innerHTML = html;
}
