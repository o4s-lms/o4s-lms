/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Menubar } from 'primereact/menubar';
import { useUser } from "~/utils/wundergraph";
import {
  PopoverNotificationCenter,
  NotificationBell,
	NovuProvider,
} from '@novu/notification-center';

import Brand from "./Brand";
import UserAvatar from './Avatar';
import Loading from '../Loading';

import { type Hanko } from "@teamhanko/hanko-elements";


const hankoApi = 'http://joseantcordeiro.hopto.org:8000';

export default function Nav() {
	const { data: user, isLoading } = useUser()
	const router = useRouter();
  const [hanko, setHankoClient] = useState<Hanko>()
	const [error, setError] = useState<Error | null>(null)

	useEffect(() => {
    void import("@teamhanko/hanko-elements").then(({ Hanko }) => setHankoClient(new Hanko(hankoApi)));
  }, [])

	function logout() {
    hanko?.user
      .logout()
      .catch((e) => {
        setError(e)
      })
  }

  const redirectToLogin = useCallback(() => {
    void router.push('/auth/signin')
  }, [router])

  useEffect(() => hanko?.onUserLoggedOut(() => {
    redirectToLogin()
  }), [hanko, redirectToLogin])

  useEffect(() => hanko?.onSessionNotPresent(() => {
    redirectToLogin()
  }), [hanko, redirectToLogin])

  if (isLoading) {
    return <Loading />
  }

  if (!user && !isLoading) {
    void router.push('/auth/signin')
  }

  if (user && !user?.roles?.includes('admin')) {
    void router.push('/unauthorized')
  }

	const items = [
		{
			label: 'Home',
			icon: 'pi pi-fw pi-home',
			command: () => { void router.push('/') },
		},
		{
			label: 'Courses',
			icon: 'pi pi-fw pi-file',
			items: [
				{
					label: 'List',
					icon: 'pi pi-fw pi-align-center',
					command: () => { void router.push('/') },

				},
				{
					label: 'New',
					icon: 'pi pi-fw pi-plus',
					command: () => { void router.push("/courses/new") },

				},
				{
					separator: true
				},
				{
					label: 'Export',
					icon: 'pi pi-fw pi-external-link'
				},
				{
					separator: true
				},
				{
					label: 'Archive',
					icon: 'pi pi-fw pi-trash',
					items: [
						{
							label: 'List',
							icon: 'pi pi-fw pi-trash',
							command: () => { void router.push("/courses/archive") },
						},
						{
							label: 'Clean',
							icon: 'pi pi-fw pi-trash'
						}
					]
				}
			]
		},
		{
			label: 'Products',
			icon: 'pi pi-fw pi-shopping-cart',
			items: [
				{
					label: 'List',
					icon: 'pi pi-fw pi-align-left',
					command: () => { void router.push("/products"); },
				},
				{
					label: 'Payments',
					icon: 'pi pi-fw pi-align-right',
					command: () => { void router.push("/products/payments"); },
				},
				{
					label: 'Refunds',
					icon: 'pi pi-fw pi-align-center',
					command: () => { void router.push("/products/refunds"); },
				},

			]
		},
		{
			label: 'Users',
			icon: 'pi pi-fw pi-user',
			items: [
				{
					icon: 'pi pi-fw pi-bars',
					label: 'List',
					command: () => { void router.push("/users"); },
				},
				{
					label: 'Invite',
					icon: 'pi pi-fw pi-user-plus',
					command: () => { void router.push("/users/invite"); },
				},
				{
					label: 'Filter',
					icon: 'pi pi-fw pi-filter',
					items: [
						{
							label: 'Students',
							icon: 'pi pi-fw pi-users',
							command: () => { void router.push("/users/student"); },
						},
						{
							label: 'Teachers',
							icon: 'pi pi-fw pi-users',
							command: () => { void router.push("/users/teacher"); },
						},
						{
							label: 'Authors',
							icon: 'pi pi-fw pi-users',
							command: () => { void router.push("/users/author"); },
						},
						{
							label: 'Observators',
							icon: 'pi pi-fw pi-users',
							command: () => { void router.push("/users/observator"); },
						},
						{
							label: 'Administrators',
							icon: 'pi pi-fw pi-users',
							command: () => { void router.push("/users/admin"); },
						},
					]
				}
			]
		},
		{
			label: 'Certificates',
			icon: 'pi pi-fw pi-calendar',
			items: [
				{
					label: 'Sign and Send',
					icon: 'pi pi-fw pi-pencil',
					items: [
						{
							label: 'List',
							icon: 'pi pi-fw pi-calendar-plus'
						},
						{
							label: 'Delete',
							icon: 'pi pi-fw pi-calendar-minus'
						}
					]
				},
				{
					label: 'Archive',
					icon: 'pi pi-fw pi-calendar-times',
					items: [
						{
							label: 'Remove',
							icon: 'pi pi-fw pi-calendar-minus'
						}
					]
				}
			]
		},
		{
			label: 'Website',
			icon: 'pi pi-fw pi-calendar',
			items: [
				{
					label: 'Blog',
					icon: 'pi pi-fw pi-pencil',
					items: [
						{
							label: 'Posts',
							icon: 'pi pi-fw pi-calendar-plus',
							command: () => { void router.push("/site/blog/posts") },
						},
						{
							label: 'Tags',
							icon: 'pi pi-fw pi-calendar-minus',
							command: () => { void router.push("/site/blog/tags") },
						}
					]
				},
				{
					label: 'Courses/Products',
					icon: 'pi pi-fw pi-calendar-times',
				},
				{
					label: 'Faqs',
					icon: 'pi pi-fw pi-calendar-times',
				},
				{
					label: 'Testimonials',
					icon: 'pi pi-fw pi-calendar-times',
				}
			]
		},
		{
			label: 'Quit',
			icon: 'pi pi-fw pi-power-off',
			command: () => { void logout() },
		}
	];

	const start = <Brand className="mr-2"></Brand>;
	// const end = <InputText placeholder="Search" type="text" className="w-full" />;
	const end = () => { 
		return (
		<>
			<PopoverNotificationCenter colorScheme={'light'}>
				{({ unseenCount }) => <NotificationBell unseenCount={unseenCount} />}
			</PopoverNotificationCenter>
		</>
	)}

	return (
		<header>
			<div className="card">
				<NovuProvider
					subscriberId={user?.userId}
					applicationIdentifier={'Gvw8rwb0Q9vt'}
					backendUrl={'http://joseantcordeiro.hopto.org:3003'}
					socketUrl={'http://joseantcordeiro.hopto.org:3002'}
					>
					<Menubar model={items} start={start} end={end} />
				</NovuProvider>
			</div>
		</header>
	)
}