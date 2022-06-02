import './css/styles.css';
import { fetchCountries } from './js/fetch-countries';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import countriesList from './templates/countries-list.hbs';
import countryInfo from './templates/country-info.hbs';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchEl: document.querySelector('#search-box'),
  countryListEl: document.querySelector('.country-list'),
  countryInfoEl: document.querySelector('.country-info'),
};

refs.searchEl.addEventListener(
  'input',
  debounce(onSearchElInput, DEBOUNCE_DELAY)
);

function onSearchElInput(evt) {
  if (evt.target.value === '') {
    deleteAllMarkup();
    return;
  }

  fetchCountries(evt.target.value.trim())
    .then(data => {
      if (data.status) {
        return Promise.reject(res);
      }
      return markup(data);
    })
    .catch(err => {
      deleteAllMarkup();
      onError();
    });
}

function markup(data) {
  if (data.length > 10) {
    deleteAllMarkup();
    return Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  }

  if (data.length <= 10 && data.length > 1) {
    deleteAllMarkup();
    appendCountryListMarkup(data);
  }

  if (data.length === 1) {
    const languages = Object.values(data[0].languages).join(', ');
    data[0].languages = languages;

    deleteAllMarkup();

    appendCountryInfoMarkup(data);
  }
}

function appendCountryListMarkup(data) {
  refs.countryListEl.insertAdjacentHTML('beforeend', countriesList(data));
}

function appendCountryInfoMarkup(data) {
  refs.countryInfoEl.insertAdjacentHTML('beforeend', countryInfo(data));
}

function deleteMarkupCountryInfoEl() {
  refs.countryInfoEl.innerHTML = '';
}

function deleteMarkupCountryListEl() {
  refs.countryListEl.innerHTML = '';
}

function deleteAllMarkup() {
  deleteMarkupCountryInfoEl();
  deleteMarkupCountryListEl();
}

function onError() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}
