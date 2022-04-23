import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import { NavLink, useHistory } from 'react-router-dom';
import { RiMenuFill, RiCloseLine } from 'react-icons/ri';
import './navbar.css';
import logo from '../../assets/LOGO.svg'

function Navbar({ showOptions, showOptionsFunc }) {
  const [toggleMenu, setToggleMenu] = useState(false);
  const history = useHistory();

  function checkPath(source) {
    if (source === "home") {
      // showOptionsFunc(true)
    }
    else {
      // showOptionsFunc(true)
    }
  }

  useEffect(() => {
    if (window.location.pathname === "/") {
      // showOptionsFunc(true)
    }
  },
    []
  )

  function homePage() {
    let path = '/'
    history.push(path);
    showOptionsFunc(true)
  }

  function Menu() {
    return (
      <>
{/* 
        {showOptions ? <p><a href="#header">Home</a></p> : <p><NavLink exact to="/" onClick={() => checkPath("home")}>Home</NavLink></p>}
        {
          showOptions ?
            <>
              <p><a href="#minting-now">Minting Now</a></p>
              <p><a href="#upcoming">Upcoming</a></p>
              <p><a href="#past-mints">Past Mints</a></p>
              <p><a href="#about-us">Apply</a></p>
            </>
            :
            ""
        }
         */}

        <p><NavLink exact to="/" onClick={() => checkPath("home")}>Home</NavLink></p>
        <>
              <p><a href="#gray-nft">Gray NFT</a></p>
              <p><a href="#labs-nft">Labs NFT</a></p>
              <p><a href="#apply">Apply</a></p>
            </>
      </>
    )
  }

  return (
    <div className="very-near__navbar">
      <div className="very-near__navbar-links">
        <div className="very-near__navbar-links_logo">
          {/* <img src={logo} onClick={() => homePage()} /> */}
        </div>
        <div className="very-near__navbar-links_container">
          <Menu />
        </div>
      </div>
      <div className="very-near__navbar-menu">
        {toggleMenu
          ? <RiCloseLine color="#fff" size={27} onClick={() => setToggleMenu(false)} />
          : <RiMenuFill color="#fff" size={27} onClick={() => setToggleMenu(true)} />
        }
        {toggleMenu && (
          <div className="very-near__navbar-menu_container scale-up-center">
            <div className="very-near__navbar-menu_container-links">
              <Menu />
            </div>
          </div>
        )
        }
      </div>
    </div>
  )
}

export default Navbar