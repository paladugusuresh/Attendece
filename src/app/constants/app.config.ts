const studentMenus = [{
    title: 'My Profile',
    url: '/profile',
    icon: 'person-add'
}, {
    title: 'Change Password',
    url: '/change-password',
    icon: 'key'
}, {
    title: 'Dashboard',
    url: '/student/dashboard',
    icon: 'home'
}, {
    title: 'Holidays',
    url: '/holidays',
    icon: 'reader'
}, {
    title: 'My Attendance',
    url: '/student/attendance',
    icon: 'document-text'
}, {
    title: 'Logout',
    url: '/logout',
    icon: 'log-out-outline'
}];


const teacherMenus = [{
    title: 'My Profile',
    url: '/profile',
    icon: 'person-add'
}, {
    title: 'Change Password',
    url: '/change-password',
    icon: 'key'
}, {
    title: 'Dashboard',
    url: '/teacher/dashboard',
    icon: 'home'
}, {
    title: 'My Students',
    url: '/teacher/students',
    icon: 'school'
}, {
    title: 'Holidays',
    url: '/holidays',
    icon: 'reader'
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
