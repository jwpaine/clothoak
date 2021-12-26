import React from 'react';
import { Link } from 'react-router-dom'
import Header from './Header'
import styled from 'styled-components';

import Theme from "../theme/Main"


export default ({ children }) => {
	return (
		<Theme>
			<Header />  
			{ children }
		</Theme>
	);
}