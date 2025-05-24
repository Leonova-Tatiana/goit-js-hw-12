import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import getImagesByQuery from './js/pixabay-api';
import {
  clearGallery,
  createGallery,
  showLoader,
  hideLoader,
  hideLoadMoreButton,
  showLoadMoreButton,
} from './js/render-functions';

const formData = document.querySelector('.form');
const inputSearch = document.querySelector('input[name="search-text"]');
const btnSubmit = document.querySelector('button[type="submit"]');
const gallery = document.querySelector('.gallery');

document.addEventListener('DOMContentLoaded', () => {
  validateInput();
});
hideLoadMoreButton();
inputSearch.addEventListener('input', validateInput);
const requestValue = null;
formData.addEventListener('submit', async ev => {
  ev.preventDefault();

  const searchQuery = inputSearch.value.trim();

  if (!validateInput()) {
    iziToast.error({
      title: 'Поле не може бути порожнім',
      message: 'Будь ласка, введіть текст для пошуку.',
      position: 'topRight',
      timeout: 2000,
    });
    return;
  }

  showLoader();

  try {
    const images = await getImagesByQuery(searchQuery);

    clearGallery(gallery);
    showLoadMoreButton();
    if (images.length === 0) {
      iziToast.info({
        title: 'Відхилено',
        message: 'За Вашим запитом зображень не знайдено.',
        position: 'topRight',
      });
    } else {
      createGallery(images);
    }
  } catch (error) {
    console.error('Помилка під час завантаження зображень:', error);
    iziToast.error({
      title: 'Помилка',
      message:
        'Під час завантаження зображень сталася помилка. Спробуйте ще раз.',
      position: 'topRight',
    });
    clearGallery(gallery);
  } finally {
    hideLoader();
    inputSearch.value = '';
    validateInput();
  }
});

function validateInput() {
  if (inputSearch.value.trim() !== '') {
    btnSubmit.disabled = false;
    return true;
  } else {
    btnSubmit.disabled = true;
    return false;
  }
}
