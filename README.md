#  VayuGuard | AI-Powered Parametric Income Protection

## Executive Summary

VayuGuard is an AI-powered parametric insurance platform designed for India’s Q-commerce delivery ecosystem. It protects delivery partners from income loss caused by external disruptions such as extreme weather, environmental conditions, and localized shutdowns.

Unlike traditional insurance, VayuGuard uses an **event-driven, multi-signal architecture** to automatically detect disruptions, validate claims, and trigger instant payouts—without requiring manual claim filing.

---

## Persona: The Hyper-Local Partner (Arpit)

* 23-year-old Q-commerce delivery partner (Zepto/Blinkit)
* Operates within a 3km dark-store radius in Tier-1 cities
* Highly dependent on daily incentive slabs

### Problem

A 60–120 minute disruption (flood, heatwave, protest) breaks his incentive cycle, leading to **20–30% income loss**

### Requirement

A **zero-touch, weekly-priced safety net** aligned with his earnings cycle and working behavior

---

## System Architecture (Event-Driven Modular Design)

The system is event-driven, where external disruptions act as triggers that propagate through risk, fraud, and claims engines in real time.

* **Policy Engine** → Weekly coverage cycles and premium management
* **Risk Engine** → Dynamic pricing using XGBoost (simulated)
* **Event Engine** → Continuous ingestion of external data streams (weather APIs, traffic signals, and platform activity patterns)
* **Fraud Engine** → Multi-layer trust scoring system
* **Claims Engine** → Deterministic rules-based automated settlement and instant payout simulation
* **Dashboard** → Worker + insurer analytics

---

## Financial Model (Weekly Co-Premium Model)

We use a **co-contribution (B2B2C) model** to balance affordability and platform incentives.

* **Base Premium**: ₹50/week
* **Dynamic Range**: ₹40–₹65/week

### Contribution Split:

* **Worker Pays**: ₹35/week
* **Platform Subsidy**: ₹5–₹30/week

> This ensures affordability for workers while enabling platforms (Zepto/Blinkit) to reduce churn and stabilize workforce availability.

---

### Actuarial Logic

Expected Payout = Weekly Earnings × Disruption Probability × Expected Loss %

### Example:

* Weekly Earnings: ₹2,500
* Disruption Probability: 20%
* Expected Loss: 30%
  → Expected Payout: ₹150
  → Premium Range: ₹50–₹60

### Risk Controls

* Maximum payout capped at **30–40% of verified historical earnings**
* Platform subsidy acts as a **risk buffer during high-frequency disruption periods**

---

## ⚡ Multi-Signal Parametric Trigger

A payout is triggered only when **environmental, platform, and behavioral signals converge**, ensuring no single manipulated input can trigger a claim.

### Signals Used:

1. **Environmental Signal**

   * Rainfall >15mm/hr OR Heat >45°C

2. **Platform Activity Signal**

   * Simulated delivery drop (>30%) using synthetic patterns calibrated to real-world benchmarks
   * In production, integrates directly with platform APIs

3. **Behavioral Signal**

   * Worker inactivity deviates significantly from historical working patterns

### Fail-Safe Mechanism

If external APIs fail, the system increases reliance on **behavioral and hyperlocal consensus signals**

---

##  Adversarial Defense & Anti-Spoofing Strategy

###  The Threat: Coordinated GPS-Spoofing Syndicates

Organized fraud groups exploit parametric insurance systems by spoofing GPS locations to appear in disruption zones, triggering false payouts at scale.

---

###  Our Approach: Multi-Layer Trust Engine

> Each signal alone is unreliable. The system only acts on cross-signal agreement.

---

###  Layer 1: Physical Validation

* Motion pattern analysis (accelerometer/gyroscope)

###  Layer 2: Environmental Validation

* Hyperlocal consensus (10–20 workers within 500m)

###  Layer 3: Behavioral Intelligence

* Earnings consistency checks
* Pre-disruption activity validation
* Time-to-claim analysis

###  Layer 4: Coordinated Fraud Detection

* Detects claim bursts
* Identifies fraud networks using clustering

> The system detects not just fraudulent users, but fraud networks.

---

###  Layer 5: Active Verification (Photo/Video Proof)

* Triggered for **medium-risk claims**
* User uploads a short (5-second) video of surroundings
* System validates:

  * Metadata (timestamp/location consistency)
  * Basic liveness signals

> This ensures real-world presence before payout escalation.

---

### Trust Score System

* **85+ → Instant payout**
* **50–84 → Partial payout + video verification**
* **<50 → Flagged**

Trust scores are recalibrated continuously to prevent long-term gaming.

---

## Why This Is Hard to Game

* No single signal triggers payout
* Multi-layer validation across independent systems
* Hyperlocal (500m) verification
* Behavioral + economic consistency checks
* Active verification for suspicious claims
* Detection of coordinated fraud networks

---

## 60-Second Onboarding (PWA)

1. Phone OTP login
2. Select delivery platform
3. Coverage preview
4. One-tap permissions

> “Protect up to 30% of your weekly income for ₹35.”

### Privacy Note

We only use data to verify work activity during disruptions.

---

## Dashboard

### Worker View:

* Weekly earnings vs protected income
* Active coverage
* Claim history
* Trust score

### Insurer View:

* Loss ratios
* High-risk zones
* Disruption forecasts

---

## Tech Stack

* Frontend: Next.js + Tailwind
* Backend: FastAPI (simulated)
* Database: Supabase (PostgreSQL + PostGIS)
* AI (Simulated): XGBoost, Isolation Forest, CNN

---

## Real-World Viability

* Built for low-end devices (PWA)
* Weekly pricing aligns with gig cash flow
* Co-premium model improves retention
* Ready for API integration

---

## Conclusion

VayuGuard transforms insurance into a **real-time income stabilization system for gig workers**.
