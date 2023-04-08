import Vue from 'vue';
import Router from 'vue-router';

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => {});
};

Vue.use(Router);

const router = new Router({
    scrollBehavior: () => ({ y: 0 }),
    routes: [
        {
            path: '*',
            redirect: '/home'
        },
        {
            path: '/mode1',
            component: () => import('@/views/mode1.vue')
        },
        {
            path: '/home',
            name: 'home',
            component: () => import('@/views/home.vue')
        }
    ]
});

export default router;
