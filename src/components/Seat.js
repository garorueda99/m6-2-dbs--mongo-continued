import React, { useRef } from 'react';
import styled from 'styled-components';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import VisuallyHidden from '@reach/visually-hidden';
import seatImageSrc from '../assets/seat-available.svg';
import { getRowName, getSeatNum, encodeSeatId } from '../helpers';

import UnstyledButton from './UnstyledButton';
import { BookingContext } from './BookingContext';

const Seat = ({ rowIndex, seatIndex, width, height, price, status }) => {
  const {
    actions: { beginBookingProcess },
  } = React.useContext(BookingContext);

  const rowName = getRowName(rowIndex);
  const seatNum = getSeatNum(seatIndex);

  const seatId = encodeSeatId(rowIndex, seatIndex);
  const buttonRef = useRef(null);
  return (
    <TippyF delay={100} content={`Row ${rowName}, Seat ${seatNum} – $${price}`}>
      <Wrapper
        ref={buttonRef}
        disabled={status === 'unavailable'}
        onClick={(e) => {
          e.preventDefault();
          beginBookingProcess({ seatId, price });
          console.log(e.target);
          buttonRef.current.blur();
        }}
      >
        <VisuallyHidden>
          Seat number {seatNum} in Row {rowName}
        </VisuallyHidden>
        <img src={seatImageSrc} alt="" style={{ width, height }} />
      </Wrapper>
    </TippyF>
  );
};

const Wrapper = styled(UnstyledButton)`
  position: relative;

  &:disabled img {
    filter: grayscale(100%);
  }
`;

const TippyF = styled(Tippy)`
  background-color: gray;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  &:after {
    content: '';
    position: absolute;
    top: 98%;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: 0;
    height: 0;
    border-top: solid 15px gray;
    border-left: solid 15px transparent;
    border-right: solid 15px transparent;
  }
`;
export default Seat;
