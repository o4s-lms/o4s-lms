export const VERSION = 'v1.0.0';

export const TICKETS_CATEGORY = [
  { label: 'Other', value: 'other' },
  { label: 'Bug', value: 'bug' },
  { label: 'Account', value: 'account' },
  { label: 'Payments', value: 'payments' },
  { label: 'Course/Lesson', value: 'learn' },
];

export const PRIORITY = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
];

export const TICKETS_STATUS = [
  { label: 'New', value: 'new' },
  { label: 'Done', value: 'done' },
  { label: 'Canceled', value: 'canceled' },
  { label: 'Unanswered', value: 'unanswered' },
];

export const ANNOUNCEMENT_TYPES = [
  { label: 'General', value: 'general' },
  { label: 'Announcement', value: 'announcement' },
  { label: 'Course Update', value: 'course' },
  { label: 'Assignment', value: 'assignment' },
  { label: 'Achievement', value: 'achievement' },
  { label: 'Quiz', value: 'quiz' },
  { label: 'Discussion', value: 'discussion' },
  { label: 'System', value: 'system' },
  { label: 'Maintenance', value: 'maintenance' },
];

export const NOTIFICATIONS_TYPES = [
  { label: 'Unread', value: 'unread' },
  { label: 'All', value: 'all' },
  { label: 'General', value: 'general' },
  { label: 'Announcement', value: 'announcement' },
  { label: 'Course Update', value: 'course' },
  { label: 'Assignment', value: 'assignment' },
  { label: 'Achievement', value: 'achievement' },
  { label: 'Quiz', value: 'quiz' },
  { label: 'Discussion', value: 'discussion' },
  { label: 'System', value: 'system' },
  { label: 'Maintenance', value: 'maintenance' },
];

export const languages = [
  { label: 'Português', value: 'pt' },
  { label: 'English', value: 'en' },
  { label: 'Français', value: 'fr' },
  { label: 'Españhol', value: 'es' },
] as const;