// src/stores/sensorStore.js
import { defineStore } from 'pinia';
import { database, ref, push, update, remove, query, limitToLast, onValue } from '../firebaseConfig';

export const useSensorStore = defineStore('sensor', {
  state: () => ({
    sensorDataList: [], // Array to hold fetched sensor data
    latestEntry: null,   // Latest sensor data entry
    latestEntryKey: null // Key of the latest entry for update/delete operations
  }),
  actions: {
    // Create new sensor data entry
    async createSensorData(newData) {
      try {
        const sensorDataRef = ref(database, 'sensorData');
        const newEntryRef = await push(sensorDataRef, newData);
    
        // Save to Cache
        const cache = await caches.open('sensor-cache');
        await cache.put('sensorData', new Response(JSON.stringify(newData)));
    
        console.log('New sensor data created and saved to cache:', newData, 'Key:', newEntryRef.key);
      } catch (error) {
        console.error('Error creating sensor data:', error);
      }
    },
    

    // Fetch the latest sensor data (Read)
    async fetchSensorData() {
      // Check if the data is in the browser cache first
      const cachedData = await this.getCacheData();
      if (cachedData) {
        console.log('Data fetched from cache:', cachedData);
        this.latestEntry = cachedData;
        return;
      }

      // If not in cache, fetch from Firebase
      const sensorDataRef = ref(database, 'sensorData');
      const SensorDataQuery = query(sensorDataRef, limitToLast(1));

      onValue(SensorDataQuery, (snapshot) => {
        let latestKey = null;
        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();
          latestKey = childSnapshot.key;
          this.latestEntry = data;
          this.latestEntryKey = latestKey;

          // Store data in cache for future use
          this.updateCache(data);
        });

        if (this.latestEntry) {
          console.log('Latest sensor data fetched:', this.latestEntry, 'Key:', this.latestEntryKey);
        } else {
          console.log('No sensor data available.');
        }
      });
    },

    // Update existing sensor data by key
    async updateSensorData(key, updatedData) {
      if (!key) {
        console.error('No key provided for updating data.');
        return;
      }
      try {
        const dataRef = ref(database, `sensorData/${key}`);
        await update(dataRef, updatedData);
        console.log('Sensor data updated:', updatedData, 'Key:', key);

        // Update cache after update
        this.updateCache(updatedData);
      } catch (error) {
        console.error('Error updating sensor data:', error);
      }
    },

    // Delete sensor data by key
    async deleteSensorData(key) {
      if (!key) {
        console.error('No key provided for deleting data.');
        return;
      }
      try {
        const dataRef = ref(database, `sensorData/${key}`);
        await remove(dataRef);
        console.log('Sensor data deleted:', key);

        // Remove data from cache after deletion
        this.removeCacheData();
      } catch (error) {
        console.error('Error deleting sensor data:', error);
      }
    },

    // Update the cache with new data
    async updateCache(data) {
      const cache = await caches.open('sensor-cache'); // Open the cache
      await cache.put('sensorData', new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
      })); // Store the data in cache
    },

    // Get data from cache
    async getCacheData() {
      const cache = await caches.open('sensor-cache'); // Open the cache
      const response = await cache.match('sensorData'); // Match the cached data
      if (response) {
        const cachedData = await response.json();
        return cachedData;
      }
      return null; // If no cache found, return null
    },

    // Remove data from the cache
    async removeCacheData() {
      const cache = await caches.open('sensor-cache'); // Open the cache
      await cache.delete('sensorData'); // Delete the cached data
    }
  }
});
