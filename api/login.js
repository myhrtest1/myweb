import Airtable from 'airtable';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method allowed' });
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
    // Wrap field names in {} to handle uppercase letters
    const formula = `AND({User}='${username}', {Password}='${password}')`;

    const records = await base('logindet').select({
      filterByFormula: formula
    }).firstPage();

    console.log(`Query formula: ${formula}`);
    console.log(`Records found: ${records.length}`);

    if (records.length > 0) {
      return res.status(200).json({
        success: true,
        debug: {
          matchedUser: records[0].fields.User,
        }
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        debug: {
          formula,
          returnedRecords: records.length
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
