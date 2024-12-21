export const TRANSACTION = `
  email
  orderId
  customerId
  transactionId
  provider
  amount
  discount
  tax
  total
  status
`;

export const gql = async (query: string): Promise<any> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/graphql`,
      {
        body: JSON.stringify({
          query,
        }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      },
    );

    const { data, errors } = await res.json();

    if (errors) {
      throw new Error(errors[0].message);
    }

    if (res.ok && data) {
      return data;
    }
  } catch (e: unknown) {
    throw new Error(e as string);
  }
};
