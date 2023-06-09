import { useRouter } from "next/router";
import { useRef } from "react";
import { Button } from "primereact/button";
import { Toast } from 'primereact/toast';

type Props = {
	currentFilter: string;
}

const UsersHeader = ({ currentFilter }: Props) => {
	const router = useRouter();
	const toast = useRef<Toast>(null);

	return (
		<><Toast ref={toast} />
			<div className="surface-0">
				<ul className="list-none p-0 m-0 flex align-items-center font-medium mb-3">
					<li>
						<a onClick={() => { void router.push('/'); }} className="text-500 no-underline line-height-3 cursor-pointer">Home</a>
					</li>
					<li className="px-2">
						<i className="pi pi-angle-right text-500 line-height-3"></i>
					</li>
					<li>
						<a onClick={() => { void router.push('/users') }} className="text-500 no-underline line-height-3 cursor-pointer">Users</a>
					</li>
					<li className="px-2">
						<i className="pi pi-angle-right text-500 line-height-3"></i>
					</li>
					<li>
						<span className="text-900 line-height-3">Manage Users</span>
					</li>
				</ul>
				<div className="flex align-items-start flex-column lg:justify-content-between lg:flex-row">
					<div>
						<div className="font-medium text-3xl text-900">Filter: {currentFilter}</div>
						<div className="flex align-items-center text-700 flex-wrap">
							<div className="mr-5 flex align-items-center mt-3">
								<i className="pi pi-users mr-2"></i>
								<span>332 Active Users</span>
							</div>
							<div className="mr-5 flex align-items-center mt-3">
								<i className="pi pi-globe mr-2"></i>
								<span>9402 Sessions</span>
							</div>
							<div className="flex align-items-center mt-3">
								<i className="pi pi-clock mr-2"></i>
								<span>2.32m Avg. Duration</span>
							</div>
						</div>
					</div>
					<div className="mt-3 lg:mt-0">
						<Button label="Invite" className="p-button-outlined mr-2" icon="pi pi-user-plus" />
						<Button onClick={() => { void router.push('/users/student') }} label="Students" className="p-button-outlined mr-2" icon="pi pi-user" />
						<Button onClick={() => { void router.push('/users/teacher') }} label="Teachers" className="p-button-outlined mr-2" icon="pi pi-user" />
						<Button onClick={() => { void router.push('/users/author') }} label="Authors" className="p-button-outlined mr-2" icon="pi pi-user" />
						<Button onClick={() => { void router.push('/users/observator') }} label="Observators" className="p-button-outlined mr-2" icon="pi pi-user" />
						<Button onClick={() => { void router.push('/users/admin') }} label="Administrators" className="p-button-outlined mr-2" icon="pi pi-user" />
					</div>
				</div>
			</div>
		</>
	)
};

export default UsersHeader;