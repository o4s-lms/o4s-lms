import { useLocalStorage } from "usehooks-ts"

function CookieConsent() {
  const [cookieConsent, setCookieConsent] = useLocalStorage('cookieConsent', false)

  const ok = () => {
    setCookieConsent(true)
  }

  return (
    <div
        className="CookieConsent fixed bottom-0 left-0 z-50 flex w-full flex-wrap items-baseline justify-center border-t-2 border-gray-700 bg-black p-0 text-sm text-white">
      <div className="mx-5 my-3 w-full flex-1 shrink-0 sm:my-0 sm:w-auto">
        <span className="dark">
          Este sítio utiliza cookies para proporcionar uma melhor experiência de navegação. Ler a nossa
          <a href="/legal/privacidade" className="underline">política de privacidade</a> para saber mais.
        </span>
      </div>
      <div className="shrink-0 p-2">
        <button onClick={ok} id="rcc-confirm-button" aria-label="Accept cookies" className="cursor-pointer rounded-md border border-white bg-black px-2 py-1 text-white">Ok</button>
      </div>
    </div>
  )
}
