import { register } from "@teamhanko/hanko-elements"

export const hankoApi = `${process.env.PUBLIC_HANKO_API}`

export const { hanko } = await register("http://joseantcordeiro.hopto.org:8000")