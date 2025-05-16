export default async function getCoordinates(location, apiKey) {
    if (!apiKey) {
        throw new Error('Google Maps API key is required');
    }
    console.log(location)

    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`
        );
        if (!response.ok) {
            throw new Error('Failed to fetch coordinates');
        }

        const data = await response.json();
        if (data.status !== 'OK') {
            throw new Error(`Geocoding failed: ${data.status}`);
        }

        const result = data.results[0];
        
        return {
            latitude: result.geometry.location.lat,
            longitude: result.geometry.location.lng,
        };
    } catch (error) {
        console.error('Error getting coordinates:', error);
        throw error;
    }
}
