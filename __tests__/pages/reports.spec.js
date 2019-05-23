import MockDate from 'mockdate';
import { Store } from 'vuex-mock-store';
import { shallowMount } from '@vue/test-utils';
import Reports from '@/pages/reports';
import { parse } from 'date-fns';

describe('Reports', () => {
  let wrapper;

  MockDate.set('2019-01-31T01:23:45');

  const $store = new Store({
    getters: {
      'reports/getChartData': () => {},
      'reports/getSummary': () => []
    }
  });

  const factory = () =>
    shallowMount(Reports, {
      mocks: {
        $store
      }
    });

  beforeEach(() => {
    $store.reset();
  });

  describe('when change period to day', () => {
    beforeEach(() => {
      wrapper = factory();
      wrapper.setData({ currentPeriod: 'day' });
    });

    it('dispatch reports/getReports', () => {
      expect($store.dispatch).toHaveBeenLastCalledWith('reports/getReports', {
        start: parse('2019-01-31T00:00:00'),
        end: parse('2019-01-31T23:59:59.999'),
        period: 'hour'
      });
    });
  });

  describe('when change period to week', () => {
    beforeEach(() => {
      wrapper = factory();
      wrapper.setData({ currentPeriod: 'week' });
    });

    it('dispatch reports/getReports', () => {
      expect($store.dispatch).toHaveBeenLastCalledWith('reports/getReports', {
        start: parse('2019-01-27T00:00:00'),
        end: parse('2019-02-02T23:59:59.999'),
        period: 'day'
      });
    });
  });

  describe('when change period to month', () => {
    beforeEach(() => {
      wrapper = factory();
      wrapper.setData({ currentPeriod: 'month' });
    });

    it('dispatch reports/getReports', () => {
      expect($store.dispatch).toHaveBeenLastCalledWith('reports/getReports', {
        start: parse('2019-01-01T00:00:00'),
        end: parse('2019-01-31T23:59:59.999'),
        period: 'day'
      });
    });
  });

  describe('when change period to year', () => {
    beforeEach(() => {
      wrapper = factory();
      wrapper.setData({ currentPeriod: 'year' });
    });

    it('dispatch reports/getReports', () => {
      expect($store.dispatch).toHaveBeenLastCalledWith('reports/getReports', {
        start: parse('2019-01-01T00:00:00'),
        end: parse('2019-12-31T23:59:59.999'),
        period: 'month'
      });
    });
  });

  describe('when slide left', () => {
    beforeEach(() => {
      wrapper = factory();
      wrapper.setData({ currentPeriod: 'week' });
      wrapper.find('.loop-slider').vm.$emit('slide-left');
    });

    it('set prev weeks', () => {
      expect($store.dispatch).toHaveBeenLastCalledWith('reports/getReports', {
        start: parse('2019-01-20T00:00:00'),
        end: parse('2019-01-26T23:59:59.999'),
        period: 'day'
      });
    });
  });

  describe('when slide right', () => {
    beforeEach(() => {
      wrapper = factory();
      wrapper.setData({ currentPeriod: 'week' });
      wrapper.find('.loop-slider').vm.$emit('slide-right');
    });

    it('set next weeks', () => {
      expect($store.dispatch).toHaveBeenLastCalledWith('reports/getReports', {
        start: parse('2019-02-03T00:00:00'),
        end: parse('2019-02-09T23:59:59.999'),
        period: 'day'
      });
    });
  });

  describe('when click today-button', () => {
    beforeEach(() => {
      wrapper = factory();
      wrapper.setData({ currentPeriod: 'week' });
      wrapper.find('.loop-slider').vm.$emit('slide-right');
      wrapper.find('.date-header').vm.$emit('today');
    });

    it('set today weeks', () => {
      expect($store.dispatch).toHaveBeenLastCalledWith('reports/getReports', {
        start: parse('2019-01-27T00:00:00'),
        end: parse('2019-02-02T23:59:59.999'),
        period: 'day'
      });
    });
  });
});
