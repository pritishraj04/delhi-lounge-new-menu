import { Client } from "@neondatabase/serverless";

const handler = async (event: any, context: any) => {
  const client = new Client(process.env.NEON_DB_URL!);
  await client.connect();

  try {
    const result = await client.query(`
  SELECT *
  FROM menu
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
    const menuItems = result.rows.map((row) => {
      // Portion logic: if both prices exist, use both; else just full
      let price: number | { full: number; half?: number } = 0;
      const fullPrice =
        typeof row.price_full === "number"
          ? row.price_full
          : parseFloat(
              String(row.price_full ?? row.price).replace(/[^0-9.]/g, ""),
            ) || 0;
      const halfPrice =
        typeof row.price_half === "number"
          ? row.price_half
          : parseFloat(String(row.price_half).replace(/[^0-9.]/g, "")) ||
            undefined;
      if (halfPrice && halfPrice > 0) {
        price = { full: fullPrice, half: halfPrice };
      } else {
        price = fullPrice;
      }
      return {
        id: row.id,
        name: row.title || row.name,
        description: row.description || "",
        image: row.image || "/placeholder.svg",
        price,
        allergens: row.allergens
          ? Array.isArray(row.allergens)
            ? row.allergens
            : String(row.allergens)
                .split(/[;,]/)
                .map((a) => a.trim())
                .filter(Boolean)
          : [],
        category: row.category || "Uncategorized",
        subCategory: row.sub_category || row.subCategory,
        isChefSpecial: ["true", "1", "yes", "y"].includes(
          String(row.chef_special ?? row.isChefSpecial).toLowerCase(),
        ),
        isMustTry: ["true", "1", "yes", "y"].includes(
          String(row.must_try ?? row.isMustTry).toLowerCase(),
        ),
        isVegan: ["true", "1", "yes", "y"].includes(
          String(row.vegan ?? row.isVegan).toLowerCase(),
        ),
        hasPortions: typeof price === "object" && price.half !== undefined,
        enabled: ["true", "1", "yes", "y"].includes(
          String(row.enabled).toLowerCase(),
        ),
        timeWindow:
          row.time_window_start && row.time_window_end
            ? { start: row.time_window_start, end: row.time_window_end }
            : undefined,
      };
    });
    // Sort menuItems by id ascending
    menuItems.sort((a, b) => a.id - b.id);
    return {
      statusCode: 200,
      body: JSON.stringify(menuItems),
      headers: { "Content-Type": "application/json" },
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to fetch menu data",
        details: error.message,
      }),
      headers: { "Content-Type": "application/json" },
    };
  } finally {
    await client.end();
  }
};

export { handler };
