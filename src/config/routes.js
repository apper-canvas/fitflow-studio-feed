import Schedule from '../pages/Schedule';
import MyBookings from '../pages/MyBookings';
import Classes from '../pages/Classes';
import Instructors from '../pages/Instructors';
import NotFound from '../pages/NotFound';

export const routes = {
  schedule: {
    id: 'schedule',
    label: 'Schedule',
    path: '/schedule',
    icon: 'Calendar',
    component: Schedule
  },
  myBookings: {
    id: 'myBookings',
    label: 'My Bookings',
    path: '/my-bookings',
    icon: 'BookOpen',
    component: MyBookings
  },
  classes: {
    id: 'classes',
    label: 'Classes',
    path: '/classes',
    icon: 'Activity',
    component: Classes
  },
  instructors: {
    id: 'instructors',
    label: 'Instructors',
    path: '/instructors',
    icon: 'Users',
    component: Instructors
  },
  notFound: {
    id: 'notFound',
    label: 'Not Found',
    path: '*',
    component: NotFound
  }
};

export const routeArray = Object.values(routes);