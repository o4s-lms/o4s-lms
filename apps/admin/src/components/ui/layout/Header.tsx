import Head from "next/head";

type Props = {
	title: string | undefined;
};

const Header = ({ title }: Props) => (
  <Head>
		<meta charSet="UTF-8" key="charset" />
		<title>{title}</title>
		<meta name="description" content="Cursos O4S - Projeto Ser Sustentável - ADMIN" />
		<link rel="icon" href="/favicon.ico" />
	</Head>
);

export default Header;