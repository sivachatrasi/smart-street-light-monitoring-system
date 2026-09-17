/* =========================================================
   LUMA — SMART STREET LIGHT DASHBOARD
   C++ → CSV → LIVE DASHBOARD
========================================================= */

let lights = [];
let allRows = [];
let latestCycle = 0;


// =========================================================
// LOAD CSV
// =========================================================

async function loadCSV() {

    try {

        const response = await fetch(
            "street_light_data.csv?t=" + Date.now(),
            {
                cache: "no-store"
            }
        );

        if (!response.ok) {
            throw new Error("CSV file not found");
        }

        const csvText = await response.text();

        parseCSV(csvText);

    }
    catch (error) {

        console.error("CSV ERROR:", error);

    }

}


// =========================================================
// PARSE CSV
// =========================================================

function parseCSV(csvText) {

    const lines = csvText
        .trim()
        .split(/\r?\n/);

    if (lines.length < 2) {
        console.error("CSV contains no data");
        return;
    }


    allRows = [];


    for (let i = 1; i < lines.length; i++) {

        const values =
            lines[i]
                .split(",")
                .map(v => v.trim());


        if (values.length < 9) {
            continue;
        }


        const row = {

            cycle: Number(values[0]),

            id: values[1],

            lux: Number(values[2]),

            motion:
                values[3] === "YES",

            expected:
                values[4],

            actual:
                values[5],

            brightness:
                Number(values[6]),

            power:
                Number(values[7]),

            fault:
                values[8] === "YES"

        };


        if (
            Number.isFinite(row.cycle) &&
            /^L0[1-8]$/.test(row.id)
        ) {

            allRows.push(row);

        }

    }


    if (allRows.length === 0) {

        console.error("No valid CSV rows found");

        return;

    }


    // -----------------------------------------------------
    // Latest completed cycle
    // -----------------------------------------------------

    const latestEight =
        allRows.slice(-8);


    latestCycle =
        Math.max(
            ...latestEight.map(
                row => row.cycle
            )
        );


    lights =
        latestEight.map(row => ({

            id: row.id,

            location:
                getLocation(row.id),

            lux:
                row.lux,

            motion:
                row.motion,

            expected:
                row.expected,

            actual:
                row.actual,

            brightness:
                row.brightness,

            power:
                row.power,

            fault:
                row.fault

        }));


    console.log(
        "Latest Cycle:",
        latestCycle
    );


    console.log(
        "Current Lights:",
        lights
    );


    updateDashboard();

    updateEnergyHistory();

    updateAnalytics();

}


// =========================================================
// LOCATIONS
// =========================================================

function getLocation(id) {

    const locations = {

        L01: "North Road",
        L02: "North Road",

        L03: "East Road",
        L04: "East Road",

        L05: "South Road",
        L06: "South Road",

        L07: "West Road",
        L08: "West Road"

    };


    return locations[id] || "Smart Road";

}


// =========================================================
// SYSTEM DATA
// =========================================================

function calculateSystemData() {

    let totalPower = 0;

    let faults = 0;

    let full = 0;

    let dim = 0;

    let off = 0;


    lights.forEach(light => {

        totalPower += light.power;


        if (light.fault) {
            faults++;
        }


        if (light.actual === "FULL") {
            full++;
        }

        else if (light.actual === "DIM") {
            dim++;
        }

        else {
            off++;
        }

    });


    const maximumPower =
        lights.length * 68;


    const powerSaved =
        maximumPower - totalPower;


    const savingPercentage =
        maximumPower > 0

            ? (powerSaved / maximumPower) * 100

            : 0;


    return {

        totalPower,

        maximumPower,

        powerSaved,

        savingPercentage,

        faults,

        full,

        dim,

        off

    };

}


// =========================================================
// MAIN DASHBOARD
// =========================================================

function updateDashboard() {

    if (lights.length === 0) {
        return;
    }


    const data =
        calculateSystemData();


    // New dashboard IDs

    setText(
        "currentPower",
        data.totalPower
    );


    setText(
        "energySaving",
        data.savingPercentage.toFixed(1)
    );


    setText(
        "faultCount",
        data.faults
    );


    setText(
        "sidebarFaults",
        data.faults
    );


    setText(
        "faultHeaderCount",
        data.faults
    );


    setText(
        "efficiencyValue",
        data.savingPercentage.toFixed(1) + "%"
    );


    setText(
        "efficiencyCurrent",
        data.totalPower + " W"
    );


    setText(
        "efficiencySaved",
        data.powerSaved + " W"
    );


    // Older/current dashboard IDs

    setText(
        "statTotal",
        lights.length
    );


    setText(
        "statFull",
        data.full
    );


    setText(
        "statDim",
        data.dim
    );


    setText(
        "statOff",
        data.off
    );


    setText(
        "statPower",
        data.totalPower
    );


    setText(
        "statSaved",
        data.savingPercentage.toFixed(0) + "%"
    );


    setText(
        "statFaults",
        data.faults
    );


    updateLightList();

    updateFaultList();

    updateStreetMap();

    updateSensorPanel();

}


// =========================================================
// SAFE TEXT UPDATE
// =========================================================

function setText(id, value) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value;

    }

}


// =========================================================
// LIGHT LIST
// =========================================================

function updateLightList() {

    const container =
        document.getElementById(
            "lightList"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    lights.forEach(
        (light, index) => {

            let statusClass =
                "off-status";

            let symbolClass =
                "off";


            if (light.fault) {

                statusClass =
                    "fault-status";

                symbolClass =
                    "fault";

            }

            else if (
                light.actual === "FULL"
            ) {

                statusClass =
                    "full-status";

                symbolClass =
                    "full";

            }

            else if (
                light.actual === "DIM"
            ) {

                statusClass =
                    "dim-status";

                symbolClass =
                    "dim";

            }


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "light-row";


            row.innerHTML = `

                <div class="light-id">

                    <div class="light-symbol ${symbolClass}">
                        ●
                    </div>

                    <div>

                        <strong>
                            ${light.id}
                        </strong>

                        <small>
                            ${light.location}
                        </small>

                    </div>

                </div>


                <div class="sensor">

                    <span>LUX</span>

                    <strong>
                        ${light.lux}
                    </strong>

                </div>


                <div class="sensor">

                    <span>MOTION</span>

                    <strong
                        class="${light.motion ? "motion-yes" : ""}"
                    >
                        ${light.motion ? "YES" : "NO"}
                    </strong>

                </div>


                <div class="status ${statusClass}">

                    <span></span>

                    ${light.actual}

                </div>


                <div class="brightness">

                    <span>
                        ${light.brightness}%
                    </span>

                    <div class="bar">

                        <div
                            style="
                                width:${light.brightness}%;
                            "
                        ></div>

                    </div>

                </div>


                <div class="power">

                    ${light.power} W

                </div>

            `;


            row.addEventListener(
                "click",
                () => showLightInfo(index)
            );


            container.appendChild(row);

        }
    );

}


// =========================================================
// FAULT LIST
// =========================================================

function updateFaultList() {

    const container =
        document.getElementById(
            "faultList"
        );


    if (!container) {
        return;
    }


    const faults =
        lights.filter(
            light => light.fault
        );


    container.innerHTML = "";


    if (faults.length === 0) {

        container.innerHTML = `

            <li class="fault-item">

                <div class="fault-dot"></div>

                <div>
                    <strong>No active faults</strong>
                    <small>All monitored lights operating normally</small>
                </div>

            </li>

        `;

        return;

    }


    faults.forEach(light => {

        const item =
            document.createElement("li");


        item.className =
            "fault-item";


        item.innerHTML = `

            <div class="fault-dot"></div>

            <div>

                <strong>
                    ${light.id} — ${light.location}
                </strong>

                <small>
                    Expected ${light.expected},
                    but actual status is ${light.actual}
                </small>

            </div>

        `;


        container.appendChild(item);

    });

}


// =========================================================
// STREET MAP
// =========================================================

function updateStreetMap() {

    lights.forEach(
        (light, index) => {

            const element =
                document.querySelector(
                    `.light-${index + 1}`
                );


            if (!element) {
                return;
            }


            element.classList.remove(

                "full-light",

                "dim-light",

                "off-light",

                "fault-light"

            );


            if (light.fault) {

                element.classList.add(
                    "fault-light"
                );

            }

            else if (
                light.actual === "FULL"
            ) {

                element.classList.add(
                    "full-light"
                );

            }

            else if (
                light.actual === "DIM"
            ) {

                element.classList.add(
                    "dim-light"
                );

            }

            else {

                element.classList.add(
                    "off-light"
                );

            }


            element.onclick =
                () => showLightInfo(index);

        }
    );

}


// =========================================================
// SENSOR PANEL
// =========================================================

function updateSensorPanel() {

    const body =
        document.getElementById(
            "sensorTableBody"
        );


    if (!body || !lights.length) {
        return;
    }


    const light =
        lights[0];


    setText(
        "selectedLightLabel",
        light.id
    );


    body.innerHTML = `

        <tr>
            <td>Status</td>
            <td>${light.actual}</td>
        </tr>

        <tr>
            <td>Ambient light</td>
            <td>${light.lux} lux</td>
        </tr>

        <tr>
            <td>Motion detected</td>
            <td>${light.motion ? "YES" : "NO"}</td>
        </tr>

        <tr>
            <td>Expected status</td>
            <td>${light.expected}</td>
        </tr>

        <tr>
            <td>Brightness</td>
            <td>${light.brightness}%</td>
        </tr>

        <tr>
            <td>Power</td>
            <td>${light.power} W</td>
        </tr>

        <tr>
            <td>Fault</td>
            <td>${light.fault ? "YES" : "NO"}</td>
        </tr>

    `;

}


// =========================================================
// ENERGY HISTORY
// =========================================================

function getCycleEnergy() {

    const cycleMap = {};


    allRows.forEach(row => {

        if (!cycleMap[row.cycle]) {

            cycleMap[row.cycle] = {

                power: 0,

                maximum: 0,

                faults: 0

            };

        }


        cycleMap[row.cycle].power +=
            row.power;


        // 68 W maximum for every street light

        cycleMap[row.cycle].maximum +=
            68;


        if (row.fault) {

            cycleMap[row.cycle].faults++;

        }

    });


    return Object.keys(cycleMap)

        .map(Number)

        .sort((a, b) => a - b)

        .map(cycle => {

            const item =
                cycleMap[cycle];


            const saved =
                item.maximum -
                item.power;


            const efficiency =
                item.maximum > 0

                    ? (saved / item.maximum) * 100

                    : 0;


            return {

                cycle,

                power:
                    item.power,

                maximum:
                    item.maximum,

                saved,

                efficiency,

                faults:
                    item.faults

            };

        });

}


// =========================================================
// UPDATE ENERGY MONITORING
// =========================================================

function updateEnergyHistory() {

    const history =
        getCycleEnergy();


    if (!history.length) {
        return;
    }


    const latest =
        history[history.length - 1];


    // Current draw

    setText(
        "energyCurrent",
        latest.power + " W"
    );


    // Total energy consumed

    let totalPower =
        0;


    let totalMaximum =
        0;


    history.forEach(item => {

        totalPower +=
            item.power;

        totalMaximum +=
            item.maximum;

    });


    /*
       Each C++ cycle represents
       one hour of operation.
    */

    const consumedKwh =
        totalPower / 1000;


    const savedKwh =
        (totalMaximum - totalPower) /
        1000;


    const totalEfficiency =
        totalMaximum > 0

            ? (
                (totalMaximum - totalPower)
                / totalMaximum
              ) * 100

            : 0;


    setText(
        "energyConsumed",
        consumedKwh.toFixed(2) + " kWh"
    );


    setText(
        "energySaved",
        savedKwh.toFixed(2) + " kWh"
    );


    setText(
        "savingsPercent",
        totalEfficiency.toFixed(1) + "%"
    );


    setText(
        "energySaving",
        totalEfficiency.toFixed(1)
    );


    const bar =
        document.getElementById(
            "savingsBarFill"
        );


    if (bar) {

        bar.style.width =
            Math.max(
                0,
                Math.min(
                    100,
                    totalEfficiency
                )
            ) + "%";

    }


    drawEnergyChart(history);

}


// =========================================================
// ENERGY CHART
// =========================================================

function drawEnergyChart(history) {

    /*
       If your HTML already has a canvas
       with id="energyChart", use it.

       Otherwise this function does nothing,
       so your existing dashboard layout
       remains untouched.
    */

    const canvas =
        document.getElementById(
            "energyChart"
        );


    if (!canvas) {
        return;
    }


    const ctx =
        canvas.getContext("2d");


    const width =
        canvas.width =
            canvas.clientWidth * 2;


    const height =
        canvas.height =
            canvas.clientHeight * 2;


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    const padding = 45;


    const chartWidth =
        width - padding * 2;


    const chartHeight =
        height - padding * 2;


    const maxPower =
        Math.max(
            ...history.map(
                item => item.power
            ),
            68
        );


    // Grid

    ctx.lineWidth = 1;


    for (
        let i = 0;
        i <= 4;
        i++
    ) {

        const y =
            padding +
            (
                chartHeight / 4
            ) * i;


        ctx.beginPath();

        ctx.moveTo(
            padding,
            y
        );

        ctx.lineTo(
            width - padding,
            y
        );

        ctx.stroke();

    }


    // Energy line

    ctx.beginPath();


    history.forEach(
        (item, index) => {

            const x =
                padding +
                (
                    index /
                    Math.max(
                        history.length - 1,
                        1
                    )
                ) *
                chartWidth;


            const y =
                padding +
                chartHeight -
                (
                    item.power /
                    maxPower
                ) *
                chartHeight;


            if (index === 0) {

                ctx.moveTo(
                    x,
                    y
                );

            }

            else {

                ctx.lineTo(
                    x,
                    y
                );

            }

        }
    );


    ctx.stroke();


    // Cycle labels

    ctx.font =
        "12px sans-serif";


    ctx.textAlign =
        "center";


    history.forEach(
        (item, index) => {

            const x =
                padding +
                (
                    index /
                    Math.max(
                        history.length - 1,
                        1
                    )
                ) *
                chartWidth;


            ctx.fillText(

                "C" + item.cycle,

                x,

                height - 15

            );

        }
    );

}


// =========================================================
// ANALYTICS
// =========================================================

function updateAnalytics() {

    const history =
        getCycleEnergy();


    if (!history.length) {
        return;
    }


    const totalPower =
        history.reduce(
            (sum, item) =>
                sum + item.power,
            0
        );


    const totalMaximum =
        history.reduce(
            (sum, item) =>
                sum + item.maximum,
            0
        );


    const totalSaved =
        totalMaximum -
        totalPower;


    const averagePower =
        totalPower /
        history.length;


    const averageSaving =
        totalMaximum > 0

            ? (
                totalSaved /
                totalMaximum
              ) * 100

            : 0;


    const totalFaults =
        history.reduce(
            (sum, item) =>
                sum + item.faults,
            0
        );


    // Update any analytics IDs
    // if they exist in your HTML.

    setText(
        "averagePower",
        averagePower.toFixed(1) + " W"
    );


    setText(
        "averageSaving",
        averageSaving.toFixed(1) + "%"
    );


    setText(
        "totalEnergySaved",
        (totalSaved / 1000).toFixed(2) + " kWh"
    );


    setText(
        "totalFaults",
        totalFaults
    );


    setText(
        "analyticsCycles",
        history.length
    );


    drawAnalyticsChart(history);

}


// =========================================================
// ANALYTICS CHART
// =========================================================

function drawAnalyticsChart(history) {

    const canvas =
        document.getElementById(
            "analyticsChart"
        );


    if (!canvas) {
        return;
    }


    const ctx =
        canvas.getContext("2d");


    const width =
        canvas.width =
            canvas.clientWidth * 2;


    const height =
        canvas.height =
            canvas.clientHeight * 2;


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    const padding = 45;


    const chartWidth =
        width - padding * 2;


    const chartHeight =
        height - padding * 2;


    const maxValue =
        100;


    ctx.lineWidth = 1;


    // Grid

    for (
        let i = 0;
        i <= 4;
        i++
    ) {

        const y =
            padding +
            (
                chartHeight / 4
            ) * i;


        ctx.beginPath();

        ctx.moveTo(
            padding,
            y
        );

        ctx.lineTo(
            width - padding,
            y
        );

        ctx.stroke();

    }


    // Efficiency line

    ctx.beginPath();


    history.forEach(
        (item, index) => {

            const x =
                padding +
                (
                    index /
                    Math.max(
                        history.length - 1,
                        1
                    )
                ) *
                chartWidth;


            const y =
                padding +
                chartHeight -
                (
                    item.efficiency /
                    maxValue
                ) *
                chartHeight;


            if (index === 0) {

                ctx.moveTo(
                    x,
                    y
                );

            }

            else {

                ctx.lineTo(
                    x,
                    y
                );

            }

        }
    );


    ctx.stroke();

}


// =========================================================
// LIGHT DETAILS
// =========================================================

function showLightInfo(index) {

    const light =
        lights[index];


    if (!light) {
        return;
    }


    setText(
        "selectedTitle",
        `${light.id} — ${light.location}`
    );


    setText(
        "selectedStatus",
        light.fault
            ? "FAULT"
            : light.actual
    );


    setText(
        "selectedLux",
        light.lux + " lux"
    );


    setText(
        "selectedMotion",
        light.motion
            ? "YES"
            : "NO"
    );


    setText(
        "selectedExpected",
        light.expected
    );


    setText(
        "selectedActual",
        light.actual
    );


    setText(
        "selectedBrightness",
        light.brightness + "%"
    );


    setText(
        "selectedPower",
        light.power + " W"
    );


    // Modal

    setText(
        "modalTitle",
        `${light.id} — ${light.location}`
    );


    setText(
        "modalStatus",
        light.fault
            ? "FAULT DETECTED"
            : light.actual
    );


    setText(
        "modalLux",
        light.lux
    );


    setText(
        "modalMotion",
        light.motion
            ? "YES"
            : "NO"
    );


    setText(
        "modalExpected",
        light.expected
    );


    setText(
        "modalActual",
        light.actual
    );


    setText(
        "modalBrightness",
        light.brightness + "%"
    );


    setText(
        "modalPower",
        light.power + " W"
    );


    const modal =
        document.getElementById(
            "lightModal"
        );


    if (modal) {

        modal.classList.add("show");

    }

}


// =========================================================
// CLOSE MODAL
// =========================================================

function closeLightInfo() {

    const modal =
        document.getElementById(
            "lightModal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }

}


// =========================================================
// MODAL OUTSIDE CLICK
// =========================================================

document.addEventListener(
    "click",
    function(event) {

        const modal =
            document.getElementById(
                "lightModal"
            );


        if (
            modal &&
            event.target === modal
        ) {

            closeLightInfo();

        }

    }
);


// =========================================================
// CLOCK
// =========================================================

function updateClock() {

    const clock =
        document.getElementById(
            "clock"
        );


    if (!clock) {
        return;
    }


    const now =
        new Date();


    clock.textContent =
        now.toLocaleTimeString(
            "en-IN",
            {
                hour12: false
            }
        );

}


setInterval(
    updateClock,
    1000
);


updateClock();


// =========================================================
// REFRESH / RUN
// =========================================================

function runSimulation() {

    loadCSV();


    const button =
        document.querySelector(
            ".refresh-btn"
        );


    if (button) {

        const oldText =
            button.textContent;


        button.textContent =
            "✓ CSV Updated";


        setTimeout(
            () => {

                button.textContent =
                    oldText;

            },
            1200
        );

    }

}


// =========================================================
// START
// =========================================================

loadCSV();


// Refresh every 5 seconds

setInterval(
    loadCSV,
    5000
);