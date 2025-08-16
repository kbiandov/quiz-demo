import Papa from "papaparse";

export async function fetchCSV(url) {
  console.log('fetchCSV called with URL:', url);
  
  return new Promise((resolve, reject) => {
    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(), // Trim whitespace from headers
      complete: (res) => {
        console.log('Papa.parse complete for URL:', url);
        console.log('Result:', res);
        console.log('Data length:', res.data?.length);
        console.log('Errors:', res.errors);
        console.log('Meta:', res.meta);
        console.log('First row:', res.data?.[0]);
        console.log('Column names:', res.meta?.fields);
        
        if (res.errors && res.errors.length > 0) {
          console.error('CSV parsing errors:', res.errors);
          reject(res.errors[0]);
        } else if (!res.data || res.data.length === 0) {
          console.error('CSV returned no data');
          reject(new Error('CSV returned no data'));
        } else {
          resolve(res.data);
        }
      },
      error: (err) => {
        console.error('Papa.parse error for URL:', url, err);
        reject(err);
      },
    });
  });
}