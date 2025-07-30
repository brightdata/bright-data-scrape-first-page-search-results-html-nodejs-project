const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

// Configuration
const API_KEY = 'Bright_Data_API_KEY'; // Replace with your Bright Data API key
const DATASET_ID = 'gd_m5zlb2loauntf6oof'; // Dataset ID for Google/Bing search results
const API_BASE_URL = 'https://api.brightdata.com/datasets/v3';

// Sample search configurations
const SAMPLE_SEARCHES = [
  {
    url: "https://google.com",
    with: "Google",
    where: "edition.cnn.com/business",
    find: "money",
    timeline: 5000
  },
  {
    url: "https://www.bing.com",
    with: "Bing",
    where: "www.bbc.com/business",
    find: "obama",
    timeline: 5000
  },
  {
    url: "https://google.com",
    with: "Google",
    find: "artificial intelligence trends 2025",
    timeline: 5000
  }
];

/**
 * Create a search configuration object
 * @param {string} searchTerm - The search term/keyword
 * @param {string} searchEngine - "Google" or "Bing"
 * @param {string} siteFilter - Optional site filter
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Object} Search configuration
 */
function createSearch(searchTerm, searchEngine = "Google", siteFilter = "", timeout = 5000) {
  const url = searchEngine.toLowerCase() === "bing" ? "https://www.bing.com" : "https://google.com";
  
  return {
    url: url,
    with: searchEngine,
    where: siteFilter,
    find: searchTerm,
    timeline: timeout
  };
}

/**
 * Trigger search requests via Bright Data API
 * @param {Array} searches - Array of search configurations
 * @returns {Promise<Object>} API response
 */
async function triggerSearchRequests(searches) {
  try {
    console.log(`Triggering ${searches.length} search request(s)...`);
    
    const response = await fetch(
      `${API_BASE_URL}/trigger?dataset_id=${DATASET_ID}&include_errors=true`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searches),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Search requests triggered successfully:", data);
    console.log("Response keys:", Object.keys(data));
    return data;
  } catch (error) {
    console.error("Error triggering search requests:", error);
    throw error;
  }
}

/**
 * Check the status of search requests
 * @param {string} snapshotId - The snapshot ID from the trigger response
 * @returns {Promise<Object>} Status response
 */
async function checkStatus(snapshotId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/progress/${snapshotId}`,
      {
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Status response:", data);
    return data;
  } catch (error) {
    console.error("Error checking status:", error);
    throw error;
  }
}

/**
 * Download search results
 * @param {string} snapshotId - The snapshot ID
 * @returns {Promise<Object>} Download response
 */
async function downloadResults(snapshotId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/snapshot/${snapshotId}?format=json`,
      {
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Download response:", data);
    return data;
  } catch (error) {
    console.error("Error downloading results:", error);
    throw error;
  }
}

/**
 * Save results to a JSON file
 * @param {Object} results - The search results
 * @param {string} filename - The filename to save as
 */
async function saveResults(results, filename) {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const finalFilename = filename || `search_results_${timestamp}.json`;
    
    fs.writeFileSync(finalFilename, JSON.stringify(results, null, 2));
    console.log(`Results saved to: ${finalFilename}`);
  } catch (error) {
    console.error("Error saving results:", error);
  }
}

/**
 * Wait for search results to be ready
 * @param {string} snapshotId - The snapshot ID
 * @param {number} maxWaitTime - Maximum time to wait in milliseconds
 * @returns {Promise<Object>} Final results
 */
async function waitForResults(snapshotId, maxWaitTime = 300000) { // 5 minutes default
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxWaitTime) {
    console.log("Checking status...");
    const status = await checkStatus(snapshotId);
    
    if (status.status === "completed" || status.status === "ready") {
      console.log("Search completed! Downloading results...");
      return await downloadResults(snapshotId);
    } else if (status.status === "failed") {
      throw new Error("Search failed");
    }
    
    console.log(`Status: ${status.status}. Waiting 10 seconds...`);
    await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
  }
  
  throw new Error("Timeout waiting for results");
}

/**
 * Main function to execute search requests
 * @param {Array} searches - Array of search configurations
 * @returns {Promise<Object>} Search results
 */
async function searchEngines(searches) {
  try {
    // Trigger the search requests
    const triggerResponse = await triggerSearchRequests(searches);
    
    // Handle both request_id and snapshot_id responses
    const id = triggerResponse.request_id || triggerResponse.snapshot_id;
    if (!id) {
      throw new Error("No request ID or snapshot ID received from trigger");
    }
    
    console.log(`Snapshot ID: ${id}`);
    
    // Wait for results and download them
    const results = await waitForResults(id);
    
    return results;
  } catch (error) {
    console.error("Error in searchEngines:", error);
    throw error;
  }
}

/**
 * Main execution function
 */
async function main() {
  try {
    console.log("🚀 Starting Google/Bing Search Results Scraper");
    console.log("=" .repeat(50));
    
    // Check if API key is set
    if (API_KEY === 'YOUR_API_KEY_HERE') {
      console.error("❌ Please set your Bright Data API key in index.js");
      console.log("Get your API key from your Bright Data dashboard under Account Settings.");
      process.exit(1);
    }
    
    // Run sample searches
    console.log("📝 Running sample searches...");
    const results = await searchEngines(SAMPLE_SEARCHES);
    
    // Save results with descriptive filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await saveResults(results, `google_bing_search_results_${timestamp}.json`);
    
    console.log("✅ Search completed successfully!");
    
  } catch (error) {
    console.error("❌ Error in main execution:", error);
    process.exit(1);
  }
}

// Export functions for external use
module.exports = {
  createSearch,
  searchEngines,
  triggerSearchRequests,
  checkStatus,
  downloadResults,
  saveResults,
  waitForResults
};

// Run if this file is executed directly
if (require.main === module) {
  main();
} 