import { render } from 'react-dom';
import Overlay from './overlay';
import React from 'react';

let overlayContainer = document.createElement('div');
document.body.appendChild(overlayContainer);
render(<Overlay></Overlay>, overlayContainer);
