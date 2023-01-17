import React from "react";
import { useNavigate } from "react-router-dom";
import { BiPowerOff } from "react-icons/bi";
import styled from "styled-components";

export function Logout() {
  const navigate = useNavigate();
  const handleClick = async () => {
    localStorage.clear();
    navigate("/login");
  };
  return (
    <Button>
      <BiPowerOff onClick={handleClick} />
    </Button>
  );
}

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-content: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #9a86f3;
  border: none;
  cursor: pointer;
  svg {
    color: #ebe7ff;
  }
`;
