import React from 'react';
import styled from 'styled-components';
import { Sick } from '../types/sickType';

type propsType = {
  sick: Sick;
};
const RecentSearchItem = ({ sick }: propsType) => {
  return <ItemContainer>{sick.sickNm}</ItemContainer>;
};

const ItemContainer = styled.div`
  text-align: left;
  padding: 10px 0px;
  &:hover {
    background-color: #ddd;
  }
  cursor: pointer;
`;

export default RecentSearchItem;
