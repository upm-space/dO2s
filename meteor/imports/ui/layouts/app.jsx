import React from 'react';
import Navigation from '../components/navigation';

const App = ( {children} ) => (
    <div className="App">
        <Navigation />
        {children}
    </div>
);

export default App;
