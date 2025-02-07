import { Link, useLocation, Outlet } from 'react-router-dom'; // Add Outlet import

function AdminLayout() {
  const location = useLocation();

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/destinations', label: 'Destinations' },
    { path: '/admin/properties', label: 'Properties' },
    { path: '/admin/users', label: 'Users' }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold text-blue-600">NepalStays Admin</span>
              </Link>
            </div>
            <div className="flex items-center">
              {/* Add admin profile/logout button here */}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow h-[calc(100vh-4rem)] fixed">
          <nav className="mt-5 px-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center px-4 py-2 text-sm font-medium rounded-md my-1 ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8">
          <Outlet /> {/* Replace {children} with <Outlet /> */}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;