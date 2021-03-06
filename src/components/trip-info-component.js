import moment from 'moment';
import AbstractSmartComponent from './abstract-smart-component';

const getSortedEvents = (events) => {
  return events.sort((a, b) => {
    return Date.parse(a.dateFrom) - Date.parse(b.dateFrom);
  });
};

const getCities = (events) => {
  const sortedEvents = getSortedEvents(events);
  const cities = sortedEvents.map((event) => event.destination.name);
  return cities;
};

const getDates = (events) => {
  const sortedEvents = getSortedEvents(events);
  const startDate = sortedEvents[0].dateFrom;
  const endDate = sortedEvents[events.length - 1].dateTo;

  return [
    startDate,
    endDate
  ];
};

const createTripInfoTitle = (cities) => {
  let [startCity, secondCity, endCity, ...rest] = [];
  let citiesMarkup = ``;
  if (cities.length > 3) {
    [startCity, ...rest] = cities;
    endCity = rest[rest.length - 1];
    citiesMarkup = `${startCity} &mdash; ... &mdash; ${endCity}`;
  } else if (cities.length === 3) {
    [startCity, secondCity, endCity] = cities;
    citiesMarkup = `${startCity} &mdash; ${secondCity} &mdash; ${endCity}`;
  } else {
    [startCity, endCity] = cities;
    citiesMarkup = `${startCity} &mdash; ${endCity}`;
  }
  return `<h1 class="trip-info__title">${citiesMarkup}</h1>`;
};

const createTripInfoTemplate = (events) => {
  const tripInfoTitle = createTripInfoTitle(getCities(events));
  let [startDate, endDate] = getDates(events);
  startDate = moment(startDate);
  endDate = moment(endDate);
  const startMonth = startDate.format(`MMM`);
  const startDay = startDate.format(`D`);
  const endMonth = endDate.format(`MMM`);
  const endDay = endDate.format(`D`);

  const eventsCost = events.reduce((acc, current) => {
    return acc + current.basePrice;
  }, 0);

  const offers = events.reduce((a, b) => {
    return a.concat(b.offers);
  }, []);

  const offersPrice = offers.reduce((a, b) => a + b.price, 0);
  const totalPrice = eventsCost + offersPrice;

  return (
    `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      ${tripInfoTitle}

      <p class="trip-info__dates">${startMonth} ${startDay}&nbsp;&mdash;&nbsp;${endMonth} ${endDay}</p>
    </div>
    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
    </p>
    </section>`
  );
};

export default class TripInfoComponent extends AbstractSmartComponent {
  constructor() {
    super();

    this._events = null;
  }

  recoveryListeners() {

  }

  getTemplate() {
    return createTripInfoTemplate(this._events);
  }

  setEvents(events) {
    this._events = events;
  }

  resetEvents(newEvents) {
    this._events = newEvents;
  }

  rerender() {
    super.rerender();
  }
}
