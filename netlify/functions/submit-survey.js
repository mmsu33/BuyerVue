exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
  const BASE_ID = "app7wvgOpvGXA803v";
  const TABLE_NAME = "Submissions";

  if (!AIRTABLE_API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: "API key not configured" }) };
  }

  let fields;
  try {
    fields = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  try {
    const response = await fetch(
      "https://api.airtable.com/v0/" + BASE_ID + "/" + encodeURIComponent(TABLE_NAME),
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + AIRTABLE_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ fields: fields })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { statusCode: response.status, body: JSON.stringify({ error: data }) };
    }

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ success: true, id: data.id })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
