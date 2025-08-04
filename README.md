# Bright Data Google/Bing Search Results Scraper (Node.js)

This project provides a simple Node.js boilerplate for fetching first-page search results HTML from Google and Bing using the Bright Data Web Scraper API.

---

## Table of Contents

* [Overview](#overview)
* [Features](#features)
* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Usage](#usage)
* [Configuration](#configuration)
* [Examples](#examples)
* [Output](#output)
* [Support](#support)
* [License](#license)

---

## Overview

This repository demonstrates how to use the Bright Data Scraper API to trigger and download Google/Bing search results HTML. It includes sample search configurations and utility functions for batch and custom searches.

---

## Features

* Trigger Google/Bing search requests via Bright Data Scraper `/trigger` API endpoint
* Monitor progress using `/status` endpoint
* Download and save results as JSON
* Support for both Google and Bing search engines
* Site filtering capabilities
* Configurable timeout settings

---

## Prerequisites

* Node.js v16 or higher
* Bright Data account with API KEY

---

## Installation

```bash
git clone https://github.com/your-org/bright-data-scrape-first-page-search-results-html-nodejs-project.git
cd bright-data-scrape-first-page-search-results-html-nodejs-project
npm install
```

---

## Usage

1. **Set your Bright Data API key**  
   Edit `index.js` and set your API key:  
   ```javascript
   const API_KEY = 'YOUR_API_KEY_HERE';
   ```

2. **Run the scraper**  
   ```bash
   node index.js
   ```  
   Results will be saved as a timestamped `.json` file in the project directory.

---

## Configuration

* **API Key:**  
  Get your API key from your Bright Data dashboard under Account Settings.
* **Dataset ID:**  
  The default dataset ID for Google/Bing Search Results is already set in `index.js`.

---

## Examples

### Run Sample Searches

By default, the script runs three sample searches:

```javascript
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
    find: "artificial intelligence trends 2024",
    timeline: 5000
  }
];
```

### Custom Search

Uncomment and edit the following in `index.js` to run your own search:

```javascript
const customSearch = [createSearch("Best programming languages to learn in 2024", "Google")];
const customResults = await searchEngines(customSearch);
await saveResults(customResults, 'custom_search.json');
```

### Batch Search

```javascript
const multipleSearches = [
  createSearch("Climate change solutions", "Google"),
  createSearch("AI ethics guidelines", "Bing"),
  createSearch("Sustainable business practices", "Google", "www.forbes.com")
];
const multiResults = await searchEngines(multipleSearches);
await saveResults(multiResults, 'multiple_searches.json');
```

### Search Parameters

Each search configuration supports the following parameters:

* `url` (string, required): Search engine URL ("https://google.com" or "https://www.bing.com")
* `with` (string, required): Search engine ("Google" or "Bing")
* `where` (string, optional): Site filter to limit results to specific domains
* `find` (string, required): Search keyword/term
* `timeline` (number, optional): Timeout for each parallel request in milliseconds (default: 5000)

---

## Output

* Results are saved as JSON files (e.g., `search_results_YYYY-MM-DDTHH-MM-SS.json`).
* Each file contains the raw API response from Bright Data with HTML search results.

---

## API Limitations

* No limitations on the number of requests
* Average response time per input: 11s
* Supports both Google and Bing search engines

---

## Support

* [Bright Data Help Center](https://brightdata.com/help)
* [Contact Support](https://brightdata.com/contact)

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
