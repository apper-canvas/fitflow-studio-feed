import SchedulePage from '@/components/pages/SchedulePage';
import MyBookingsPage from '@/components/pages/MyBookingsPage';
import ClassesPage from '@/components/pages/ClassesPage';
import InstructorsPage from '@/components/pages/InstructorsPage';
import NotFoundPage from '@/components/pages/NotFoundPage';
import HomePage from '@/components/pages/HomePage'; // Import the new HomePage

export const routes = {
  schedule: {
    id: 'schedule',
    label: 'Schedule',
    path: '/schedule',
    icon: 'Calendar',
    component: SchedulePage
  },
  home: { // Adding Home route
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
    component: HomePage
  },
  myBookings: {
    id: 'myBookings',
    label: 'My Bookings',
    path: '/my-bookings',
    icon: 'BookOpen',
    component: MyBookingsPage
  },
  classes: {
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
  notFound: {
    id: 'notFound',
    label: 'Not Found',
    path: '*',
    component: NotFoundPage
  }
};

export const routeArray = Object.values(routes);