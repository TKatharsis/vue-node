<template>
    <div class="sensor-data">
        <h1>Sensor Data</h1>
        <ul>
            <li v-for="(data, index) in sensorData" :key="index">
                <span class="label">Temperature:</span>
                <span class="temperature">{{ data.temperature }} °C</span>,
                <span class="label">Humidity:</span>
                <span class="humidity">{{ data.humidity }}%</span>
            </li>
        </ul>
    </div>
</template>

<script>
import { ref, onValue, getDatabase, set } from "firebase/database";
import { database } from "@/firebaseConfig";

export default {
    name: "SensorData",
    data() {
        return {
            sensorData: [],
            // Simulated sensor data (remove this in your actual implementation)
            simulatedTemperature: 25,
            simulatedHumidity: 60,
        };
    },
    created() {
        const dataRef = ref(database, 'sensorData');
        onValue(dataRef, (snapshot) => {
            const dataArray = [];
            snapshot.forEach((childSnapshot) => {
                dataArray.push(childSnapshot.val());
            });
            this.sensorData = dataArray;
        });
        
        // Simulate sending data (remove this in your actual implementation)
        setInterval(() => {
            this.simulateSensorData();
        }, 5000); // Sends new data every 5 seconds
    },
    methods: {
        sendData(temperature, humidity) {
            const db = getDatabase();
            const dataRef = ref(db, 'sensorData/' + new Date().getTime());
            set(dataRef, {
                temperature,
                humidity
            });
        },
        simulateSensorData() {
            // Simulating new sensor data
            this.simulatedTemperature += Math.random() > 0.5 ? 1 : -1; // Randomly increase or decrease temperature
            this.simulatedHumidity += Math.random() > 0.5 ? 1 : -1; // Randomly increase or decrease humidity

            // Send the simulated data to Firebase
            this.sendData(this.simulatedTemperature, this.simulatedHumidity);
        },
    },
};
</script>

<style scoped>
.sensor-data {
    font-family: Arial, sans-serif;
    color: #333;
    background-color: #ffc8e3;
    padding: 20px;
    border-radius: 8px;
    max-width: 400px;
    margin: auto;
}

h1 {
    font-size: 1.8em;
    color: #333;
    text-align: center;
    margin-bottom: 20px;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    margin-bottom: 10px;
}

.label {
    font-weight: bold;
}

.temperature {
    color: #ff8c00;
    margin-left: 5px;
    margin-right: 10px;
}

.humidity {
    color: #32cd32;
    margin-left: 5px;
}
</style>
