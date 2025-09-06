import Airtable from 'airtable';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method allowed' });
  }

  // Check if API key is present
  if (!process.env.AIRTABLE_API_KEY) {
    return res.status(500).json({ error: 'Missing Airtable API key in environment variables' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: 'Username and password required',
      received: { username, password },
    });
  }

  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base('app6mKNJ76DPvbtch');

  try {
    // Make sure column names are exactly like in Airtable ("User" and "Password")
    const formula = `AND(User='${username}', Password='${password}')`;

    console.log('API key present:', !!process.env.AIRTABLE_API_KEY);
    console.log(`Query formula: ${formula}`);

    const records = await base('logindet').select({
      filterByFormula: formula,
    }).firstPage();

    console.log(`Records found: ${records.length}`);

    if (records.length > 0) {
      return res.status(200).json({
        success: true,
        debug: {
          matchedUser: records[0].fields.User,
          formula,
          recordsFound: records.length,
        }
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        debug: {
          formula,
          returnedRecords: records.length,
        }
      });
    }
  } catch (error) {
    console.error('Airtable error:', error);

    return res.status(500).json({
      error: 'Airtable request failed',
      details: error.message,
    });
  }
}
