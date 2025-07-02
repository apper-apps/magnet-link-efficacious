import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useState } from 'react';
import Sidebar from '@/components/organisms/Sidebar';
import Header from '@/components/organisms/Header';
import Dashboard from '@/components/pages/Dashboard';
import Links from '@/components/pages/Links';
import Forms from '@/components/pages/Forms';
import FormBuilderPage from '@/components/pages/FormBuilder';
import Leads from '@/components/pages/Leads';
import Analytics from '@/components/pages/Analytics';
import Integrations from '@/components/pages/Integrations';
import Team from '@/components/pages/Team';
import Settings from '@/components/pages/Settings';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

return (
    <Router>
      <div className="flex h-screen bg-gradient-to-br from-neutral-50 via-neutral-50/80 to-neutral-100/60 dark:from-neutral-950 dark:via-neutral-900/90 dark:to-neutral-900/60">
        <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuToggle={toggleSidebar} />
          
          <main className="flex-1 overflow-y-auto">
            <div className="p-6 lg:p-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/links" element={<Links />} />
                <Route path="/forms" element={<Forms />} />
                <Route path="/forms/builder" element={<FormBuilderPage />} />
                <Route path="/forms/builder/:id" element={<FormBuilderPage />} />
                <Route path="/leads" element={<Leads />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/integrations" element={<Integrations />} />
                <Route path="/team" element={<Team />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </div>
          </main>
        </div>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  );
}

export default App;