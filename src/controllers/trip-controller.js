import {renderElement, RenderPosition} from '../utils/render';
import DayComponent from "../components/day";
import PointController from './point-controller';

const renderEvents = (container, events, onDataChange, onViewChange) => {
  const controllers = [];
  const dates = new Set();
  events.forEach((event) => {
    const eventDate = new Date(event.startDate);
    const eventDateFormatted = eventDate.toDateString();
    dates.add(eventDateFormatted);
  });


  Array.from(dates).forEach((date, index) => {
    const eventsOnDay = events.filter((ev) => {
      const eventDate = new Date(ev.startDate);
      const eventDateFormatted = eventDate.toDateString();
      return eventDateFormatted === date;
    });

    const day = new DayComponent(index + 1, date).getElement();
    const eventsList = day.querySelector(`.trip-events__list`);
    controllers.push(eventsOnDay.map((event) => {
      const pointController = new PointController(eventsList, onDataChange, onViewChange);
      pointController.render(event);
      return pointController;
    }));
    renderElement(container, day, RenderPosition.BEFOREEND);
  });
  return controllers.reduce((a, b) => a.concat(b));
};


export default class TripController {
  constructor(container) {
    this._container = container;
    this._events = [];
    this._pointControllers = [];
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
  }

  render(events) {
    const container = this._container.getElement();
    this._events = events;

    const pointControllers = renderEvents(container, events, this._onDataChange, this._onViewChange);
    this._pointControllers = this._pointControllers.concat(pointControllers);
  }

  _onDataChange(pointController, oldData, newData) {
    const index = this._events.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._events = [].concat(this._events.slice(0, index), newData, this._events.slice(index + 1));

    pointController.render(this._events[index]);
  }

  _onViewChange() {
    this._pointControllers.forEach((it) => {
      it.setDefaultView();
    });
  }
}
