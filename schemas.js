import { schema } from 'normalizr';

export const project = new schema.Entity('projects');
export const webhook = new schema.Entity('webhooks');
export const application = new schema.Entity('applications');

export const activity = new schema.Entity('activities', {
  project
});
