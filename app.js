import { normalizeResponse } from "./adapter.js";

const API = "https://backtest-only.vercel.app/api/backtest?days=";

async function run() {
  try {
    const days = document.getElementById("days").value;

    const res = await fetch(API + days);
    const text = await res.text();

    const data = normalizeResponse(text);

    if (!data.trades.length) {
      showError("No trades received");
      return;
    }

    renderStats(data.summary);
    renderTrades(data.trades);
    renderAnalysis(data.trades, data.summary);

  } catch (e) {
    showError("API Failed");
    console.error(e);
  }
}

function showError(msg) {
  document.getElementById("trades").innerHTML =
    `<div style="color:red">${msg}</div>`;
}
