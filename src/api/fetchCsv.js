import Papa from "papaparse";

export async function fetchCSV(url) {
  return new Promise((resolve, reject) => {
    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        if (res.errors && res.errors.length > 0) {
          reject(res.errors[0]);
        } else {
          resolve(res.data);
        }
      },
      error: (err) => reject(err),
    });
  });
}