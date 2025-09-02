import axios from 'axios';
import queryString from 'query-string';

class AmadeusService {
  constructor() {
    this.accessToken = null;
    this.tokenExpiry = null;
    this.API_KEY = process.env.REACT_APP_AMADEUS_API_KEY;
    this.API_SECRET = process.env.REACT_APP_AMADEUS_API_SECRET;

    // Check if API credentials are configured
    if (!this.API_KEY || !this.API_SECRET ||
        this.API_KEY === 'xP2dAmjE75k0RX4V0Iqy5ZXUFc0RXKYf' ||
        this.API_SECRET === '2z8uoirGMbY1efEi') {
      console.warn('Amadeus API credentials not configured. Please set REACT_APP_AMADEUS_API_KEY and REACT_APP_AMADEUS_API_SECRET in your .env file.');
      this.isConfigured = false;
    } else {
      this.isConfigured = true;
    }
  }

  async authenticate() {
    try {
      const response = await axios.post(
        'https://test.api.amadeus.com/v1/security/oauth2/token',
        queryString.stringify({
          grant_type: 'client_credentials',
          client_id: this.API_KEY,
          client_secret: this.API_SECRET
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
      return this.accessToken;
    } catch (error) {
      console.error('Amadeus authentication failed:', error);
      throw error;
    }
  }

  async ensureAuthenticated() {
    if (!this.accessToken || Date.now() >= this.tokenExpiry) {
      await this.authenticate();
    }
    return this.accessToken;
  }

  // Flight Offers Search
  async getFlightOffers(origin, destination, departureDate, returnDate = null, adults = 1) {
    if (!this.isConfigured) {
      throw new Error('Amadeus API not configured. Please set your API credentials in the .env file.');
    }

    try {
      await this.ensureAuthenticated();
      
      const params = {
        originLocationCode: origin,
        destinationLocationCode: destination,
        departureDate: departureDate,
        adults: adults,
        currencyCode: 'USD',
        max: 5
      };

      if (returnDate) {
        params.returnDate = returnDate;
      }

      const response = await axios.get(
        'https://test.api.amadeus.com/v2/shopping/flight-offers',
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          },
          params: params
        }
      );

      return response.data;
    } catch (error) {
      console.error('Flight search error:', error);
      throw error;
    }
  }

  // Hotel Search
  async getHotels(cityCode, checkInDate, checkOutDate, adults = 1) {
    if (!this.isConfigured) {
      throw new Error('Amadeus API not configured. Please set your API credentials in the .env file.');
    }

    try {
      await this.ensureAuthenticated();

      // First, get hotel list by city
      const hotelListResponse = await axios.get(
        'https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city',
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          },
          params: {
            cityCode: cityCode,
            radius: 5,
            radiusUnit: 'KM',
            ratings: '3,4,5'
          }
        }
      );

      if (!hotelListResponse.data.data || hotelListResponse.data.data.length === 0) {
        return [];
      }

      // Get hotel offers for the first few hotels
      const hotelIds = hotelListResponse.data.data.slice(0, 5).map(hotel => hotel.hotelId);
      
      const offersResponse = await axios.get(
        'https://test.api.amadeus.com/v3/shopping/hotel-offers',
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          },
          params: {
            hotelIds: hotelIds.join(','),
            adults: adults,
            checkInDate: checkInDate,
            checkOutDate: checkOutDate,
            roomQuantity: 1
          }
        }
      );

      return offersResponse.data.data || [];
    } catch (error) {
      console.error('Hotel search error:', error);
      throw error;
    }
  }

  // Points of Interest
  async getPointsOfInterest(latitude, longitude, radius = 10) {
    if (!this.isConfigured) {
      throw new Error('Amadeus API not configured. Please set your API credentials in the .env file.');
    }

    try {
      await this.ensureAuthenticated();

      const response = await axios.get(
        'https://test.api.amadeus.com/v1/reference-data/locations/pois',
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          },
          params: {
            latitude: latitude,
            longitude: longitude,
            radius: radius,
            categories: 'SIGHTS,SHOPPING,RESTAURANT,NIGHTLIFE'
          }
        }
      );

      return response.data.data || [];
    } catch (error) {
      console.error('POI search error:', error);
      throw error;
    }
  }

  // Airport & City Search (Autocomplete)
  async getAirportCitySearch(keyword) {
    if (!this.isConfigured) {
      throw new Error('Amadeus API not configured. Please set your API credentials in the .env file.');
    }

    try {
      await this.ensureAuthenticated();

      const response = await axios.get(
        'https://test.api.amadeus.com/v1/reference-data/locations',
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          },
          params: {
            subType: 'AIRPORT,CITY',
            keyword: keyword,
            max: 5
          }
        }
      );

      return response.data.data || [];
    } catch (error) {
      console.error('Airport/City search error:', error);
      throw error;
    }
  }
}

export default new AmadeusService();