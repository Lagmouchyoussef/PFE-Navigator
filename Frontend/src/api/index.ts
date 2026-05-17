// Central API export — import from here instead of individual files.
// Example: import { authApi, usersApi } from '../api';

export { authApi } from './auth';
export { fetchClient } from './client';
export { messagesApi, notificationsApi, adminNotesApi, resourcesApi } from './communications';
export {
  projectsApi,
  documentsApi,
  documentRemarksApi,
  evaluationsApi,
  appointmentsApi,
  milestonesApi,
  feedbacksApi,
  juryAssignmentsApi,
} from './projects';
export { studentsApi } from './students';
export { usersApi } from './users';
