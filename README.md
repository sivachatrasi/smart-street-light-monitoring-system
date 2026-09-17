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
🛠️ Technologies Used
C++ – Simulation and automation logic
HTML – Dashboard structure
CSS – Dashboard styling
JavaScript – Dashboard functionality
CSV – Simulation data storage
VS Code – Development environment
Git & GitHub – Version control
📊 Energy Monitoring

The system calculates the power consumed by each street light based on its brightness level.

FULL brightness → 68 W
DIM brightness → 27 W
OFF → 0 W

The system uses these values to monitor total power consumption and calculate energy savings.

🚨 Fault Detection

The system detects faults by comparing:

Expected Status ≠ Actual Status

For example:

Expected: OFF
Actual:   DIM
Fault:    YES

This allows the system to identify street lights that are not behaving as expected.

📁 Project Structure
smart-street-light-monitoring-system/
│
├── street_light.cpp
├── index.html
├── style.css
├── script.js
├── street_light_data.csv
├── street_light_log.txt
└── README.md
▶️ How to Run
1. Compile the C++ program

Open the project folder in VS Code and run:

g++ street_light.cpp -o street_light
2. Run the simulation
./street_light

On Windows PowerShell:

.\street_light.exe
3. Run the Dashboard

Open:

index.html

in a browser.

The dashboard reads the generated CSV data and displays the simulated street light information.

💻 Project Type

Software-based IoT Simulation

No physical Arduino, ESP32, or sensors are required. The project uses simulated sensor values to demonstrate how a smart street lighting system can operate.

🔮 Future Enhancements
Integration with real ESP32/Arduino hardware
Real LDR and PIR sensors
Cloud-based IoT monitoring
Mobile application
Real-time notifications
GPS-based fault location
Historical energy analytics
Remote street light control
👩‍💻 Author

Satwika

Built as a C++ + IoT based portfolio project demonstrating automation, monitoring, data logging, and fault detection.

⭐ If you find this project interesting, feel free to explore the code and dashboard.


### Then upload it

In PowerShell:

```powershell
git add README.md
git commit -m "Add project README"
