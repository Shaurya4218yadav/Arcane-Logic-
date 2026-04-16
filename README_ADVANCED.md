# VayuGuard Advanced Features

This project has been enhanced with enterprise-grade fraud detection, predictive analytics, and instant payout systems.

## 🧠 1. Advanced Fraud Detection (ML Layer)
- **Model**: Isolation Forest (Anomaly Detection)
- **Features**: GPS coordinates, weather mismatch, behavioral patterns, and claim frequency.
- **Logic**: Detects GPS spoofing and historical weather mismatches using the `FraudDetector` class.

## 📊 2. Intelligent Dashboard (Admin & Worker)
- **Worker Dashboard**: Real-time income stabilization tracking with a "Next Week Forecast" powered by Linear Regression/XGBoost.
- **Admin Command Center**: Global loss-ratio monitoring, fraud rate heatmaps, and AI-driven portfolio health alerts.
- **Visualization**: Built with Recharts for premium, responsive analytics.

## 💸 3. Instant Payout System (Simulated)
- **Automation**: Fully integrated into the "Zero-Touch" pipeline.
- **Integration**: Simulated Razorpay API for immediate UPI credits upon claim approval.
- **Audit Logs**: Every payout is logged with detailed "Why Payout was Triggered" justification.

## 🌍 4. Chennai-Specific Intelligence
- **Scenarios**: Floods, Heatwaves, Waterlogging, and Area Shutdowns.
- **Hyperlocal**: Zone-based risk assessment (Adyar, Velachery, etc.)

---
**Tech Stack**: Next.js 14, FastAPI, scikit-learn, XGBoost, Recharts, Lucide React.
