import { HomeState } from '.';
import { SearchState } from './search.state';
import { createSelector, createFeatureSelector } from '@ngrx/store';

/******************* Base Search State ******************/
export const getHomeState = createFeatureSelector<HomeState>('sculpture');

export const getSearchState = createSelector(
  getHomeState,
  (state: HomeState) => state.search
);

/******************* Individual selectors ******************/
function fetchSelectedFilters(state: SearchState) {
    return state.selectedFilters.toJS();
};

function fetchSelectedTaxonIds(state: SearchState) {
    return state.selectedTaxonIds.toJS();
}

/******************* Public Selector API's ******************/
export const getFilters = createSelector(getSearchState, fetchSelectedFilters);
export const getSelectedTaxonIds = createSelector(getSearchState, fetchSelectedTaxonIds);
