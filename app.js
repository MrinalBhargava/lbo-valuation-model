// ── Service worker ──────────────────────────────────────────
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

// ── Data ────────────────────────────────────────────────────
const D = {
  entry: {
    ltm_ebitda: 115.9,
    entry_mult:  9.0,
    entry_ev:    1043.1,
    senior:      405.7,
    mezz:        86.9,
    total_debt:  492.6,
    pe_equity:   581.3,
    leverage:    4.25,
  },
  hist_ebitda: [108.0, 110.8, 115.9],
  hist_years:  ['FY21A', 'FY22A', 'FY23A'],
  proj_years:  ['FY24E', 'FY25E', 'FY26E', 'FY27E', 'FY28E'],
  base_ebitda: [123.7, 132.1, 140.9, 150.3, 160.3],
  mgmt_ebitda: [129.5, 144.5, 160.9, 178.9, 198.7],
  base: {
    rev_growth:  '5.0%',
    margin_lift: '+30bps/yr',
    exit_mult:   9.5,
    y5_ebitda:   160.3,
    exit_ev:     1522.9,
    exit_debt:   158.2,
    exit_equity: 1364.7,
    moic:        2.35,
    irr:         0.186,
  },
  mgmt: {
    rev_growth:  '7.0%',
    margin_lift: '+80bps/yr',
    exit_mult:   10.5,
    y5_ebitda:   198.7,
    exit_ev:     2086.4,
    exit_debt:   115.2,
    exit_equity: 1893.4,
    moic:        3.46,
    irr:         0.282,
  },
  debt_schedule: [
    { yr: 'Y1', open: 492.6, interest: 46.4, repaid: 46.2, close: 446.4 },
    { yr: 'Y2', open: 446.4, interest: 42.4, repaid: 55.5, close: 390.9 },
    { yr: 'Y3', open: 390.9, interest: 37.5, repaid: 65.8, close: 325.1 },
    { yr: 'Y4', open: 325.1, interest: 31.7, repaid: 77.2, close: 247.9 },
    { yr: 'Y5', open: 247.9, interest: 25.0, repaid: 89.7, close: 158.2 },
  ],
  decomp: {
    entry:     581.3,
    ebitda_g:  368.8,
    mult_exp:  80.2,
    debt_pd:   334.4,
    exit:      1364.7,
  },
  // IRR sensitivity — rows = entry mult [7,8,9,10,11], cols = exit mult [7.5,8.5,9.5,10.5,11.5,12.5]
  sens: {
    entry_mults: [7.0, 8.0, 9.0, 10.0, 11.0],
    exit_mults:  [7.5, 8.5, 9.5, 10.5, 11.5, 12.5],
    irr_table: [
      [24.8, 28.4, 31.6, 34.6, 37.2, 39.7],
      [17.7, 21.1, 24.1, 26.9, 29.5, 32.0],
      [12.4, 15.7, 18.6, 21.3, 23.8, 26.1],
      [ 8.3, 11.5, 14.3, 16.8, 19.2, 21.4],
      [ 5.0,  8.0, 10.8, 13.3, 15.5, 17.7],
    ],
  },
};

// ── State ────────────────────────────────────────────────────
const state = { view: 'overview' };

// ── Navigation ───────────────────────────────────────────────
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.view = btn.dataset.view;
    render();
  });
});

// ── Helpers ──────────────────────────────────────────────────
const c = document.getElementById('view-container');
const fmt = n => '£' + n.toFixed(1) + 'm';
const fmtPct = n => (n * 100).toFixed(1) + '%';
const fmtX = n => n.toFixed(2) + 'x';

function render() {
  switch (state.view) {
    case 'overview':    renderOverview();    break;
    case 'returns':     renderReturns();     break;
    case 'debt':        renderDebt();        break;
    case 'sensitivity': renderSensitivity(); break;
  }
}

// ── Overview ─────────────────────────────────────────────────
function renderOverview() {
  const e = D.entry;
  c.innerHTML = `
    <div class="card card-gold">
      <div class="card-title">Transaction Summary</div>
      <div class="stat-grid stat-grid-3">
        <div class="stat-item">
          <div class="stat-value gold">${fmt(e.entry_ev)}</div>
          <div class="stat-label">Entry EV</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${e.entry_mult.toFixed(1)}x</div>
          <div class="stat-label">EV/EBITDA</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${e.leverage.toFixed(2)}x</div>
          <div class="stat-label">Leverage</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-title">Capitalisation</div>
      <div class="lv-row">
        <span class="lv-label">Senior Secured Debt</span>
        <span class="lv-value">${fmt(e.senior)} <small style="color:var(--text-dim);font-weight:400">@ 8.75%</small></span>
      </div>
      <div class="lv-row">
        <span class="lv-label">Mezzanine Debt</span>
        <span class="lv-value">${fmt(e.mezz)} <small style="color:var(--text-dim);font-weight:400">@ 12.50%</small></span>
      </div>
      <div class="lv-row">
        <span class="lv-label">PE Equity</span>
        <span class="lv-value gold">${fmt(e.pe_equity)}</span>
      </div>
      <div class="lv-row">
        <span class="lv-label">LTM EBITDA</span>
        <span class="lv-value">${fmt(e.ltm_ebitda)} <small style="color:var(--text-dim);font-weight:400">(18.0% margin)</small></span>
      </div>
    </div>

    <div class="card">
      <div class="card-title">Investment Thesis</div>
      ${[
        ['Supply Chain',     '<strong>Supplier renegotiation</strong> — volume-based contracts add £5–8m EBITDA by Year 2'],
        ['Digital',         '<strong>App & delivery monetisation</strong> — loyalty programme + aggregator fee restructuring adds £7–14m EBITDA by Year 3'],
        ['International',   '<strong>Franchise expansion</strong> — selective European market entry adds £1.6–3m royalty income by Year 5'],
      ].map(([n, t]) => `
        <div class="thesis-item">
          <div class="thesis-num">★</div>
          <div class="thesis-text">${t}</div>
        </div>`).join('')}
    </div>

    <div class="card">
      <div class="card-title">EBITDA Projection</div>
      ${ebitdaChart()}
    </div>
  `;
}

function ebitdaChart() {
  const all_ebitda = [...D.hist_ebitda, ...D.base_ebitda];
  const max_e = Math.max(...D.mgmt_ebitda);
  const allYears = [...D.hist_years, ...D.proj_years];

  const bars = allYears.map((yr, i) => {
    const isHist = i < D.hist_years.length;
    const pi = i - D.hist_years.length;
    const bVal = isHist ? D.hist_ebitda[i] : D.base_ebitda[pi];
    const mVal = isHist ? null : D.mgmt_ebitda[pi];
    const bH = Math.round((bVal / max_e) * 100);
    const mH = mVal ? Math.round((mVal / max_e) * 100) : 0;
    return `
      <div class="bar-year-group">
        <div class="bar-wrap">
          ${isHist
            ? `<div class="bar hist" style="height:${bH}%"></div>`
            : `<div class="bar base" style="height:${bH}%"></div>
               <div class="bar mgmt" style="height:${mH}%"></div>`}
        </div>
        <div class="bar-label">${yr}</div>
      </div>`;
  }).join('');

  return `
    <div class="bar-chart-legend">
      <div class="legend-item"><span class="legend-dot" style="background:var(--surface-2)"></span>Historical</div>
      <div class="legend-item"><span class="legend-dot" style="background:var(--blue)"></span>Base</div>
      <div class="legend-item"><span class="legend-dot" style="background:var(--gold)"></span>Management</div>
    </div>
    <div class="bar-group">${bars}</div>
    <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--text-dim);margin-top:2px">
      <span>${fmt(D.hist_ebitda[0])}</span>
      <span>${fmt(D.mgmt_ebitda[D.mgmt_ebitda.length-1])}</span>
    </div>`;
}

// ── Returns ──────────────────────────────────────────────────
function renderReturns() {
  const b = D.base, m = D.mgmt, dc = D.decomp;
  const maxWF = dc.exit - dc.entry;

  c.innerHTML = `
    <div class="returns-row">
      ${returnCard('Base Case', b, 'base')}
      ${returnCard('Management', m, 'mgmt')}
    </div>

    <div class="card">
      <div class="card-title">Return Decomposition — Base Case</div>
      <div style="font-size:11px;color:var(--text-dim);margin-bottom:10px">
        How £${dc.entry.toFixed(0)}m of equity becomes £${dc.exit.toFixed(0)}m
      </div>
      ${waterfallRow('Entry Equity',     dc.entry,     dc.exit - dc.entry, 'var(--surface-2)', '#f1f5f9', true)}
      ${waterfallRow('① EBITDA Growth',  dc.ebitda_g,  dc.exit - dc.entry, 'var(--blue)',      '#93c5fd')}
      ${waterfallRow('② Multiple Expansion', dc.mult_exp, dc.exit - dc.entry, 'var(--gold)',    '#fde68a')}
      ${waterfallRow('③ Debt Paydown',   dc.debt_pd,   dc.exit - dc.entry, 'var(--green)',     '#86efac')}
      ${waterfallRow('Exit Equity',      dc.exit,      dc.exit - dc.entry, 'var(--surface-2)', '#f1f5f9', true)}
      <div style="margin-top:10px;font-size:11px;color:var(--text-dim);line-height:1.5">
        Debt paydown (③) represents <strong style="color:var(--green)">${Math.round(dc.debt_pd/(dc.exit-dc.entry)*100)}%</strong>
        of total equity gain — the Modigliani-Miller leverage effect in practice.
      </div>
    </div>

    <div class="card">
      <div class="card-title">MM Tax Shield</div>
      <div class="lv-row">
        <span class="lv-label">Total Debt at Close</span>
        <span class="lv-value">${fmt(D.entry.total_debt)}</span>
      </div>
      <div class="lv-row">
        <span class="lv-label">Tax Rate</span>
        <span class="lv-value">25%</span>
      </div>
      <div class="lv-row">
        <span class="lv-label">PV of Tax Shield</span>
        <span class="lv-value gold">£${(0.25 * D.entry.total_debt).toFixed(1)}m</span>
      </div>
      <div class="lv-row">
        <span class="lv-label">APV = Unlevered EV + Tax Shield</span>
        <span class="lv-value gold">£${(D.entry.entry_ev + 0.25 * D.entry.total_debt).toFixed(1)}m</span>
      </div>
    </div>
  `;
}

function returnCard(label, sc, cls) {
  return `
    <div class="return-card ${cls}">
      <div class="return-case" style="color:var(--text-muted)">${label}</div>
      <div class="return-irr">${fmtPct(sc.irr)}</div>
      <div class="return-moic">${fmtX(sc.moic)} MOIC</div>
      <div class="return-details">
        <div class="return-detail-row">
          <span>Exit EV/EBITDA</span><span>${sc.exit_mult.toFixed(1)}x</span>
        </div>
        <div class="return-detail-row">
          <span>Y5 EBITDA</span><span>${fmt(sc.y5_ebitda)}</span>
        </div>
        <div class="return-detail-row">
          <span>Exit EV</span><span>${fmt(sc.exit_ev)}</span>
        </div>
        <div class="return-detail-row">
          <span>Exit Debt</span><span>${fmt(sc.exit_debt)}</span>
        </div>
        <div class="return-detail-row">
          <span>Exit Equity</span><span>${fmt(sc.exit_equity)}</span>
        </div>
      </div>
    </div>`;
}

function waterfallRow(label, value, maxVal, barColor, textColor, isMeta = false) {
  const pct = Math.round((value / maxVal) * 100);
  const display = isMeta ? fmt(value) : `+${fmt(value)}`;
  return `
    <div class="wf-row">
      <div class="wf-label">${label}</div>
      <div class="wf-bar-wrap">
        <div class="wf-bar" style="width:${Math.min(pct,100)}%;background:${barColor}"></div>
      </div>
      <div class="wf-value" style="color:${textColor}">${display}</div>
    </div>`;
}

// ── Debt ─────────────────────────────────────────────────────
function renderDebt() {
  const ds = D.debt_schedule;
  const maxDebt = D.entry.total_debt;

  const debtBars = [
    { yr: 'Entry', val: maxDebt },
    ...ds.map(r => ({ yr: r.yr, val: r.close }))
  ].map(({ yr, val }) => {
    const h = Math.round((val / maxDebt) * 100);
    return `
      <div class="debt-bar-item">
        <div class="debt-bar-val">${val.toFixed(0)}</div>
        <div class="debt-bar-fill" style="height:${h}%"></div>
        <div class="debt-bar-yr">${yr}</div>
      </div>`;
  }).join('');

  const tableRows = ds.map(r => `
    <tr>
      <td>${r.yr}</td>
      <td>${fmt(r.open)}</td>
      <td class="interest">${fmt(r.interest)}</td>
      <td class="repaid">${fmt(r.repaid)}</td>
      <td class="closing">${fmt(r.close)}</td>
    </tr>`).join('');

  const totalRepaid = ds.reduce((s, r) => s + r.repaid, 0);
  const totalInterest = ds.reduce((s, r) => s + r.interest, 0);

  c.innerHTML = `
    <div class="card">
      <div class="card-title">Debt Paydown (£m)</div>
      <div class="debt-bars">${debtBars}</div>
      <div style="font-size:11px;color:var(--text-dim);margin-top:6px;text-align:center">
        ${fmt(maxDebt)} → ${fmt(ds[ds.length-1].close)} over 5 years
      </div>
    </div>

    <div class="card">
      <div class="card-title">Annual Debt Schedule — Base Case</div>
      <div style="overflow-x:auto">
        <table class="ds-table">
          <thead>
            <tr>
              <th>Year</th>
              <th>Opening</th>
              <th>Interest</th>
              <th>Repaid</th>
              <th>Closing</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
            <tr style="background:var(--surface-2);font-weight:700">
              <td style="color:var(--text)">Total</td>
              <td>—</td>
              <td class="interest">${fmt(totalInterest)}</td>
              <td class="repaid">${fmt(totalRepaid)}</td>
              <td class="closing">${fmt(ds[ds.length-1].close)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="card">
      <div class="card-title">Debt Summary</div>
      <div class="lv-row">
        <span class="lv-label">Entry Leverage</span>
        <span class="lv-value">${D.entry.leverage.toFixed(2)}x EBITDA</span>
      </div>
      <div class="lv-row">
        <span class="lv-label">Exit Leverage (Base)</span>
        <span class="lv-value green">${(D.base.exit_debt / D.base.y5_ebitda).toFixed(2)}x EBITDA</span>
      </div>
      <div class="lv-row">
        <span class="lv-label">Total Debt Repaid</span>
        <span class="lv-value green">${fmt(totalRepaid)}</span>
      </div>
      <div class="lv-row">
        <span class="lv-label">Total Interest Paid</span>
        <span class="lv-value">${fmt(totalInterest)}</span>
      </div>
      <div class="mm-callout">
        <strong>Modigliani-Miller in practice:</strong> Each £1 of debt repaid flows directly to PE equity holders.
        Debt paydown accounts for <strong>${Math.round(D.decomp.debt_pd / (D.decomp.exit - D.decomp.entry) * 100)}%</strong> of total base case equity gain —
        illustrating why high leverage is the defining feature of LBO return generation.
      </div>
    </div>
  `;
}

// ── Sensitivity ──────────────────────────────────────────────
function renderSensitivity() {
  const s = D.sens;

  const headerCells = s.exit_mults.map(x =>
    `<th>${x.toFixed(1)}x</th>`).join('');

  const rows = s.irr_table.map((row, ri) => {
    const em = s.entry_mults[ri];
    const cells = row.map((irr, ci) => {
      const xm = s.exit_mults[ci];
      const cls = irrClass(irr);
      const isBase = Math.abs(em - 9.0) < 0.01 && Math.abs(xm - 9.5) < 0.01;
      return `<td class="${cls}${isBase ? ' sens-base' : ''}">${irr.toFixed(1)}%</td>`;
    }).join('');
    return `<tr><th>${em.toFixed(1)}x</th>${cells}</tr>`;
  }).join('');

  c.innerHTML = `
    <div class="card">
      <div class="card-title">IRR Sensitivity — Entry vs Exit EV/EBITDA</div>
      <div style="font-size:11px;color:var(--text-dim);margin-bottom:10px">
        Base case highlighted (9.0x entry / 9.5x exit). Assumes Base Case operating model.
      </div>
      <div class="sens-wrap">
        <table class="sens-table">
          <thead>
            <tr>
              <th>Entry ↓ / Exit →</th>
              ${headerCells}
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <div class="sens-legend">
        <div class="sens-legend-item">
          <div class="sens-legend-swatch irr-high"></div> ≥30%
        </div>
        <div class="sens-legend-item">
          <div class="sens-legend-swatch irr-good"></div> 20–30%
        </div>
        <div class="sens-legend-item">
          <div class="sens-legend-swatch irr-mid"></div> 15–20%
        </div>
        <div class="sens-legend-item">
          <div class="sens-legend-swatch irr-low"></div> 10–15%
        </div>
        <div class="sens-legend-item">
          <div class="sens-legend-swatch irr-poor"></div> &lt;10%
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-title">Key Observations</div>
      <div class="thesis-item">
        <div class="thesis-num" style="background:var(--green);color:#000">✓</div>
        <div class="thesis-text">
          At entry of <strong>9.0x</strong>, the deal clears the 20% IRR hurdle
          at any exit multiple above <strong>10.5x</strong>.
        </div>
      </div>
      <div class="thesis-item">
        <div class="thesis-num" style="background:var(--gold);color:#000">!</div>
        <div class="thesis-text">
          Even a <strong>compressed exit at 7.5x</strong> (9.0x entry) still
          delivers 12.4% — protecting downside via the FCF debt sweep.
        </div>
      </div>
      <div class="thesis-item">
        <div class="thesis-num" style="background:var(--blue);color:#fff">↓</div>
        <div class="thesis-text">
          Buying at <strong>7.0x entry</strong> (distressed scenario) generates
          >25% IRR at virtually any exit — leverage magnification at maximum.
        </div>
      </div>
    </div>
  `;
}

function irrClass(irr) {
  if (irr >= 30) return 'irr-high';
  if (irr >= 20) return 'irr-good';
  if (irr >= 15) return 'irr-mid';
  if (irr >= 10) return 'irr-low';
  return 'irr-poor';
}

// ── Init ─────────────────────────────────────────────────────
render();
