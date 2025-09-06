// api/login.js
import Airtable from 'airtable';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method allowed' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base('app6mKNJ76DPvbtch');

  try {
    const records = await base('logindet').select({
      filterByFormula: `AND(user='${username}', password='${password}')`
    }).firstPage();

    if (records.length > 0) {
      res.status(200).json({ success: true });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Airtable error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}
