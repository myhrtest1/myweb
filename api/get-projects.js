// api/get-projects.js
import Airtable from 'airtable';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Only GET allowed' });
  }

  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base('app6mKNJ76DPvbtch');

  try {
    const records = await base('Project Master').select({
      fields: ['Project Code'],
    }).all();

    const projectCodes = records
      .map(record => record.fields['Project Code'])
      .filter(Boolean); // Remove empty/null

    res.status(200).json({ projectCodes });
  } catch (error) {
    console.error('Error fetching project codes:', error);
    res.status(500).json({ error: 'Failed to fetch project codes', details: error.message });
  }
}
