import React from 'react';
import { render } from 'react-dom';
import Popup from './Popup';
import 'assets/styles/tailwind.css';

render(<Popup />, window.document.querySelector('#app-container'));
