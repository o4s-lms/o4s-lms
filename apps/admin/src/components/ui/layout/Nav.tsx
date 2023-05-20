import React from 'react';
import { useRouter } from "next/router";
import { Menubar } from 'primereact/menubar';
import { useSession, signOut } from "next-auth/react";

import Brand from "./Brand";
import UserAvatar from './Avatar';

export default function Nav() {
	const { data: session } = useSession();
	const router = useRouter();
	if (!session) {
		void router.push("/api/auth/signin", );
	};

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
			label: 'Quit',
			icon: 'pi pi-fw pi-power-off',
			command: () => { void signOut(); },
		}
	];

	const start = <Brand className="mr-2"></Brand>;
	// const end = <InputText placeholder="Search" type="text" className="w-full" />;
	const end = <UserAvatar image={session?.user.image} />;

	return (
		<header>
			<div className="card">
				<Menubar model={items} start={start} end={end} />
			</div>
		</header>
	)
}