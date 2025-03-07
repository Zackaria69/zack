import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import Logo from "../assets/images/logo.png";
import { useState } from "react";

const NavbarContainer = styled.nav`
  padding: 1rem;
`;

const ContainerFluid = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 15px;
  margin: 0 auto;
  background-color: rgba(255, 255, 255, 0.03);
  border-radius: 0.5rem;
  padding: 0.2rem 0.5rem;
`;

const NavBrand = styled(Link)`
  display: flex;
  align-items: center;
`;

const LogoImage = styled.img`
  height: 55px;
`;

const NavToggler = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  padding: 1rem;
  display: none;

  @media (max-width: 768px) {
    display: block;
    position: relative;
    z-index: 11;
  }
`;

const NavTogglerIcon = styled.span`
  display: block;
  width: 24px;
  height: 2px;
  background-color: white;
  position: relative;
  transition: 0.3s;

  &::before,
  &::after {
    content: "";
    position: absolute;
    width: 24px;
    height: 2px;
    background-color: white;
    transition: 0.3s;
  }

  &::before {
    top: -6px;
  }

  &::after {
    top: 6px;
  }
`;


const NavLink = styled(Link)`
  color: #e0e0e0;
  text-decoration: none;
  letter-spacing: 0.6px;
  transition: color 0.3s;

  &:hover {
    color: #ff058b;
  }

  &.active {
    text-decoration: underline;
    text-underline-offset: 2px;
    text-decoration-color: #ff058b;
  }
`;

const NavCollapse = styled.div<{ isOpen: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    width: 100%;
    position: absolute;
    top: 60px;
    left: 0;
    background-color: trasnparent;
    padding: 1rem;
    border-radius: 0.5rem;
    transition: all 0.3s ease-in-out;
    display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
    z-index: 10;
  }
`;

const NavList = styled.section`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  justify-content: center;
  flex-grow: 1;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    padding: 1rem 0;
  }
`;

const Actions = styled.section`
  display: flex;
  flex-direction: row;
  list-style: none;
  gap: 0.5rem;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
`;

const SignOutButton = styled.button`
  background: #ea1ebd;
  color: white;
  padding: 0.3rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background:rgb(209, 28, 170);
  }
`;

const LoginButton = styled(Link)`
  border: 1px solid #ea1ebd;
  color: white;
  padding: 0.3rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  transition: background 0.3s;

  &:hover {
    background:rgb(209, 28, 170);
  }
`;

const RegisterButton = styled(Link)`
  background: #ea1ebd;
  color: white;
  padding: 0.3rem 1rem;
  border: none;
  border-radius: 4px;
  text-decoration: none;
  transition: background 0.3s;

  &:hover {
    background:rgb(209, 28, 170);
  }
`;

const DownloadButton = styled.section`
  background: #ea1ebd;
  box-shadow: 1px 1px 10px 2px #ea1ebd; 
  color: white;
  padding: 0.3rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    background:rgb(209, 28, 170);
  }
`;


const Navbar = () => {
  const path = useLocation();

  const downloadLink = "https://mediafire.com/";
  const token = localStorage.getItem("token") ? localStorage.getItem("token") : null;
  const admin = localStorage.getItem("admin") === "true";
  let username = token ? localStorage.getItem("username") : null;

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("admin");
    window.location.reload()
  };

  return (
    <NavbarContainer>
      <ContainerFluid>
        <NavBrand to="/">
          <LogoImage src={Logo} alt="Picto logo" />
        </NavBrand>
        <NavToggler type="button" aria-label="Toggle navigation" onClick={() => setIsOpen(!isOpen)}>
          <NavTogglerIcon />
        </NavToggler>
        {/* @ts-ignore */}
        <NavCollapse isOpen={isOpen}>
          <NavList>
            <NavLink to="/" className={cn(path.pathname === "/" && "active")} onClick={() => setIsOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/animation" className={cn(path.pathname === "/animation" && "active")} onClick={() => setIsOpen(false)}>
              Effects
            </NavLink>
            {/* {token && (
              <NavLink to="/profile" className={cn(path.pathname === "/profile" && "active")} onClick={() => setIsOpen(false)}>
                Profile
              </NavLink>
            )} */}
            {token && (
              <NavLink to="/list" className={cn(path.pathname === "/list" && "active")} onClick={() => setIsOpen(false)}>
                My Gallery
              </NavLink>
            )}
            {admin && (
              <NavLink to="/admin" className={cn(path.pathname === "/admin" && "active")} onClick={() => setIsOpen(false)}>
                Admin
              </NavLink>
            )}
          </NavList>
          <Actions>
            {/* @ts-ignore */}
            <DownloadButton href={downloadLink} target="_blank" rel="noreferrer">
              Download
            </DownloadButton>
            {token ? (
              <SignOutButton onClick={logOut}>Sign out from {username}</SignOutButton>
            ) : (
              <>
                <LoginButton to="/login" onClick={() => setIsOpen(false)}>Login</LoginButton>
                <RegisterButton to="/signup" onClick={() => setIsOpen(false)}>Register</RegisterButton>
              </>
            )}
          </Actions>
        </NavCollapse>
      </ContainerFluid>
    </NavbarContainer>
  );
};

export default Navbar;
