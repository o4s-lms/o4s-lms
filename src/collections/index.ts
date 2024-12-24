import { Categories } from './Categories';
import { Media } from './Media';
import { Pages } from './Pages';
import { Posts } from './Posts';
import { Courses } from './Courses';
import { Modules } from './Courses/Modules';
import { Lessons } from './Courses/Lessons';
import { CourseProgress } from './Courses/Progress';
import { ModuleProgress } from './Courses/Progress/ModuleProgress';
import { LessonProgress } from './Courses/Progress/LessonProgress';
import { Favorites } from './Favorites';
import { Transactions } from './Transactions';
import { Newsletter } from './Newsletter';
import { Users } from './Users';
import { Settings } from './Users/Settings';

export const collections = [
  Pages,
  Posts,
  Media,
  Categories,
  Courses,
  Modules,
  Lessons,
  CourseProgress,
  ModuleProgress,
  LessonProgress,
  Favorites,
  Transactions,
  Newsletter,
  Users,
  Settings,
]