let raspberryPiServerUrl = '';

function fetchEnvironment() {
    fetch('/environment')
        .then(response => response.json())
        .then(data => {
            if (data.environment === 'development') {
                // Show Raspberry Pi section when running locally
                document.getElementById('pi-content').style.display = 'block';
            } else {
                // Check Pi status when not running locally
                raspberryPiServerUrl = data.raspberryPiServerUrl;
                checkPiStatus();
            }

        })
        .catch(error => {
            console.error('Error fetching environment:', error);
        });
}

function setLED(color, state) {
    fetch(`${raspberryPiServerUrl}/led/${color}/${state}`)
        .then(response => response.json())
        .then(data => {
            console.log('LED state changed:', data);
        });
}

function toggleLED(color, checkbox) {
    setLED(color, checkbox.checked ? 'on' : 'off');
}

function updateTemperatureAndHumidity() {
    fetch('${raspberryPiServerUrl}/temperature-humidity')
        .then(response => response.json())
        .then(data => {
            document.getElementById('temperature').innerHTML = `Temperature: ${data.temperature}°C`;
            document.getElementById('humidity').innerHTML = `Humidity: ${data.humidity}%`;
            const lastUpdated = new Date().toLocaleString();
            document.getElementById('last-updated').innerHTML = `Last updated: ${lastUpdated}`;
        })
        .catch(error => {
            console.error('Error fetching LED state:', error);
        });
}

function toggleMotionSensor() {
    const motionSensorToggle = document.getElementById('motion-sensor-toggle');
    fetch('${raspberryPiServerUrl}/motion-sensor/toggle')
        .then(response => response.json())
        .then(data => {
            const motionSensorStatus = document.getElementById('motion-sensor-status');
            if (data.motionSensorEnabled) {
                motionSensorStatus.textContent = 'Motion sensor status: Enabled';
                motionSensorToggle.checked = true;
            } else {
                motionSensorStatus.textContent = 'Motion sensor status: Disabled';
                motionSensorToggle.checked = false;
            }
        })
        .catch(error => {
            console.error('Error toggling motion sensor:', error);
        });
}

function checkPiStatus() {
    fetch('${raspberryPiServerUrl}/pi-status')
        .then(response => response.json())
        .then(data => {
            const piStatusElement = document.getElementById('pi-status');
            const piContentElement = document.getElementById('pi-content');
            if (data.online) {
                piStatusElement.textContent = 'Raspberry Pi status: Online';
                piContentElement.style.display = 'block'; // Show the content when Pi is online
            } else {
                piStatusElement.textContent = 'Raspberry Pi status: Offline';
                piContentElement.style.display = 'none'; // Hide the content when Pi is offline
            }
        })
        .catch(error => {
            console.error('Error fetching Pi status:', error);
        });
}

function toggleMotionSensor() {
    fetch('${raspberryPiServerUrl}/motion-sensor/toggle')
        .then(response => response.json())
        .then(data => {
            const motionSensorStatus = document.getElementById('motion-sensor-status');
            if (data.motionSensorEnabled) {
                motionSensorStatus.textContent = 'Motion sensor status: Enabled';
            } else {
                motionSensorStatus.textContent = 'Motion sensor status: Disabled';
            }
        })
        .catch(error => {
            console.error('Error toggling motion sensor:', error);
        });
}


window.onload = function() {
    // Fetch environment information and show the Raspberry Pi section when running locally
    fetchEnvironment();

    // Fetch temperature and humidity data when the page loads
    updateTemperatureAndHumidity();

    // Update temperature and humidity data every 5 seconds
    setInterval(updateTemperatureAndHumidity, 5000);

    // Update motion sensor status when the page loads
    updateMotionSensorStatus();

    // Update motion sensor status every 5 seconds
    setInterval(updateMotionSensorStatus, 5000);
};
