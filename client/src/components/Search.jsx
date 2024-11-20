import React from 'react'
import { FaSearch } from "react-icons/fa";



const Search = () => {
    return (
        <div className='w-full min-w-[320px] md:min-w-[420px] h-10 rounded-lg border border-neutral-300 overflow-hidden flex items-center text-neutral-500'>
            <button className='flex justify-center items-center h-full p-3'>
                <FaSearch size={20} className='' />
            </button>

            <div>
                Search "milk"
            </div>
        </div>
    )
}

export default Search