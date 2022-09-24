import React from 'react'

import Link from 'next/link'

export default function BottomNav() {
  return (
    <>
     <div className="w-screen justify-center md:justify-start bg-bottomNav flex">
            <div className="flex columns-1 flex-col text-left justify-center p-20">
              <Link href="#">
                <a className="text-white text-sm pt-1 pb-1 text-center md:text-left font-nunito">
                  HOME
                </a>
              </Link>
              <Link href="#">
                <a className="text-white text-sm pt-1 pb-1 text-center md:text-left font-nunito">
                {"FAQ's"}
                </a>
              </Link>
              <Link href="#">
                <a className="text-white text-sm pt-1 pb-1 text-center md:text-left font-nunito">
                  COMMUNITY
                </a>
              </Link>
              <Link href="#">
                <a className="text-white text-sm  pt-1 pb-1 text-center md:text-left font-nunito">
                  PRIVACY TERMS
                </a>
              </Link>
            </div>
          </div>
    </>
  )
}
