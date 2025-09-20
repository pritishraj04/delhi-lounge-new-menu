import { Client } from "@neondatabase/serverless";

const handler = async (event: any, context: any) => {
  const client = new Client(process.env.NEON_DB_URL!);
  await client.connect();

  try {
    const result = await client.query(`
  SELECT *
  FROM bar_menu
        WHERE enabled = true
    AND (
      time_window_start IS NULL OR time_window_end IS NULL
      OR (
        time_window_start::time <= time_window_end::time
          AND (
            to_char(timezone('America/Chicago', now()), 'HH24:MI:SS')::time >= time_window_start::time
            AND to_char(timezone('America/Chicago', now()), 'HH24:MI:SS')::time < time_window_end::time
          )
        OR
        time_window_start::time > time_window_end::time
          AND (
            to_char(timezone('America/Chicago', now()), 'HH24:MI:SS')::time >= time_window_start::time
            OR to_char(timezone('America/Chicago', now()), 'HH24:MI:SS')::time < time_window_end::time
          )
      )
    )
`);
    // Normalize and format for frontend
    const barItems = result.rows.map((row) => ({
      id: row.id,
      name: row.title || row.name,
      description: row.description || "",
      price:
        typeof row.price === "number"
          ? row.price
          : parseFloat(String(row.price).replace(/[^0-9.]/g, "")) || 0,
      category: row.category || "Uncategorized",
      subCategory: row.sub_category || row.subCategory,
      image: row.image || "/placeholder.svg",
      enabled: ["true", "1", "yes", "y"].includes(
        String(row.enabled).toLowerCase(),
      ),
      timeWindow:
        row.time_window_start && row.time_window_end
          ? { start: row.time_window_start, end: row.time_window_end }
          : undefined,
    }));
    barItems.sort((a, b) => a.id - b.id);
    return {
      statusCode: 200,
      body: JSON.stringify(barItems),
      headers: { "Content-Type": "application/json" },
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to fetch bar menu data",
        details: error.message,
      }),
      headers: { "Content-Type": "application/json" },
    };
  } finally {
    await client.end();
  }
};

export { handler };
