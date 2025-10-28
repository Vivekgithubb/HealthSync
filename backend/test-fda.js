const axios = require('axios');

async function fetchDrugData(drug) {
  const cleanDrug = drug.replace(/[^a-zA-Z0-9\s]/g, '').trim();
  const searchTerm = encodeURIComponent(cleanDrug);

  // Try multiple datasets + search patterns
  const endpoints = [
    `https://api.fda.gov/drug/label.json?search=(openfda.brand_name:${searchTerm}+OR+openfda.generic_name:${searchTerm})&limit=5`,
    `https://api.fda.gov/drug/label.json?search=brand_name:${searchTerm}&limit=5`,
    `https://api.fda.gov/drug/label.json?search=generic_name:${searchTerm}&limit=5`,
    `https://api.fda.gov/drug/ndc.json?search=brand_name:${searchTerm}&limit=5`,
    `https://api.fda.gov/drug/ndc.json?search=generic_name:${searchTerm}&limit=5`,
  ];

  for (const url of endpoints) {
    try {
      const res = await axios.get(url);
      if (res.data.results && res.data.results.length > 0) {
        return { data: res.data.results[0], source: url };
      }
    } catch (err) {
      // If OpenFDA returns 404 or no data, continue to next fallback
      if (err.response && err.response.status !== 404) {
        console.error(`Error querying ${url}:`, err.response?.data?.error?.message || err.message);
      }
    }
  }

  return null; // no data found
}

async function testOpenFDA() {
  const testDrugs = ['aspirin', 'ibuprofen', 'tylenol', 'lipitor', 'metformin', 'paracetamol', 'omeprazole'];

  console.log('🔍 Testing OpenFDA API across datasets...\n');

  for (const drug of testDrugs) {
    console.log(`\n🧪 Testing: ${drug}`);
    console.log('='.repeat(50));

    const result = await fetchDrugData(drug);

    if (result) {
      const info = result.data.openfda || result.data;
      console.log(`✓ Found data in: ${result.source}`);
      console.log(`  Brand: ${info.brand_name?.[0] || 'N/A'}`);
      console.log(`  Generic: ${info.generic_name?.[0] || 'N/A'}`);
      console.log(`  Manufacturer: ${info.manufacturer_name?.[0] || 'N/A'}`);
    } else {
      console.log('✗ No data found in any dataset');
    }
  }
}

testOpenFDA().catch(console.error);
