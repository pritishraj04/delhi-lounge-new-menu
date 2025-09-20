const fs = require("fs");
const csv = require("csv-parser");
const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.NEON_DB_URL,
});

async function migrate() {
  await client.connect();

  const rows = [];
  fs.createReadStream("public/data/food-menu.csv")
    .pipe(csv())
    .on("data", (row) => {
      // Parse metrices to price_full and price_half
      let price_full = null,
        price_half = null;
      if (row.metrices) {
        const fullMatch = row.metrices.match(/Full:\s*([0-9.]+)/i);
        const halfMatch = row.metrices.match(/Half:\s*([0-9.]+)/i);
        price_full = fullMatch ? parseFloat(fullMatch[1]) : null;
        price_half = halfMatch ? parseFloat(halfMatch[1]) : null;
      }
      rows.push({
        ...row,
        price_full,
        price_half,
      });
    })
    .on("end", async () => {
      for (const row of rows) {
        await client.query(
          `INSERT INTO menu (name, description, category, sub_category, price_full, price_half, enabled)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            row.name,
            row.description,
            row.category,
            row.sub_category,
            row.price_full,
            row.price_half,
            true, // or row.enabled if present
          ],
        );
      }
      await client.end();
      console.log("Migration complete!");
    });
}

migrate();
