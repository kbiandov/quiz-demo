import Papa from "papaparse";

export async function fetchCSV(url) {
  return new Promise((resolve, reject) => {
    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(), // Trim whitespace from headers
      complete: (res) => {
        if (res.errors && res.errors.length > 0) {
          console.error('[fetchCSV] Parsing errors for URL:', url, res.errors);
          reject(new Error(`CSV parsing failed: ${res.errors[0].message}`));
        } else if (!res.data || res.data.length === 0) {
          console.error('[fetchCSV] No data returned from URL:', url);
          reject(new Error('CSV returned no data'));
        } else {
          resolve(res.data);
        }
      },
      error: (err) => {
        console.error('[fetchCSV] Network error for URL:', url, err);
        reject(new Error(`Network error: ${err.message}`));
      },
    });
  });
}