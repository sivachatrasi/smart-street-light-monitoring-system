# Smart Street Light Monitoring & Automation System 💡

An IoT-based smart street light monitoring and automation system developed using **C++ and a web dashboard**.

The project simulates a network of street lights using virtual light and motion sensors. Based on the sensor readings, each street light automatically switches between **OFF, DIM, and FULL brightness** while monitoring energy consumption and detecting faults.

---

## 🚀 Features

- 💡 Automated street light control
- 🌙 Virtual ambient light (LUX) sensor
- 🚶 Virtual motion detection
- 🔆 OFF / DIM / FULL brightness control
- ⚡ Power consumption monitoring
- 🌱 Energy-saving calculation
- 🚨 Automatic fault detection
- 📊 Energy and performance monitoring
- 📝 CSV data logging
- 📄 Simulation log generation
- 🌐 Interactive web dashboard
- 💻 C++ based IoT simulation

---

## ⚙️ How It Works

The system simulates multiple street lights with virtual sensors.

### Lighting Logic

| Condition | Light Status |
|---|---|
| Sufficient ambient light | OFF |
| Low light + No motion | DIM |
| Low light + Motion detected | FULL |

The system compares the **expected light status** with the **actual simulated status**.

If they are different, the system identifies it as a **fault**.

---

## 🏗️ System Architecture

```text
Virtual Sensors
      ↓
C++ Simulation Engine
      ↓
Lighting Decision Logic
      ↓
OFF / DIM / FULL
      ↓
Power & Energy Monitoring
      ↓
Fault Detection
      ↓
CSV / Log Files
      ↓
Web Dashboard
