const BASE_URL = "https://backtest-only.vercel.app/api/backtest?days=";

async function runBacktest() {
  const days = document.getElementById("days").value;

  const res = await fetch(BASE_URL + days);
  const data = await res.json();

  renderSummary(data.summary);
  renderTrades(data.trades);
  renderAnalysis(data.trades, data.summary);
}

// ================================
// 📊 SUMMARY
// ================================
function renderSummary(s) {
  document.getElementById("summary").innerHTML = `
    <div class="summary">
      <b>Total:</b> ${s.total} |
      <b>Wins:</b> ${s.wins} |
      <b>Losses:</b> ${s.losses} |
      <b>Winrate:</b> ${s.winrate}%
    </div>
  `;
}

// ================================
// 📦 TRADES
// ================================
function renderTrades(trades) {
  const container = document.getElementById("trades");
  container.innerHTML = "";

  trades.forEach(t => {
    const pnlPoints =
      t.dir === "CALL"
        ? (t.exitPrice - t.entry)
        : (t.entry - t.exitPrice);

    const cls = t.exitType === "TP" ? "win" : "loss";

    const el = document.createElement("div");
    el.className = `card ${cls}`;

    el.innerHTML = `
      <b>${t.dir}</b> | ${t.market}<br/>
      Entry: ${t.entry} (${t.entryTime})<br/>
      Exit: ${t.exitPrice} (${t.exitTime})<br/>
      SL: ${t.sl}<br/>
      RR: ${t.rr}<br/>
      PnL: ${pnlPoints.toFixed(2)} pts
    `;

    container.appendChild(el);
  });
}

// ================================
// 📈 ANALYSIS ENGINE
// ================================
function renderAnalysis(trades, summary) {
  let equity = 0;
  let peak = 0;
  let maxDD = 0;

  let totalPts = 0;
  let wins = 0;
  let losses = 0;

  trades.forEach(t => {
    const pnl =
      t.dir === "CALL"
        ? (t.exitPrice - t.entry)
        : (t.entry - t.exitPrice);

    equity += pnl;
    totalPts += pnl;

    if (equity > peak) peak = equity;

    const dd = peak - equity;
    if (dd > maxDD) maxDD = dd;

    if (pnl > 0) wins++;
    else losses++;
  });

  const avgWin = totalPts / trades.length;

  // 365 projection
  const dailyAvg = totalPts / summary.days;
  const yearly = dailyAvg * 365;

  document.getElementById("analysis").innerHTML = `
    <div class="analysis">
      <b>Total Points:</b> ${totalPts.toFixed(2)}<br/>
      <b>Avg per Trade:</b> ${avgWin.toFixed(2)} pts<br/>
      <b>Max Drawdown:</b> ${maxDD.toFixed(2)} pts<br/>
      <b>365 Projection:</b> ${yearly.toFixed(2)} pts<br/>
    </div>
  `;
}
