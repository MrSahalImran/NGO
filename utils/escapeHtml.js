/**
 * Escape user-provided text before interpolating it into an HTML email body.
 * Prevents HTML/link injection (phishing) in the messages we send to admins
 * and donors. Use this for every value that originates from a request body.
 */
function escapeHtml(value) {
  if (value === undefined || value === null) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

module.exports = { escapeHtml };
