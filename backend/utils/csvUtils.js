const fs = require('fs');

/**
 * Generates a CSV string from an array of objects.
 * 
 * @param {Array<Object>} data Array of objects to turn into CSV rows
 * @param {Array<string>} fields Headers to include in the CSV
 * @returns {string} The CSV formatted string
 */
const generateCSV = (data, fields) => {
    if (!data || !data.length) return '';
    const header = fields.join(',') + '\n';
    const rows = data.map(row => {
        return fields.map(field => {
            let val = row[field] || '';
            // Handle nested objects
            if (typeof val === 'object') val = JSON.stringify(val);
            // Escape double quotes and wrap in quotes
            val = String(val).replace(/"/g, '""');
            return `"${val}"`;
        }).join(',');
    }).join('\n');
    return header + rows;
};

/**
 * Parses a CSV file robustly, handling commas inside quotes, escaped quotes,
 * and different line ending formats (\r\n vs \n).
 * 
 * @param {string} filePath Path to the CSV file
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of objects representing the rows
 */
const parseCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) return reject(err);

            const lines = [];
            let row = [];
            let inQuotes = false;
            let currentField = '';

            for (let i = 0; i < data.length; i++) {
                const char = data[i];
                const nextChar = data[i + 1];

                if (char === '"') {
                    if (inQuotes && nextChar === '"') {
                        // Escaped quote: "" inside a quoted field
                        currentField += '"';
                        i++; // skip next char
                    } else {
                        // Toggle quotes mode
                        inQuotes = !inQuotes;
                    }
                } else if (char === ',' && !inQuotes) {
                    // Field separator
                    row.push(currentField);
                    currentField = '';
                } else if ((char === '\r' || char === '\n') && !inQuotes) {
                    // Line ending
                    if (char === '\r' && nextChar === '\n') {
                        i++; // skip \n
                    }
                    row.push(currentField);
                    lines.push(row);
                    row = [];
                    currentField = '';
                } else {
                    currentField += char;
                }
            }

            // Append last row if exists
            if (currentField || row.length > 0) {
                row.push(currentField);
                lines.push(row);
            }

            if (lines.length === 0) return resolve([]);

            // Retrieve headers (clean and trim them)
            const headers = lines[0].map(h => h.trim());
            const results = [];

            for (let i = 1; i < lines.length; i++) {
                const line = lines[i];
                // Skip empty lines/rows
                if (line.length === 1 && line[0].trim() === '') continue;

                const obj = {};
                headers.forEach((h, index) => {
                    if (h) {
                        const val = line[index] !== undefined ? line[index].trim() : '';
                        obj[h] = val;
                    }
                });
                results.push(obj);
            }

            resolve(results);
        });
    });
};

module.exports = {
    generateCSV,
    parseCSV,
};
