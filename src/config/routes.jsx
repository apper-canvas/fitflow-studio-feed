import HomePage from '@/components/pages/HomePage';
import ClassesPage from '@/components/pages/ClassesPage';
import MyBookingsPage from '@/components/pages/MyBookingsPage';
import InstructorsPage from '@/components/pages/InstructorsPage';
import SchedulePage from '@/components/pages/SchedulePage';
import NotFoundPage from '@/components/pages/NotFoundPage';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/home',
    icon: 'Home',
    component: HomePage
  },
  schedule: {
    id: 'schedule',
    label: 'Schedule',
    path: '/schedule',
    icon: 'Calendar',
    component: SchedulePage
  },
  classes: {
    id: 'classes',
    label: 'Classes',
    path: '/classes',
    icon: 'Activity',
    component: ClassesPage
  },
  instructors: {
    id: 'instructors',
    label: 'Instructors',
    path: '/instructors',
    icon: 'Users',
    component: InstructorsPage
  },
  bookings: {
    id: 'bookings',
    label: 'My Bookings',
    path: '/bookings',
    icon: 'BookOpen',
    component: MyBookingsPage
  },
  notFound: {
    id: 'notFound',
    label: '404',
    path: '*',
    icon: 'AlertCircle',
    component: NotFoundPage
  }
};

export const routeArray = Object.values(routes);

export default routes;