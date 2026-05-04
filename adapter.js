export function normalizeResponse(rawText) {
  try {
    // try direct JSON
    const data = JSON.parse(rawText);

    let trades = data.trades;

    // case 1: trades string है
    if (typeof trades === "string") {
      try {
        trades = JSON.parse(trades);
      } catch {
        trades = [];
      }
    }

    return {
      summary: data.summary || {},
      trades: trades || []
    };

  } catch {
    console.error("❌ RAW PARSE FAIL");

    return {
      summary: {},
      trades: []
    };
  }
}
