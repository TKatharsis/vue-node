<template>
  <div class="container">
    <h1>Sensor Data</h1>
    <div v-if="latestData" class="gauge-container">
      <div class="gauge">
        <div class="gauge-square" :style="{ '--percentage': latestData.temperature / 100 }">
          <span>{{ latestData.temperature }}°C</span>
        </div>
        <h2>Temperature</h2>
      </div>
      <div class="gauge">
        <div class="gauge-square" :style="{ '--percentage': latestData.humidity / 100 }">
          <span>{{ latestData.humidity }}%</span>
        </div>
        <h2>Humidity</h2>
      </div>
    </div>
    <div v-else>No data available.</div>

    <div class="input-container">
      <label for="temperatureInput">Update Temperature (°C):</label>
      <input id="temperatureInput" v-model="newTemperature" type="number" placeholder="Enter new temperature" />

      <label for="humidityInput">Update Humidity (%):</label>
      <input id="humidityInput" v-model="newHumidity" type="number" placeholder="Enter new humidity" />

      <div class="button-group">
        <button @click="createSampleData">Create</button>
        <button @click="updateSampleData">Update</button>
        <button @click="deleteSampleData">Delete</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useSensorStore } from '../stores/sensorStore';
import { onMounted, computed, ref } from 'vue';

export default {
  setup() {
    const sensorStore = useSensorStore();
    const newTemperature = ref(null);
    const newHumidity = ref(null);

    onMounted(() => {
      sensorStore.fetchSensorData();
    });

    const latestData = computed(() => sensorStore.latestEntry);
    const latestKey = computed(() => sensorStore.latestEntryKey);

    const createSampleData = () => {
      sensorStore.createSensorData({ temperature: 0, humidity: 0 });
    };

    const updateSampleData = () => {
      const updatedData = {
        temperature: newTemperature.value !== null ? newTemperature.value : latestData.value.temperature,
        humidity: newHumidity.value !== null ? newHumidity.value : latestData.value.humidity,
      };
      if (latestKey.value) {
        sensorStore.updateSensorData(latestKey.value, updatedData);
      } else {
        console.error('No key available for update.');
      }
      newTemperature.value = null;
      newHumidity.value = null;
    };

    const deleteSampleData = () => {
      if (latestKey.value) {
        sensorStore.deleteSensorData(latestKey.value);
      } else {
        console.error('No key available for deletion.');
      }
    };

    return {
      latestData,
      newTemperature,
      newHumidity,
      createSampleData,
      updateSampleData,
      deleteSampleData,
    };
  },
};
</script>

<style>
body {
  font-family: 'Verdana', sans-serif;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #1c1c1e;
  background-image: url('https://www.transparenttextures.com/patterns/black-twill.png');
}

.container {
  width: 100%;
  max-width: 900px;
  padding: 30px;
  border-radius: 8px;
  color: #fff;
  text-align: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  background-color: #2b2b2d;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 40px;
  color: #ffffff;
  font-weight: bold;
  letter-spacing: 1px;
  text-shadow: 0 0 10px #530965, 0 0 20px #a630d1, 0 0 30px #41075b;
}

.gauge-container {
  display: flex;
  justify-content: space-between;
  gap: 40px;
  margin-bottom: 40px;
}

.gauge {
  text-align: center;
  width: 45%;
}

.gauge-square {
  position: relative;
  width: 160px;
  height: 160px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  border: 5px solid #73319f;
  background-color: #1e1e20;
  box-shadow: inset 0px 4px 8px rgba(0, 0, 0, 0.5);
}

.gauge-square::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to top,
    #9e46d8 var(--percentage, 0%),
    transparent var(--percentage, 0%)
  );
  transition: background 0.5s ease;
}

.gauge-square span {
  position: relative;
  font-size: 2rem;
  font-weight: bold;
  color: #fff;
  z-index: 1;
  text-shadow: 0 0 8px #ffffff, 0 0 12px #a630d1, 0 0 18px #41075b;
}

h2 {
  font-size: 1.2rem;
  color: #ddd;
  margin-top: 15px;
  text-shadow: 0 0 5px #561e7b;
}

.input-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

input[type="number"] {
  width: 100%;
  max-width: 300px;
  padding: 10px;
  margin: 10px 0 20px 0;
  border: 1px solid #c582f2;
  border-radius: 8px;
  background-color: #ffffff;
  color: #000;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
}

.button-group {
  display: flex;
  gap: 10px;
  justify-content: center;
}

button {
  padding: 12px 20px;
  background: linear-gradient(45deg, #73319f, #9e46d8);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s;
}

button:hover {
  background: linear-gradient(45deg, #9e46d8, #73319f);
  transform: translateY(-2px);
}

button:active {
  background-color: #341549;
  transform: scale(0.95);
}

button:focus {
  outline: none;
}

label {
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 5px;
}
</style>
