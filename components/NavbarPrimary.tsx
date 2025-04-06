import React from 'react'
import Link from 'next/link'

const NavbarPrimary = () => {
  return (
    <nav className="flex justify-between items-center bg-white shadow-md p-4 px-[3rem]">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-400" style={{ backgroundSize: '200% 100%', backgroundPosition: '70% 0' }}> Proficia</h1>
        <ul className="flex space-x-4">
            <li>
                <Link href="/login" className='text-xl'>Login</Link>
            </li>
            <li>
                <Link href="/register" className='text-xl'>Register</Link>
            </li>
        </ul>
    </nav>
  )
}

export default NavbarPrimary