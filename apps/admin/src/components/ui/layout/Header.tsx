import Head from "next/head";

type Props = {
	title: string | undefined;
};

const Header = ({ title }: Props) => (
  <Head>
		<meta charSet="UTF-8" key="charset" />
		<title>{title}</title>
		<meta name="description" content="Open source Learning Managment System" />
		<link rel="icon" href="/favicon.ico" />
	</Head>
);

export default Header;