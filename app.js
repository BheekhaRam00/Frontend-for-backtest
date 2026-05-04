const API = "https://backtest-only.vercel.app/api/backtest?days=30";

async function run() {
  const days = document.getElementById("days").value;

  const res = await fetch(API + days);
  const raw = await res.json();

  // 🔥 FIX: parse trades if string
  let trades = raw.trades;

  if (typeof trades === "string") {
    try {
      trades = JSON.parse(trades);
    } catch {
      console.error("Parse error");
      trades = [];
    }
  }

  renderStats(raw.summary);
  renderTrades(trades);
  renderAnalysis(trades, raw.summary);
}

// ====================
// 📊 STATS
// ====================
function renderStats(s) {
  document.getElementById("stats").innerHTML = `
    <div class="stats">
      <div class="stat">Total<br>${s.total}</div>
      <div class="stat">Wins<br>${s.wins}</div>
      <div class="stat">Losses<br>${s.losses}</div>
      <div class="stat">Winrate<br>${s.winrate}%</div>
    </div>
  `;
}

// ====================
// 📦 TRADES
// ====================
function renderTrades(trades) {
  const el = document.getElementById("trades");
  el.innerHTML = "";

  trades.forEach(t => {
    const pnl =
      t.dir === "CALL"
        ? t.exitPrice - t.entry
        : t.entry - t.exitPrice;

    const cls = t.exitType === "TP" ? "win" : "loss";

    const div = document.createElement("div");
    div.className = `card ${cls}`;

    div.innerHTML = `
      <b>${t.dir} (${t.market})</b><br/>
      🟢 Entry: ${t.entry}<br/>
      🔴 Exit: ${t.exitPrice}<br/>
      ⏱ ${t.entryTime} → ${t.exitTime}<br/>
      📉 SL: ${t.sl}<br/>
      🎯 RR: ${t.rr}<br/>
      💰 PnL: ${pnl.toFixed(2)} pts
    `;

    el.appendChild(div);
  });
}

// ====================
// 📈 ANALYSIS
// ====================
function renderAnalysis(trades, summary) {
  let equity = 0, peak = 0, dd = 0, total = 0;

  trades.forEach(t => {
    const pnl =
      t.dir === "CALL"
        ? t.exitPrice - t.entry
        : t.entry - t.exitPrice;

    equity += pnl;
    total += pnl;

    if (equity > peak) peak = equity;
    const d = peak - equity;
    if (d > dd) dd = d;
  });

  const yearly = (total / summary.days) * 365;

  document.getElementById("analysis").innerHTML = `
    <div class="analysis">
      📊 Total Points: ${total.toFixed(2)}<br/>
      📉 Max DD: ${dd.toFixed(2)}<br/>
      🚀 Year Projection: ${yearly.toFixed(2)} pts
    </div>
  `;
}
