import { GRPC as Cerbos } from '@cerbos/grpc';

export const cerbos = new Cerbos(`${process.env.CERBOS_URL}`, { tls: false });