import Completion from "@/components/CheckoutPage/Completion";

type Args = {
  searchParams: Promise<{
    guest: string;
    transactionId: string;
  }>;
};
export default async function CompletionPage({
  searchParams: searchParamsPromise,
}: Args) {
  const { guest, transactionId } = await searchParamsPromise;

  return (
    <Completion transactionId={transactionId} />
  )

}