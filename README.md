# LBO Valuation Model — Domino's Pizza Group PLC

**Private Equity Acquisition Analysis | Illustrative | June 2026**

A full leveraged buyout (LBO) model built from scratch for Domino's Pizza Group PLC (AIM: DOM), the UK's leading pizza delivery franchise operator. The model integrates Discounted Cash Flow exit valuation, Modigliani-Miller capital structure theory, and private equity deal mechanics across five phases.

---

## Files

| File | Description |
|------|-------------|
| `LBO_Dominos_Pizza_Group.xlsx` | Full five-tab Excel model |
| `IC_Memo_LBO_Dominos_Pizza_Group.docx` | Investment Committee memorandum |

---

## Model Structure (Excel Tabs)

### 1. Cover
Key transaction metrics, projected returns summary, and workbook contents index.

### 2. Assumptions
All model inputs in one place — no hardcoded numbers elsewhere:
- **Operating:** revenue growth (Base 5.0%, Mgmt 7.0%), EBITDA margin improvement, D&A, CapEx, tax rate
- **Transaction:** entry EV/EBITDA (9.0x), hold period (5 years), exit multiples
- **Debt pricing:** Senior Secured @ SONIA+350bps (8.75%), Mezzanine @ 12.50%
- **Modigliani-Miller:** PV of tax shield = Tax Rate × Total Debt

### 3. Operating Model
- 3 years of historical financials (FY2021–FY2023, illustrative from public filings)
- 5-year projection under **Base Case** and **Management Case**
- Full FCF bridge: EBITDA → CapEx → Cash Tax → Cash Interest → Levered FCF

### 4. Deal Structure
- **Sources & Uses** table (Total Sources = Total Uses, verified to balance)
- **MM Analysis:** APV = Unlevered Firm Value + PV(Tax Shield) — demonstrating why leverage adds value
- **Annual Debt Schedule:** FCF sweep applied senior-first each year; shows full deleveraging path

### 5. Returns
- IRR and MOIC under both scenarios
- **Return decomposition** — equity gain split into three drivers:
  1. EBITDA growth (operational value creation)
  2. Multiple expansion (market re-rating)
  3. Debt paydown (MM leverage / financial engineering)
- **Sensitivity table:** IRR vs entry EV/EBITDA × exit EV/EBITDA (colour-coded: green ≥20%, blue 15–20%)

---

## Key Outputs

|  | Base Case | Management Case |
|--|-----------|-----------------|
| Entry EV | £1,043m @ 9.0x EBITDA | same |
| PE Equity | £581m | same |
| Year 5 EBITDA | £160m | £199m |
| Exit Multiple | 9.5x | 10.5x |
| Exit Equity | £1,365m | £1,893m |
| **MOIC** | **2.35x** | **3.46x** |
| **IRR** | **18.6%** | **28.2%** |

Base case sits just below the 20% PE hurdle — a deliberately conservative floor. Management case (all three value creation initiatives executed) generates returns materially above the threshold.

---

## Investment Thesis (Summary)

Domino's is a capital-light franchise business with >99% UK brand recognition and an embedded royalty income stream. PE ownership unlocks three value levers:

1. **Supply chain renegotiation** — volume-based supplier contracts add ~£5–8m EBITDA by Year 2
2. **Digital monetisation** — loyalty programme and aggregator fee restructuring adds c.£7–14m EBITDA by Year 3
3. **International franchise expansion** — selective European market entry adds £1.6–3.0m royalty income by Year 5

Exit via dual-track process (trade sale / secondary buyout) to global QSR platforms or large-cap consumer PE funds.

---

## Methodology Notes

- **Financials:** Based on publicly available annual reports; simplified and labelled as illustrative for modelling purposes
- **WACC / Debt Pricing:** Senior rate = Bank of England SONIA (5.25%) + 350bps spread; Mezz = 12.50% fixed
- **IRR Approximation:** `MOIC^(1/hold period) - 1` (equivalent to `=IRR()` with terminal cash flow at Year 5)
- **Tax Shield:** MM Proposition I with corporate taxes — `PV(Tax Shield) = Tax Rate × Debt`
- **FCF Sweep:** 100% of levered FCF applied to debt repayment, senior tranche first
- **Return Decomposition:** Waterfall bridge isolating EBITDA growth, multiple expansion, and debt paydown as discrete drivers

---

## Related Projects

- [M&A Valuation Model — LSEG/ICE Acquisition](https://github.com/MrinalBhargava/habit-tracker) *(Project 1: DCF, three-statement model, M&A deal mechanics)*
- [Python Multi-Asset Stock Screener](https://github.com/MrinalBhargava) *(quantitative equity screening tool)*

---

*Built by Mrinal Bhargava as part of a structured finance supercurricular programme targeting degree apprenticeships at Goldman Sachs, JPMorgan, and Rothschild & Co.*
