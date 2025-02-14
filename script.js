document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("ambulanceAlerts")) {
        loadAmbulanceAlerts();
    }
});

// 🚑 Register Ambulance
function registerAmbulance() {
    let licensePlate = document.getElementById("licensePlate").value;
    let driverName = document.getElementById("driverName").value;
    let fromLocation = document.getElementById("fromLocation").value;
    let toLocation = document.getElementById("toLocation").value;
    let priority = document.getElementById("priority").value;

    if (!licensePlate || !driverName || !fromLocation || !toLocation) {
        alert("Please fill all fields");
        return;
    }

    let ambulances = JSON.parse(localStorage.getItem("ambulances")) || [];

    // 🛑 Check for Overlapping Alerts
    let overlap = ambulances.some((ambulance) => ambulance.toLocation === toLocation);
    
    let ambulanceData = {
        licensePlate,
        driverName,
        fromLocation,
        toLocation,
        priority,
        overlap: overlap, // 🔥 Flag the ambulance if it overlaps
    };

    ambulances.push(ambulanceData);
    localStorage.setItem("ambulances", JSON.stringify(ambulances));

    alert("Ambulance Registered Successfully!");
}

// 🚓 Load Ambulance Alerts on Traffic Police Dashboard
function loadAmbulanceAlerts() {
    let ambulanceList = JSON.parse(localStorage.getItem("ambulances")) || [];
    let ambulanceAlerts = document.getElementById("ambulanceAlerts");

    ambulanceAlerts.innerHTML = "";

    let locationMap = {}; // Store ambulances per location

    ambulanceList.forEach((ambulance) => {
        let toLocation = ambulance.toLocation;
        if (!locationMap[toLocation]) {
            locationMap[toLocation] = [];
        }
        locationMap[toLocation].push(ambulance);
    });

    ambulanceList.forEach((ambulance) => {
        let listItem = document.createElement("li");
        let className = ambulance.priority.toLowerCase();
        let toLocation = ambulance.toLocation;

        // 🚨 Handle Overlapping Alerts
        if (locationMap[toLocation].length > 1) {
            className = "overlapping"; // Apply yellow background for overlaps
            
            // ⏳ Delay Lower Priority Ambulances
            let highestPriority = locationMap[toLocation].some(a => a.priority === "Critical");
            if (highestPriority && ambulance.priority !== "Critical") {
                listItem.innerHTML = `<strong>${ambulance.licensePlate}</strong> - ${ambulance.driverName}<br>
                    <span>From: ${ambulance.fromLocation} → To: ${ambulance.toLocation}</span><br>
                    <span class='delayed'>🚦 Lower Priority Ambulance Delayed ⏳</span>`;
            } else {
                listItem.innerHTML = `<strong>${ambulance.licensePlate}</strong> - ${ambulance.driverName}<br>
                    <span>From: ${ambulance.fromLocation} → To: ${ambulance.toLocation}</span><br>
                    <span>Priority: ${ambulance.priority}</span>
                    <br><span class='warning'>⚠ Overlapping Alert!</span>`;
            }
        } else {
            listItem.innerHTML = `<strong>${ambulance.licensePlate}</strong> - ${ambulance.driverName}<br>
                <span>From: ${ambulance.fromLocation} → To: ${ambulance.toLocation}</span><br>
                <span>Priority: ${ambulance.priority}</span>`;
        }

        listItem.classList.add(className);
        ambulanceAlerts.appendChild(listItem);
    });
}
