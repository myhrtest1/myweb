// api/get-records.js
import Airtable from 'airtable';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Only GET allowed' });
  }

  const { projectCode } = req.query;

  if (!projectCode) {
    return res.status(400).json({ error: 'Missing projectCode parameter' });
  }

  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base('app6mKNJ76DPvbtch');

  try {
    const records = [];
    
    await base('Master Matrix')
      .select({
        filterByFormula: `{Project Code} = '${projectCode}'`
      })
      .eachPage((fetchedRecords, fetchNextPage) => {
        records.push(...fetchedRecords);
        fetchNextPage();
      });

    res.status(200).json({ records });
  } catch (error) {
    console.error('Error fetching filtered records:', error);
    res.status(500).json({ error: 'Failed to fetch records', details: error.message });
  }
}
