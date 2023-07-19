import React from 'react';
import { styled } from 'styled-components';
import { Sick } from '../types/sickType';

type propsType = {
  cacheing: (data: Sick) => void;
  sick: Sick;
  focusIndex: boolean;
};

const SearchItem = ({ cacheing, sick, focusIndex }: propsType) => {
  return (
    <ItemContainer
      $focusIndex={focusIndex}
      onClick={() => {
        cacheing(sick);
      }}>
      {sick.sickNm}
    </ItemContainer>
  );
};

const ItemContainer = styled.div<{ $focusIndex: boolean }>`
  text-align: left;
  padding: 10px 0px;
  &:hover {
    background-color: #ddd;
  }
  background-color: ${props => (props.$focusIndex ? '#ddd' : '#fff')};
  cursor: pointer;
`;

export default SearchItem;
