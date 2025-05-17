import axios, { AxiosError } from 'axios';
import asyncRetry from 'async-retry';
const retry = asyncRetry;
import redis from '../../utils/redis';
import prisma from '../../prisma/client';
import { config } from '../../config/index';
import logger from '../../utils/logger';

const WEATHER_TTL = 60 * 15; // 15 min

export async function getWeather(city: string, userId: string) {
  const key = `weather:${city.toLowerCase()}`;

  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  try {
    const data = await retry(
      async () => {
        const response = await axios.get(
          'https://api.openweathermap.org/data/2.5/weather',
          { params: { q: city, appid: config.apiKey, units: 'metric' } },
        );
        return response.data;
      },
      { retries: 3, minTimeout: 500 },
    );

    await redis.set(key, JSON.stringify(data), 'EX', WEATHER_TTL);

    await prisma.weatherQuery.create({
      data: { userId, city, data },
    });

    return data;
  } catch (error) {
    logger.error({ error, city }, 'Error fetching weather data');
    
    // Handle specific API errors
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message?: string }>;
      if (axiosError.response) {
        if (axiosError.response.status === 404) {
          throw { status: 404, message: `City not found: ${city}` };
        }
        if (axiosError.response.status === 401) {
          throw { status: 401, message: 'Invalid API key' };
        }
        throw { 
          status: axiosError.response.status, 
          message: axiosError.response?.data?.message || 'Error from weather service' 
        };
      }
    }
    
    // Generic error
    throw { status: 500, message: 'Failed to fetch weather data' };
  }
}
