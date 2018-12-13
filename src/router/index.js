import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/Home';
import Calls from '@/components/Calls';
import Login from '@/components/authentication/Login';
import Logout from '@/components/authentication/Logout';
import UserOverview from '@/components/user/Overview';
import UserOverviewOnlyNames from '@/components/user/OverviewOnlyNames';
import UserNew from '@/components/user/New';
import SubscriberOverview from '@/components/subscriber/Overview';
import SubscriberOverviewOnlyNames from '@/components/subscriber/OverviewOnlyNames';
import SubscriberNew from '@/components/subscriber/New';
import SubscriberMy from '@/components/subscriber/My';
import TransmitterOverview from '@/components/transmitter/Overview';
import TransmitterOverviewOnlyNames from '@/components/transmitter/OverviewOnlyNames';
import TransmitterNew from '@/components/transmitter/New';
import TransmitterMy from '@/components/transmitter/My';

Vue.use(Router);

export default new Router({
	routes: [
		{
			path: '/',
			name: 'Home',
			component: Home,
			meta: {
				titleTranslationKey: 'pagetitle.home',
				requireAuthentication: false
			}
		},
		{
			path: '/calls',
			name: 'Calls',
			component: Calls,
			meta: {
				titleTranslationKey: 'pagetitle.calls.overview',
				requireAuthentication: true
			}
		},
		{
			path: '/login',
			name: 'Login',
			component: Login,
			meta: {
				titleTranslationKey: 'pagetitle.login',
				requireAuthentication: false
			}
		},
		{
			path: '/logout',
			name: 'Logout',
			component: Logout,
			meta: {
				titleTranslationKey: 'pagetitle.logout',
				requireAuthentication: true
			}
		},
		{
			path: '/users',
			name: 'User Overview',
			component: UserOverview,
			meta: {
				titleTranslationKey: 'pagetitle.user.overview',
				requireAuthentication: true
			}
		},
		{
			path: '/usersonlynames',
			name: 'User Overview Only Names',
			component: UserOverviewOnlyNames,
			meta: {
				titleTranslationKey: 'pagetitle.user.overview',
				requireAuthentication: true
			}
		},
		{
			path: '/users/new',
			name: 'New User',
			component: UserNew,
			meta: {
				titleTranslationKey: 'pagetitle.user.new',
				requireAuthentication: true
			}
		},
		{
			path: '/users/edit/:id',
			name: 'Edit User',
			component: UserNew,
			meta: {
				titleTranslationKey: 'pagetitle.user.edit',
				requireAuthentication: true
			}
		},
		{
			path: '/subscribers',
			name: 'Subscriber Overview',
			component: SubscriberOverview,
			meta: {
				titleTranslationKey: 'pagetitle.subscriber.overview',
				requireAuthentication: true
			}
		},
		{
			path: '/subscribersonlynames',
			name: 'Subscriber Overview Only Names',
			component: SubscriberOverviewOnlyNames,
			meta: {
				titleTranslationKey: 'pagetitle.subscriber.overview',
				requireAuthentication: true
			}
		},
		{
			path: '/subscribers/new',
			name: 'New Subscriber',
			component: SubscriberNew,
			meta: {
				titleTranslationKey: 'pagetitle.subscriber.new',
				requireAuthentication: true
			}
		},
		{
			path: '/mysubscribers',
			name: 'My Subscribers',
			component: SubscriberMy,
			meta: {
				titleTranslationKey: 'pagetitle.subscriber.my',
				requireAuthentication: true
			}
		},
		{
			path: '/subscribers/edit/:id',
			name: 'Edit Subscriber',
			component: SubscriberNew,
			meta: {
				titleTranslationKey: 'pagetitle.subscriber.edit',
				requireAuthentication: true
			}
		},
		{
			path: '/transmitters',
			name: 'Transmitter Overview',
			component: TransmitterOverview,
			meta: {
				titleTranslationKey: 'pagetitle.transmitter.overview',
				requireAuthentication: true
			}
		},
		{
			path: '/trasnmiitersonlynames',
			name: 'Transmitter Overview Only Names',
			component: TransmitterOverviewOnlyNames,
			meta: {
				titleTranslationKey: 'pagetitle.transmitter.overview',
				requireAuthentication: true
			}
		},
		{
			path: '/transmitters/new',
			name: 'New Transmitter',
			component: TransmitterNew,
			meta: {
				titleTranslationKey: 'pagetitle.transmitter.new',
				requireAuthentication: true
			}
		},
		{
			path: '/mytransmitters',
			name: 'My Transmitters',
			component: TransmitterMy,
			meta: {
				titleTranslationKey: 'pagetitle.transmitter.my',
				requireAuthentication: true
			}
		},
		{
			path: '/transmitters/edit/:id',
			name: 'Edit Transmitter',
			component: TransmitterNew,
			meta: {
				titleTranslationKey: 'pagetitle.transmitter.edit',
				requireAuthentication: true
			}
		}
	]
});
