import React from 'react';
import logo from '../assets/image/logo.png';
import Search from './Search';

const Header = () => {
    return (
        <header className='h-20 shadow-md sticky top-0'>
            <div className='container mx-auto flex items-center h-full px-4 justify-between'>
                {/* Logo */}
                <div className="h-full flex items-center">
                    <img
                        src={logo}
                        alt="logo"
                        className="block md:hidden w-16 h-auto" // Smaller logo for mobile
                    />
                    <img
                        src={logo}
                        alt="logo"
                        className="hidden md:block w-24 h-auto" // Larger logo for desktop
                    />
                </div>
                {/* search */}
                <div>
                    <Search />
                </div>
                {/* login nd cart */}
                <div>Login and cart</div>
            </div>
        </header>
    )
}

export default Header;