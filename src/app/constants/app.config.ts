const studentMenus = [{
    title: 'My Profile',
    url: '/profile',
    icon: 'person-add-outline'
}, {
    title: 'Change Password',
    url: '/change-password',
    icon: 'key-outline'
}, {
    title: 'Tasks',
    url: '/student/tasks',
    icon: 'walk-outline'
}, {
    title: 'Rewards',
    url: '/student/rewards',
    icon: 'ribbon-outline'
}];


const teacherMenus = [{
    title: 'My Profile',
    url: '/profile',
    icon: 'body-outline'
}, {
    title: 'Change Password',
    url: '/change-password',
    icon: 'key-outline'
},
{
    title: 'Dashboard',
    url: '/teacher/dashboard',
    icon: 'home-outline'
},
{
    title: 'My Children',
    url: '/teacher/my-children',
    icon: 'people-outline'
}, {
    title: 'Tasks',
    url: '/teacher/tasks',
    icon: 'bicycle-outline'
}];


export const appConfig = {
    sideMenu: {
        student: studentMenus,
        teacher: teacherMenus
    }
};
