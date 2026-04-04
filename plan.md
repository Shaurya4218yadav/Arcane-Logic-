You are a senior systems architect and product engineer working on VayuGuard for the Guidewire DEVTrails hackathon.

Your task is to refine and extend the existing system for Phase 2: "Protect Your Worker", ensuring strict alignment with the hackathon requirements while introducing a strong, original differentiator.

IMPORTANT: This is NOT a new project. You must build on top of an existing implementation.

---

## ⚠️ CRITICAL CONSTRAINT — DO NOT BREAK EXISTING SYSTEM

* The project already contains core logic, UI, and architecture.
* You do NOT have full visibility into all existing components.

### Rules:

1. DO NOT remove or rewrite existing working features
2. DO NOT change core architecture unnecessarily
3. DO NOT rename or break existing flows
4. ONLY extend and enhance the current system
5. If unsure → assume it is critical and DO NOT modify

### Approach:

* Add new features as layers
* Use wrappers, additional logic, or extensions
* Preserve all existing functionality

---

## 🎯 CORE REQUIREMENT ALIGNMENT (MANDATORY)

Ensure the system clearly demonstrates:

1. Worker Registration (fast onboarding)
2. Policy Management dashboard
3. Dynamic Premium Calculation (AI-driven)
4. Zero-touch Claims (auto trigger → payout)
5. 3–5 Parametric Triggers
6. Fraud Detection (multi-layer)

All of these MUST be visible in the UI/demo.

---

## 🔥 UNIQUE DIFFERENTIATOR (CRITICAL)

Introduce:

### Dynamic Earnings Floor (Income Stabilization)

Instead of only compensating loss:

* Predict weekly earnings (e.g., ₹4200)
* Define guaranteed minimum floor (e.g., ₹3000)
* Detect when disruption reduces earnings below floor
* Automatically calculate gap
* Trigger payout to maintain income stability

---

## ⚙️ UPDATED CORE FLOW

Replace traditional flow with:

Predicted Earnings → Disruption Detected → Earnings Drop → Floor Breach → Gap Calculation → Auto Payout

This must be visible in the simulation.

---

## 🧠 AI/ML INTEGRATION (MAKE IT EXPLICIT)

Implement clearly defined logic:

### 1. Risk Model

Inputs:

* Location (city-level)
* Historical disruption patterns
* Time-of-day / shift patterns

Output:

* Weekly disruption probability

---

### 2. Dynamic Pricing

* Premium adjusts between ₹40–₹65
* Based on risk score
* Show reasoning (e.g., “High flood-risk zone”)

---

### 3. Fraud Detection (Trust Engine)

Trust Score (0–100) using:

* Motion validation
* Behavioral patterns
* Hyperlocal cluster validation (500m)
* Network validation (VPN/proxy detection)
* Coordinated fraud detection (multi-user anomalies)

---

### 4. Claim Validation

Trigger ONLY if:

* Weather threshold met
* Platform activity drops
* Worker behavior deviates

---

## ⚡ ZERO-TOUCH CLAIM SYSTEM (IMPORTANT)

Implement a visible pipeline:

1. Event Engine detects disruption
2. Risk Engine evaluates severity
3. Earnings Engine calculates expected vs actual
4. Trust Engine validates authenticity
5. Claims Engine triggers payout

Display this as:
→ step-by-step system log or UI flow

---

## 🌍 REGIONAL FOCUS

Fix the system to:

👉 CHENNAI

Include:

* flood-prone zones
* heat alerts
* water logging scenarios

Use realistic mock data.

---

## 💸 PAYMENT EXPERIENCE

* Simulate UPI payout
* Show simple message:

"₹400 credited to your account"

NO complex animation.

---

## ⚖️ COMPLIANCE & AUDIT LAYER (VERY IMPORTANT)

Add a visible compliance system:

* Log every payout decision
* Show "Why payout was triggered"
* Maintain audit trail
* Prevent abuse with rule validation

Example:

"Claim approved: Rain > threshold + inactivity detected + trust score 88"

---

## 📊 DASHBOARD UPDATES

Add or enhance:

1. Earnings Floor Card:

   * Predicted earnings
   * Guaranteed floor
   * Current earnings
   * Gap covered

2. Trust Score

3. Active disruption status

4. Last payout + reason

---

## 🧾 MICROCOPY IMPROVEMENT

Replace generic terms:

* "Simulation" → "Disruption Impact"
* "Claim" → "Auto Adjustment"
* "Payout" → "Income Stabilization Payment"

---

## ⚠️ REMOVE GENERIC ELEMENTS

* No vague AI statements
* No unnecessary UI clutter
* No template-like features

Everything must tie to:
→ income loss
→ disruption
→ payout

---

## 🎯 FINAL OUTPUT

Return:

1. Updated implementation plan
2. Required UI changes
3. Simulation logic flow
4. Clear AI explanation (no buzzwords)

---

## 🚀 GOAL

Make VayuGuard feel like:

* A real production-grade system
* A differentiated product
* NOT a generic hackathon insurance clone