import { Store } from 'vuex-mock-store';
import { shallowMount } from '@vue/test-utils';
import ActivityEditor from '@/components/organisms/activity-editor';
import ProjectList from '@/components/organisms/project-list';

describe('ActivityEditor', () => {
  let wrapper;

  const $store = new Store({});
  const $modal = { hide: jest.fn() };
  const factory = () =>
    shallowMount(ActivityEditor, {
      mocks: {
        $store,
        $modal
      },
      data() {
        return {
          id: 1,
          project: {
            id: 2,
            name: 'Development',
            color: '#ff0'
          },
          description: 'Create a database.',
          startedAt: '2019-01-01T00:12:34',
          stoppedAt: '2019-01-02T00:12:34'
        };
      }
    });

  beforeEach(() => {
    $store.reset();
  });

  describe('when click submit button', () => {
    beforeEach(() => {
      $store.dispatch.mockReturnValue(true);
      wrapper = factory();
      wrapper.find('form').trigger('submit.prevent');
    });

    it('dispatch activities/update', () => {
      expect($store.dispatch).toHaveBeenCalledWith('activities/update', {
        id: 1,
        projectId: 2,
        description: 'Create a database.',
        startedAt: '2019-01-01T00:12:34',
        stoppedAt: '2019-01-02T00:12:34'
      });
    });

    it('hide modal', () => {
      expect($modal.hide).toHaveBeenCalledWith('activity');
    });
  });

  describe('when click submit button and id is undefined', () => {
    beforeEach(() => {
      $store.dispatch.mockReturnValue(true);
      wrapper = factory();
      wrapper.setData({ id: undefined });
      wrapper.find('form').trigger('submit.prevent');
    });

    it('dispatch activities/add', () => {
      expect($store.dispatch).toHaveBeenCalledWith('activities/add', {
        projectId: 2,
        description: 'Create a database.',
        startedAt: '2019-01-01T00:12:34',
        stoppedAt: '2019-01-02T00:12:34'
      });
    });

    it('hide modal', () => {
      expect($modal.hide).toHaveBeenCalledWith('activity');
    });
  });

  describe('when click delete button', () => {
    beforeEach(() => {
      global.confirm = () => true;
      wrapper = factory();
      wrapper.find('.delete-button').vm.$emit('click');
    });

    it('dispatch activities/delete', () => {
      expect($store.dispatch).toHaveBeenCalledWith('activities/delete', 1);
    });

    it('hide modal', () => {
      expect($modal.hide).toHaveBeenCalledWith('activity');
    });
  });

  describe('when click delete button but comfirm is false', () => {
    beforeEach(() => {
      global.confirm = () => false;
      wrapper = factory();
      wrapper.find('.delete-button').vm.$emit('click');
    });

    it('does not dispatch activities/delete', () => {
      expect($store.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('when press project button', () => {
    beforeEach(() => {
      wrapper = factory();
      wrapper.find('.project-button').trigger('click');
    });

    it('emit push', () => {
      expect(wrapper.emitted('push')[0][0]).toEqual({
        component: ProjectList,
        params: { selected: 2 }
      });
    });
  });

  describe('when click share button', () => {
    beforeEach(() => {
      window.navigator.share = jest.fn();
      wrapper = factory();
      wrapper.find('.share-button').vm.$emit('click');
    });

    it('call share API', () => {
      expect(window.navigator.share).toHaveBeenCalled();
    });
  });

  describe('when click share button but cancelled', () => {
    beforeEach(() => {
      window.navigator.share = jest.fn(() => {
        const error = new Error();
        error.name = 'AbortError';
        throw error;
      });
      wrapper = factory();
    });

    it('does not throw error', () => {
      return expect(wrapper.vm.share()).resolves.toBe(undefined);
    });
  });

  describe('when click share button but throw unknown error', () => {
    beforeEach(() => {
      window.navigator.share = jest.fn(() => {
        throw new Error('UnknownError');
      });
      wrapper = factory();
    });

    it('throws Error', () => {
      return expect(wrapper.vm.share()).rejects.toThrow('UnknownError');
    });
  });
});
