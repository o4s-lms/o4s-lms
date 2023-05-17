import Navbar from "./navbar";
import { getToken } from "@/lib/get-token";

export default async function Nav() {
  const { authenticated, token } = await getToken();
  return <Navbar authenticated={authenticated} token={token} bearer={undefined} />;
}
