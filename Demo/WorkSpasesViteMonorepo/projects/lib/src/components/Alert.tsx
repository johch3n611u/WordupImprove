import React from 'react';
import styled from 'styled-components';

const StyledAlert = styled.div`
  border: none;
  border-radius: 0.5rem;
  background-color: #186faf;
  color: hsl(0deg, 0%, 98%);
  padding: 0.75rem;
  cursor: pointer;
  &:hover {
    background-color: red;
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #62b0e8;
    background-color: red;
  }
`;

interface AlertProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const Alert: React.FC<AlertProps> = ({ children, onClick }) => {
  const handleClick = () => {
    alert('You clicked the button!');
    onClick && onClick();
  };

  return <StyledAlert onClick={handleClick}>{children}</StyledAlert>;
};

export default Alert;