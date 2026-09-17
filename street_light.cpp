#include <iostream>
#include <cstdlib>
#include <ctime>
#include <fstream>
using namespace std;

struct StreetLight {
    int id;
    int lux;
    bool motion;

    string expectedStatus;
    string actualStatus;

    int brightness;
    int power;

    bool fault;
};

int main() {

    srand(time(0));

    StreetLight lights[8];

    float totalEnergy = 0;
    int totalFaults = 0;
    int choice;

    do {

        cout << "\n\n============================================\n";
        cout << "       SMART STREET LIGHT SYSTEM\n";
        cout << "============================================\n";
        cout << "1. Run Simulation\n";
        cout << "2. View Energy Report\n";
        cout << "3. View Fault Report\n";
        cout << "4. Exit\n";

        cout << "\nEnter choice: ";
        cin >> choice;


        // ==========================================
        // OPTION 1: RUN SIMULATION
        // ==========================================

        if (choice == 1) {

            ofstream logFile("street_light_log.txt", ios::app);
            ofstream csvFile("street_light_data.csv", ios::app);

            // Add CSV header if file is empty
            if (csvFile.tellp() == 0) {
                csvFile << "Cycle,LightID,Lux,Motion,Expected,Actual,"
                        << "Brightness,Power,Fault\n";
            }

            cout << "\nRunning simulation...\n";


            // Run 5 simulation cycles
            for (int cycle = 1; cycle <= 5; cycle++) {

                cout << "\n\n============================================\n";
                cout << "           SIMULATION CYCLE " << cycle << "\n";
                cout << "============================================\n";

                logFile << "\nSIMULATION CYCLE " << cycle << "\n";


                // ==========================================
                // GENERATE DATA FOR 8 STREET LIGHTS
                // ==========================================

                for (int i = 0; i < 8; i++) {

                    lights[i].id = i + 1;

                    // Virtual sensors
                    lights[i].lux = rand() % 101;
                    lights[i].motion = rand() % 2;


                    // ==========================================
                    // DETERMINE EXPECTED BEHAVIOUR
                    // ==========================================

                    if (lights[i].lux > 50) {

                        lights[i].expectedStatus = "OFF";

                    }
                    else if (lights[i].motion) {

                        lights[i].expectedStatus = "FULL";

                    }
                    else {

                        lights[i].expectedStatus = "DIM";
                    }


                    // Initially actual behaviour is correct
                    lights[i].actualStatus =
                        lights[i].expectedStatus;


                    // ==========================================
                    // SIMULATE OCCASIONAL MALFUNCTION
                    // ==========================================

                    if (rand() % 10 == 0) {

                        if (lights[i].expectedStatus == "FULL") {

                            lights[i].actualStatus = "OFF";

                        }
                        else if (lights[i].expectedStatus == "DIM") {

                            lights[i].actualStatus = "OFF";

                        }
                        else {

                            lights[i].actualStatus = "DIM";
                        }
                    }


                    // ==========================================
                    // POWER CALCULATION
                    // ==========================================

                    if (lights[i].actualStatus == "FULL") {

                        lights[i].brightness = 100;
                        lights[i].power = 68;

                    }
                    else if (lights[i].actualStatus == "DIM") {

                        lights[i].brightness = 40;
                        lights[i].power = 27;

                    }
                    else {

                        lights[i].brightness = 0;
                        lights[i].power = 0;
                    }


                    // ==========================================
                    // FAULT DETECTION
                    // ==========================================

                    if (lights[i].expectedStatus !=
                        lights[i].actualStatus) {

                        lights[i].fault = true;
                        totalFaults++;

                    }
                    else {

                        lights[i].fault = false;
                    }


                    // ==========================================
                    // DISPLAY DATA
                    // ==========================================

                    cout << "\nL0" << lights[i].id;

                    cout << " | Lux: "
                         << lights[i].lux;

                    cout << " | Motion: "
                         << (lights[i].motion ? "YES" : "NO");

                    cout << " | Expected: "
                         << lights[i].expectedStatus;

                    cout << " | Actual: "
                         << lights[i].actualStatus;

                    cout << " | Brightness: "
                         << lights[i].brightness << "%";

                    cout << " | Power: "
                         << lights[i].power << " W";

                    cout << " | Fault: "
                         << (lights[i].fault ? "YES" : "NO");


                    // ==========================================
                    // TEXT LOGGING
                    // ==========================================

                    logFile << "L0" << lights[i].id
                            << " | Lux: " << lights[i].lux
                            << " | Motion: "
                            << (lights[i].motion ? "YES" : "NO")
                            << " | Expected: "
                            << lights[i].expectedStatus
                            << " | Actual: "
                            << lights[i].actualStatus
                            << " | Brightness: "
                            << lights[i].brightness << "%"
                            << " | Power: "
                            << lights[i].power << " W"
                            << " | Fault: "
                            << (lights[i].fault ? "YES" : "NO")
                            << "\n";


                    // ==========================================
                    // CSV LOGGING
                    // ==========================================

                    csvFile << cycle << ","
                            << "L0" << lights[i].id << ","
                            << lights[i].lux << ","
                            << (lights[i].motion ? "YES" : "NO") << ","
                            << lights[i].expectedStatus << ","
                            << lights[i].actualStatus << ","
                            << lights[i].brightness << ","
                            << lights[i].power << ","
                            << (lights[i].fault ? "YES" : "NO")
                            << "\n";
                }


                // ==========================================
                // ENERGY MONITORING
                // ==========================================

                int totalPower = 0;

                for (int i = 0; i < 8; i++) {

                    totalPower += lights[i].power;
                }


                int maximumPower = 8 * 68;

                int powerSaved =
                    maximumPower - totalPower;

                float savingPercentage =
                    (powerSaved * 100.0) / maximumPower;


                // 1 cycle = 1 hour
                totalEnergy += totalPower;


                cout << "\n\nCurrent Power : "
                     << totalPower << " W";

                cout << "\nPower Saved   : "
                     << powerSaved << " W";

                cout << "\nEnergy Saving : "
                     << savingPercentage << "%";


                // Text log
                logFile << "Current Power: "
                        << totalPower << " W\n";

                logFile << "Power Saved: "
                        << powerSaved << " W\n";

                logFile << "Energy Saving: "
                        << savingPercentage << "%\n";
            }


            logFile.close();
            csvFile.close();


            cout << "\n\nSimulation completed!";

            cout << "\nData saved to:"
                 << "\n- street_light_log.txt"
                 << "\n- street_light_data.csv\n";
        }


        // ==========================================
        // OPTION 2: ENERGY REPORT
        // ==========================================

        else if (choice == 2) {

            cout << "\n============================================\n";
            cout << "             ENERGY REPORT\n";
            cout << "============================================\n";

            cout << "Total Energy Consumed : "
                 << totalEnergy << " Wh\n";

            cout << "Total Energy Consumed : "
                 << totalEnergy / 1000 << " kWh\n";
        }


        // ==========================================
        // OPTION 3: FAULT REPORT
        // ==========================================

        else if (choice == 3) {

            cout << "\n============================================\n";
            cout << "              FAULT REPORT\n";
            cout << "============================================\n";

            cout << "Total Faults Detected : "
                 << totalFaults << "\n";
        }


        // ==========================================
        // OPTION 4: EXIT
        // ==========================================

        else if (choice == 4) {

            cout << "\nExiting Smart Street Light System...\n";
        }


        // ==========================================
        // INVALID OPTION
        // ==========================================

        else {

            cout << "\nInvalid choice!";
        }

    } while (choice != 4);


    return 0;
}