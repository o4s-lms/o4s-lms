import React, { useState } from "react"

export default function HamburgerAnimated() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex min-h-screen flex-col justify-center bg-gray-100 py-6 sm:py-12">
        <div className="relative mx-auto py-3 sm:max-w-xl">
          <nav>
            <button
              className="relative h-10 w-10 rounded-sm bg-white text-gray-500 focus:outline-none"
              onClick={() => setOpen(!open)}>
              <span className="sr-only">Open main menu</span>
              <div className="absolute left-1/2 top-1/2 block w-5 -translate-x-1/2 -translate-y-1/2">
                <span
                  aria-hidden="true"
                  className={`absolute block h-0.5 w-5 bg-current transition duration-500 ease-in-out${
                    open ? "rotate-45" : "-translate-y-1.5"
                  }`}></span>
                <span
                  aria-hidden="true"
                  className={`absolute block  h-0.5 w-5 bg-current   transition duration-500 ease-in-out${
                    open && "opacity-0"
                  }`}></span>
                <span
                  aria-hidden="true"
                  className={`absolute block  h-0.5 w-5 bg-current transition  duration-500 ease-in-out${
                    open ? "-rotate-45" : "translate-y-1.5"
                  }`}></span>
              </div>
            </button>
          </nav>
        </div>
      </div>
    </>
  )
}
