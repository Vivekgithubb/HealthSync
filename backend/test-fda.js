const axios = require('axios');

async function testOpenFDA() {
  const testDrugs = ['aspirin', 'ibuprofen', 'tylenol', 'lipitor'];
  
  console.log('Testing OpenFDA API...\n');
  
  for (const drug of testDrugs) {
    console.log(`\nTesting: ${drug}`);
    console.log('='.repeat(50));
    
    try {
      // Test the exact query format used in the app
      const searchTerm = encodeURIComponent(drug);
      const fdaUrl = `https://api.fda.gov/drug/label.json?search=(openfda.brand_name:${searchTerm}+OR+openfda.generic_name:${searchTerm})&limit=5`;
      
      console.log(`Query: ${fdaUrl}\n`);
      
      const response = await axios.get(fdaUrl);
      
      if (response.data.results && response.data.results.length > 0) {
        console.log(`✓ Found ${response.data.results.length} results`);
        console.log(`  Brand name: ${response.data.results[0].openfda?.brand_name?.[0] || 'N/A'}`);
        console.log(`  Generic name: ${response.data.results[0].openfda?.generic_name?.[0] || 'N/A'}`);
        console.log(`  Manufacturer: ${response.data.results[0].openfda?.manufacturer_name?.[0] || 'N/A'}`);
      } else {
        console.log('✗ No results found');
      }
    } catch (error) {
      console.log(`✗ Error: ${error.response?.data?.error?.message || error.message}`);
    }
  }
}

testOpenFDA().catch(console.error);
