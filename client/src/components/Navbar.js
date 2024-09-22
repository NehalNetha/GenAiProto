"use client"
import { Cross, Menu, X } from 'lucide-react'
import React, {useState} from 'react'
import Sidebar from './Sidebar';
import ProblemProvider from './ProblemContext';
import Link from 'next/link';




function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleIsOpen = () => {
    setIsOpen(prevState => !prevState);
  }

  return (
    <>
      {/* <div className="flex flex-row justify-between items-center px-5 py-8">
        <div className="flex flex-row gap-3">
          <button onClick={toggleIsOpen}>
            <Menu />
          </button>
          <h1>Learn Better</h1>
        </div>

        <div className="flex flex-row gap-7">
          <h1>Sign Up</h1>
          <h1>Login</h1>
        </div>
      </div> */}

    <nav className="mx-8 mb-8  p-4 border-gray-400 border-b-[1px] border-x-[1px] rounded-b-md">
            <div className="container mx-auto px-4 py-2">
                <div className="flex justify-between items-center">
                  <div className="flex flex-row gap-3">
                      <button onClick={toggleIsOpen}>
                        <Menu />
                      </button>
                      <Link href="/">
                        <h1>Learn Better</h1>

                      </Link>
                  </div>
                   
                    <div className="flex gap-7">
                        <a href="#" className=" text-black font-light pt-1  rounded-md ">Sign In</a>
                        <a href="#" className=" bg-purple-500  px-6 py-1 rounded-lg text-white font-normal">Sign Up</a>
                    </div>
                </div>
            </div>
        </nav>
      <ProblemProvider>
      <Sidebar isOpen={isOpen} close={toggleIsOpen} />
      </ProblemProvider>
    </>
  )
}

export default Navbar