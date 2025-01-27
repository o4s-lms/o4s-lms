import { Image, Text, View, Page, Document, StyleSheet, renderToBuffer } from '@react-pdf/renderer';
import { Transaction } from '@/payload-types';
import { Fragment } from 'react';
import { createPayloadClient } from '@/lib/payload';

const InvoicePDF = async ({ transaction }: { transaction: Transaction }) => {
  const payload = await createPayloadClient();

  const config = await payload.findGlobal({
    slug: 'config',
  });

  const c = transaction.courses;
  const courses = c
    ?.map(({ value }) => value)
    .filter((course) => typeof course === 'object');

  const reciept_data = {
    invoice_no: config.invoice.num + 1,
    name: transaction?.name,
    email: transaction?.email,
    date: transaction?.processedAt,
    items: courses,
    amount: transaction?.amount,
    total: transaction?.total,
    tax: transaction?.tax,
    discount: transaction?.discount,
    transaction_id: transaction?.transactionId,
    provider: transaction?.provider,
  };

  const styles = StyleSheet.create({
    page: { fontSize: 11, paddingTop: 20, paddingLeft: 40, paddingRight: 40, lineHeight: 1.5, flexDirection: 'column' },

    spaceBetween: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', color: "#3E3E3E" },

    titleContainer: { flexDirection: 'row', marginTop: 24 },

    logo: { width: 90 },

    reportTitle: { fontSize: 16, textAlign: 'center' },

    addressTitle: { fontSize: 11, fontStyle: 'bold' },

    invoice: { fontWeight: 'bold', fontSize: 20 },

    invoiceNumber: { fontSize: 11, fontWeight: 'bold' },

    address: { fontWeight: 400, fontSize: 10 },

    theader: { marginTop: 20, fontSize: 10, fontStyle: 'bold', paddingTop: 4, paddingLeft: 7, flex: 1, height: 20, backgroundColor: '#DEDEDE', borderColor: 'whitesmoke', borderRightWidth: 1, borderBottomWidth: 1 },

    theader2: { flex: 2, borderRightWidth: 0, borderBottomWidth: 1 },

    tbody: { fontSize: 9, paddingTop: 4, paddingLeft: 7, flex: 1, borderColor: 'whitesmoke', borderRightWidth: 1, borderBottomWidth: 1 },

    total: { fontSize: 9, paddingTop: 4, paddingLeft: 7, flex: 1.5, borderColor: 'whitesmoke', borderBottomWidth: 1 },

    tbody2: { flex: 2, borderRightWidth: 1, }

  });

  const InvoiceTitle = () => (
    <View style={styles.titleContainer}>
      <View style={styles.spaceBetween}>
        <Image style={styles.logo} src='/iconO4S-100x100.png' />
        <Text style={styles.reportTitle}>{config.invoice.name}</Text>
      </View>
    </View>
  );

  const Address = () => (
    <View style={styles.titleContainer}>
      <View style={styles.spaceBetween}>
        <View>
          <Text style={styles.invoice}>Invoice </Text>
          <Text style={styles.invoiceNumber}>Invoice number: {reciept_data.invoice_no} </Text>
        </View>
        <View>
          <Text style={styles.addressTitle}>Tax ID: {config.invoice.taxID}</Text>
        </View>
      </View>
    </View>
  );

  const UserAddress = () => (
    <View style={styles.titleContainer}>
      <View style={styles.spaceBetween}>
        <View style={{ maxWidth: 200 }}>
          <Text style={styles.addressTitle}>Bill to </Text>
          <Text style={styles.address}>
            {reciept_data.name} ({reciept_data.email})
          </Text>
        </View>
        <Text style={styles.addressTitle}>{reciept_data.date}</Text>
      </View>
    </View>
  );

  const TableHead = () => (
    <View style={{ width: '100%', flexDirection: 'row', marginTop: 10 }}>
      <View style={[styles.theader, styles.theader2]}>
        <Text >Items</Text>
      </View>
      <View style={styles.theader}>
        <Text>Price</Text>
      </View>
      <View style={styles.theader}>
        <Text>Qty</Text>
      </View>
      <View style={styles.theader}>
        <Text>Amount</Text>
      </View>
    </View>
  );

  const TableBody = () => (
    reciept_data.items.map((receipt) => (
      <Fragment key={receipt.id}>
        <View style={{ width: '100%', flexDirection: 'row' }}>
          <View style={[styles.tbody, styles.tbody2]}>
            <Text >{receipt.title}</Text>
          </View>
          <View style={styles.tbody}>
            <Text>{new Intl.NumberFormat('pt-PT', {
              style: 'currency',
              currency: 'EUR',
            }).format(receipt.price / 100)}</Text>
          </View>
          <View style={styles.tbody}>
            <Text>1</Text>
          </View>
          <View style={styles.tbody}>
            <Text>{new Intl.NumberFormat('pt-PT', {
              style: 'currency',
              currency: 'EUR',
            }).format(receipt.price / 100)}</Text>
          </View>
        </View>
      </Fragment>
    ))
  );

  const TableAmount = () => (
    <View style={{ width: '100%', flexDirection: 'row', marginTop: 10 }}>
      <View style={[styles.theader, styles.theader2]}>
        <Text >Amount</Text>
      </View>
      <View style={styles.theader}>
        <Text>{new Intl.NumberFormat('pt-PT', {
          style: 'currency',
          currency: 'EUR',
        }).format(reciept_data.amount / 100)}</Text>
      </View>
    </View>
  );

  const TAbleDiscount = () => (
    <View style={{ width: '100%', flexDirection: 'row', marginTop: 10 }}>
      <View style={[styles.theader, styles.theader2]}>
        <Text >Discount</Text>
      </View>
      <View style={styles.theader}>
        <Text>{new Intl.NumberFormat('pt-PT', {
          style: 'currency',
          currency: 'EUR',
        }).format(reciept_data.discount / 100)}</Text>
      </View>
    </View>
  );

  const TableTax = () => (
    <View style={{ width: '100%', flexDirection: 'row', marginTop: 10 }}>
      <View style={[styles.theader, styles.theader2]}>
        <Text >Tax</Text>
      </View>
      <View style={styles.theader}>
        <Text>{new Intl.NumberFormat('pt-PT', {
          style: 'currency',
          currency: 'EUR',
        }).format(reciept_data.tax / 100)}</Text>
      </View>
    </View>
  );

  const TableTotal = () => (
    <View style={{ width: '100%', flexDirection: 'row', marginTop: 10 }}>
      <View style={[styles.theader, styles.theader2]}>
        <Text >Total</Text>
      </View>
      <View style={styles.theader}>
        <Text>{new Intl.NumberFormat('pt-PT', {
          style: 'currency',
          currency: 'EUR',
        }).format(reciept_data.total / 100)}</Text>
      </View>
    </View>
  );

  const pdfBuffer = async () => {
    const buffer = await renderToBuffer(
      <Document>
        <Page size="A4" style={styles.page}>
          <InvoiceTitle />
          <Address />
          <UserAddress />
          <TableHead />
          <TableBody />
          <TableAmount />
          <TAbleDiscount />
          <TableTax />
          <TableTotal />
        </Page>
      </Document>
    );

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/invoices`,
      {
        method: 'POST',
        credentials: 'include',
        body: buffer,
        /**
         * Do not manually add the Content-Type Header
         * the browser will handle this.
         *
         * headers: {
         *  'Content-Type': 'multipart/form-data'
         * }
         */
      },
    );

    if (response.ok) {
      const json = await response.json();

      await payload.update({
        collection: 'transactions', // required
        id: transaction.id, // required
        data: {
          invoice: reciept_data.invoice_no,
          pdf: json.doc.id,
        },
        depth: 0,
      })

      await payload.updateGlobal({
        slug: 'config',
        data: {
          invoice: {
            num: reciept_data.invoice_no,
          }
        },
      })

      return {
        status: 'success',
        result: json.doc.url,
      };
    }

    return {
      status: 'error',
      result: 'Something went wrong',
    };
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <InvoiceTitle />
        <Address />
        <UserAddress />
        <TableHead />
        <TableBody />
        <TableAmount />
        <TAbleDiscount />
        <TableTax />
        <TableTotal />
      </Page>
    </Document>
  )
};