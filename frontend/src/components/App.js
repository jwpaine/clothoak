import React from 'react';
import { Link } from 'react-router-dom'
import Header from './Header'
import styled from 'styled-components';

	const Wrapper = styled.section`

		/* background: #1DA1F2; */
		height: 100vh;
		
	`;

export default ({ children }) => {
	return (
		<Wrapper>
			<Header />
			{ children }
		</Wrapper>
	);
}