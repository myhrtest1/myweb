// api/create-request.js

import Airtable from 'airtable';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const {
    projcode,
    desig,
    count,
    startdate,
    enddate
  } = req.body;

  if (!projcode || !desig || !count || !startdate) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base('app6mKNJ76DPvbtch');

  try {
    const createdRecord = await base('NewRequest').create({
      "Project Code": projcode,
      "Designation": desig,
      "Requested Count": parseInt(count),
      "Start Date": startdate,
      "End Date": enddate || null,
      "Request Status": "Pending"
    });

    res.status(200).json({ success: true, recordId: createdRecord.id });
  } catch (error) {
    console.error('Airtable insert error:', error);
    res.status(500).json({ error: 'Failed to create request', details: error.message });
  }
}
