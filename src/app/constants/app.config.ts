const studentMenus = [{
    title: 'My Profile',
    url: '/profile',
    icon: 'person-add'
}, {
    title: 'Change Password',
    url: '/change-password',
    icon: 'key'
}, {
    title: 'Tasks',
    url: '/student/tasks',
    icon: 'walk'
}, {
    title: 'Rewards',
    url: '/student/rewards',
    icon: 'ribbon'
}, {
    title: 'Logout',
    url: '/logout',
    icon: 'log-out-outline'
}];


const teacherMenus = [{
    title: 'My Profile',
    url: '/profile',
    icon: 'body'
}, {
    title: 'Change Password',
    url: '/change-password',
    icon: 'key'
},
{
    title: 'Dashboard',
    url: '/teacher/dashboard',
    icon: 'home'
},
{
    title: 'My Children',
    url: '/teacher/my-children',
    icon: 'people'
}, {
    title: 'Tasks',
    url: '/teacher/tasks',
    icon: 'bicycle'
}, {
    title: 'Logout',
    url: '/logout',
    icon: 'log-out-outline'
}];


export const appConfig = {
    sideMenu: {
        student: studentMenus,
        teacher: teacherMenus
    }
};
