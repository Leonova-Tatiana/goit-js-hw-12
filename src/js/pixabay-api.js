import axios from 'axios';
axios.defaults.baseURL = 'https://pixabay.com/api/';
export default async function getImagesByQuery(query, page = 1) {
  try {
    const response = await axios.get('', {
      params: {
        per_page: 15,
        page: page,
        key: '50399513-0102622743a29b0122ce40bab',
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
