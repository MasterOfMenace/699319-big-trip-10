const createFilterMarkup = (filter) => {
  const {name, title} = filter;

  const isChecked = (name === `everything`) ? `checked` : ``;

  return (
    `<div class="trip-filters__filter">
      <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name}" ${isChecked}>
      <label class="trip-filters__filter-label" for="filter-everything">${title}</label>
    </div>`
  );
};

const createFiltersTemplate = (filters) => {
  const filtersMarkup = filters.map((it) => createFilterMarkup(it)).join(`\n`);

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filtersMarkup}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};
export {createFiltersTemplate};