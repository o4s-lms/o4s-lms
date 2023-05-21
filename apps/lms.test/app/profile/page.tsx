import { getToken } from "@/lib/get-token";
import { createClient } from "@o4s/generated-wundergraph";
import { Grid, Col, Card, Text, Metric, TextInput, Title } from "@tremor/react";

export default async function Profile() {
	const { authenticated, token, bearer } = await getToken();

	const client = createClient({
		customFetch: fetch,
		extraHeaders: {
			Authorization: `Bearer ${bearer}`,
		},
	});

	return (
		<>
		<div className="z-10 w-full max-w-screen-xl px-5 xl:px-0">
			<Grid numCols={1} numColsSm={2} numColsLg={3} className="gap-2">
					<Col numColSpan={1} numColSpanLg={2}>
							<Card>
								<Title className="px-5 py-2 text-black">Name</Title>
								<Metric><TextInput placeholder={token?.name} /></Metric>
								<Title className="px-5 py-2 text-black">Email</Title>
								<Metric><TextInput placeholder={token?.email} disabled={true}/></Metric>
							</Card>
					</Col>
					<Card>
						<Text>Title</Text>
						<Metric>KPI 2</Metric>
					</Card>
					<Col>
							<Card>
								<Text>Title</Text>
								<Metric>KPI 3</Metric>
							</Card>
					</Col>
					<Card>
						<Text>Title</Text>
						<Metric>KPI 4</Metric>
					</Card>
					<Card>
						<Text>Title</Text>
						<Metric>KPI 5</Metric>
					</Card>
			</Grid>
		</div>
		</>
	)
};