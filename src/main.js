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
const loadMoreBtn = document.querySelector('.loadMoreBtn');
const perPage = 15;

let totalHits = 0;
let currentPage = 1;
let currentQuery = '';

document.addEventListener('DOMContentLoaded', () => {
  validateInput();
  hideLoadMoreButton();
  hideLoader();
});

inputSearch.addEventListener('input', validateInput);

formData.addEventListener('submit', async ev => {
  ev.preventDefault();

  const searchQuery = inputSearch.value.trim();

  if (searchQuery !== currentQuery) {
    currentPage = 1;
    totalHits = 0;
    clearGallery();
    hideLoadMoreButton();
  }
  currentQuery = searchQuery;

  if (!validateInput()) {
    iziToast.error({
      title: 'Поле не може бути порожнім',
      message: 'Будь ласка, введіть текст для пошуку.',
      position: 'topRight',
    });
    hideLoadMoreButton();
    return;
  }

  showLoader();

  try {
    const responseData = await getImagesByQuery(currentQuery, currentPage);
    const images = responseData.hits;
    totalHits = responseData.totalHits;

    if (images.length === 0) {
      iziToast.info({
        title: 'Відхилено',
        message: 'За Вашим запитом зображень не знайдено.',
        position: 'topRight',
      });
      hideLoadMoreButton();
    } else {
      createGallery(images);
      updateLoadMoreButtonState();
    }
  } catch (error) {
    iziToast.error({
      title: 'Помилка',
      message:
        'Під час завантаження зображень сталася помилка. Спробуйте ще раз.',
      position: 'topRight',
    });
    clearGallery();
    hideLoadMoreButton();
  } finally {
    hideLoader();
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

loadMoreBtn.addEventListener('click', async () => {
  currentPage++;
  showLoader();
  hideLoadMoreButton();

  try {
    const responseData = await getImagesByQuery(currentQuery, currentPage);
    const images = responseData.hits;

    createGallery(images);
    updateLoadMoreButtonState();
    smoothScrollToGallery();
  } catch (error) {
    iziToast.error({
      title: 'Помилка',
      message:
        'Під час завантаження додаткових зображень сталася помилка. Спробуйте ще раз.',
      position: 'topRight',
    });
    hideLoadMoreButton();
  } finally {
    hideLoader();
  }
});

function updateLoadMoreButtonState() {
  const totalPages = Math.ceil(totalHits / perPage);

  if (currentPage >= totalPages || totalHits === 0) {
    hideLoadMoreButton();

    if (totalHits > 0) {
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'bottomCenter',
      });
    }
  } else {
    showLoadMoreButton();
  }
}

function smoothScrollToGallery() {
  const galleryCard = gallery.firstElementChild;

  if (galleryCard) {
    const cardRect = galleryCard.getBoundingClientRect();
    const cardHeight = cardRect.height;

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
}
