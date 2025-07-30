const { createSearch, searchEngines, saveResults } = require('./index');

/**
 * Example usage of the Google/Bing Search Results Scraper
 */
async function runExamples() {
  try {
    console.log("🔍 Google/Bing Search Results Scraper - Examples");
    console.log("=" .repeat(50));

    // Example 1: Single Google search
    console.log("\n📝 Example 1: Single Google search");
    const googleSearch = [createSearch("machine learning tutorials", "Google")];
    const googleResults = await searchEngines(googleSearch);
    await saveResults(googleResults, 'google_machine_learning_search.json');

    // Example 2: Single Bing search with site filter
    console.log("\n📝 Example 2: Single Bing search with site filter");
    const bingSearch = [createSearch("artificial intelligence", "Bing", "www.techcrunch.com")];
    const bingResults = await searchEngines(bingSearch);
    await saveResults(bingResults, 'bing_ai_techcrunch_search.json');

    // Example 3: Multiple searches
    console.log("\n📝 Example 3: Multiple searches");
    const multipleSearches = [
      createSearch("climate change solutions", "Google"),
      createSearch("AI ethics guidelines", "Bing"),
      createSearch("remote work best practices", "Google", "www.forbes.com")
    ];
    const multiResults = await searchEngines(multipleSearches);
    await saveResults(multiResults, 'multiple_topics_search.json');

    // Example 4: Custom timeout
    console.log("\n📝 Example 4: Custom timeout");
    const customTimeoutSearch = [createSearch("blockchain technology", "Google", "", 10000)];
    const timeoutResults = await searchEngines(customTimeoutSearch);
    await saveResults(timeoutResults, 'blockchain_search_custom_timeout.json');

    console.log("\n✅ All examples completed successfully!");

  } catch (error) {
    console.error("❌ Error running examples:", error);
  }
}

// Run examples if this file is executed directly
if (require.main === module) {
  runExamples();
}

module.exports = { runExamples }; 