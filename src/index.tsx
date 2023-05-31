import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from 'App';

import 'antd/dist/reset.css';
import './styles/main.less';

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
