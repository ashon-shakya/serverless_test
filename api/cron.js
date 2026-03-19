import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(request, response) {
  if (!uri) {
    return response.status(500).json({
      success: false,
      message: "MONGODB_URI environment variable is not defined."
    });
  }

  try {
    const fuelApiUrl = "https://www.fuelcheck.nsw.gov.au/fuel/api/v1/fuel/prices/bylocation?fuelType=P95&brands=SelectAll&suburb=HARRIS+PARK&postcode=2150&radius=4&bottomLeftLatitude=-33.86024583646667&bottomLeftLongitude=150.95035111793914&topRightLatitude=-33.79971301110058&topRightLongitude=151.11514603981414";
    
    const apiResponse = await fetch(fuelApiUrl, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!apiResponse.ok) {
      throw new Error(`Failed to fetch fuel prices: ${apiResponse.statusText}`);
    }

    const data = await apiResponse.json();

    await client.connect();
    const database = client.db(); // Uses the default database from the connection string
    const collection = database.collection('fuelPrice');

    const result = await collection.insertOne({
      ...data,
      fetchedAt: new Date()
    });

    response.status(200).json({
      success: true,
      message: "Fuel prices synced successfully",
      insertedId: result.insertedId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error syncing fuel prices:", error);
    response.status(500).json({
      success: false,
      message: "Failed to sync fuel prices",
      error: error.message
    });
  } finally {
    await client.close();
  }
}
