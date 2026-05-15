import { Scores } from './types';

export const INITIAL_SCORES: Scores = {
  rapport:      null,
  presentation: null,
  technique:    null,
  innovation:   null,
  delais:       null,
  pfeSupervisor: null,
  pfeJury:       null,
};

export const COEFFICIENTS: Record<keyof Scores, number> = {
  rapport:      3,
  presentation: 2,
  technique:    2,
  innovation:   1,
  delais:       1,
  pfeSupervisor: 1, 
  pfeJury:       1,
};

export const SCORE_LABELS: Record<keyof Scores, string> = {
  rapport:      'Thesis Report',
  presentation: 'Oral Defense',
  technique:    'Technical Proficiency',
  innovation:   'Innovation & Research',
  delais:       'Deadline Compliance',
  pfeSupervisor: 'Supervisor Grade (50%)',
  pfeJury:       'Jury Grade (50%)',
};
