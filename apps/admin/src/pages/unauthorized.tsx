import { type NextPage } from "next/types";

const Unauthorized: NextPage = () => {
	
  return (
		<div className="surface-0 text-700 text-center">
				<div className="text-blue-600 text-2xl font-bold mb-3"><i className="pi pi-discord"></i>&nbsp;Unauthorized</div>
				<div className="text-700 text-2xl mb-5">You are not authorized to view this page.</div>
		</div>
  );
};

export default Unauthorized;