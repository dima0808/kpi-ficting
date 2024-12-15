import React from 'react';
import Sidebar from '../components/Sidebar';
import TestsTable from '../components/TestsTable';
import CollectionsTable from '../components/CollectionsTable';
import { useLocation } from 'react-router-dom';

function Home() {
  const location = useLocation();

  return (
    <div className="container">
      <Sidebar />
      {location.pathname === '/tests' && <TestsTable />}
      {location.pathname === '/collections' && <CollectionsTable />}
    </div>
  );
}

export default Home;