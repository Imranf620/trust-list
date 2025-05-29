'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import Loader from './Loader';

export default function Navbar() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const user = useUser();
  const isAdmin = user?.isAdmin || false;
  const pathname = usePathname();

  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ text: '', href: '', order: 0 });

  useEffect(() => {
    fetchNavbar();
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  async function fetchNavbar() {
    setLoading(true);
    try {
      const res = await fetch('/api/navbar');
      const data = await res.json();
      setItems(data.items);
    } catch (err) {
      console.error('Failed to fetch navbar', err);
    } finally {
      setLoading(false);
    }
  }

  function openEdit(item) {
    setEditItem(item);
    setForm({
      text: item.text,
      href: item.href,
      order: item.order || 0,
    });
  }

  function closeEdit() {
    setEditItem(null);
  }

  async function handleUpdate(e) {
    e.preventDefault();
    const res = await fetch('/api/navbar', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _id: editItem._id, ...form }),
    });

    if (res.ok) {
      await fetchNavbar();
      closeEdit();
    } else {
      alert('Failed to update');
    }
  }

  function isExternalUrl(url) {
    return !url.startsWith('/');
  }

  function normalizeExternalUrl(url) {
    return /^https?:\/\//.test(url) ? url : `https://${url}`;
  }

  function handleClick(href) {
    const url = isExternalUrl(href) ? normalizeExternalUrl(href) : href;
    if (isExternalUrl(href)) {
      window.open(url, '_blank');
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const linkItems = items
    .filter(item => item.type === 'link')
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const buttonItems = items
    .filter(item => item.type === 'button')
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const renderNavItem = (item, isMobile = false) => (
    <div key={item._id} className="relative group">
      {isExternalUrl(item.href) ? (
        <div
          onClick={() => handleClick(item.href)}
          className={`custom-font font-bold text-blue-500 hover:text-blue-600 transition-colors duration-200 cursor-pointer ${
            isMobile ? 'block py-3 px-4 text-lg' : ''
          }`}
        >
          {item.text}
        </div>
      ) : (
        <>
          <Link
            href={item.href}
            className={`custom-font font-bold text-blue-500 hover:text-blue-600 transition-colors duration-200 ${
              isMobile ? 'block py-3 px-4 text-lg' : ''
            }`}
          >
            {item.text}
          </Link>
          {!isMobile && (
            <span className="text-gray-400 hidden sm:inline ml-4"> | </span>
          )}
        </>
      )}
      {isAdmin && pathname.startsWith('/admin') && (
        <button
          className={`text-xs text-gray-400 hover:text-purple-500 bg-white rounded-full w-5 h-5 flex items-center justify-center shadow-sm border ${
            isMobile ? 'absolute top-3 right-4' : 'absolute -top-2 -right-2'
          }`}
          onClick={() => openEdit(item)}
        >
          ✎
        </button>
      )}
    </div>
  );

  const renderButtonItem = (item, isMobile = false) => (
    <div key={item._id} className="relative group">
      {isExternalUrl(item.href) ? (
        <div
          onClick={() => handleClick(item.href)}
          className={`cursor-pointer inline-flex items-center justify-center gap-2 rounded-full font-medium text-sm transition-all duration-200 bg-blue-500 text-white hover:bg-blue-600 shadow-sm ${
            isMobile ? 'w-full py-3 px-4 text-base' : 'px-12 py-2'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          {item.text}
        </div>
      ) : (
        <Link
          href={item.href}
          className={`flex items-center justify-center gap-2 rounded-xl font-semibold text-white duration-300 bg-gradient-to-r from-blue-500 to-blue-700 ${
            isMobile ? 'w-full py-3 px-4 text-base' : 'px-4 py-2'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          {item.text}
        </Link>
      )}
      {isAdmin && pathname.startsWith('/admin') && (
        <button
          className={`text-xs text-gray-400 hover:text-blue-500 bg-white rounded-full w-5 h-5 flex items-center justify-center shadow-sm border ${
            isMobile ? 'absolute top-3 right-4' : 'absolute -top-2 -right-2'
          }`}
          onClick={() => openEdit(item)}
        >
          ✎
        </button>
      )}
    </div>
  );

  return (
    <>
      <nav className="bg-white border-b border-gray-200 relative z-40">
        {loading ? (
          <div className="flex justify-center items-center px-4 py-4">
            <Loader />
          </div>
        ) : (
          <>
            {/* Desktop Navigation */}
            <div className="hidden lg:flex justify-center gap-20 items-center px-8 py-4">
              {/* Left side - Navigation Links */}
              <div className="flex items-center gap-4">
                {linkItems.map(item => renderNavItem(item))}
              </div>

              {/* Right side - Action Buttons */}
              <div className="flex items-center gap-3">
                {buttonItems.map(item => renderButtonItem(item))}
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="lg:hidden">
              {/* Mobile Header */}
              <div className="flex justify-between items-center px-4 py-4">
                {/* Logo or Brand (if you have one) */}
                <div className="flex-1"></div>
                
                {/* Mobile Menu Button */}
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-md text-gray-600 hover:text-purple-500 hover:bg-gray-100 transition-colors duration-200"
                  aria-label="Toggle menu"
                >
                  <svg 
                    className="w-6 h-6" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    {isMobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>

              {/* Mobile Menu Dropdown */}
              <div 
                className={`absolute top-full w-[100vw] -left-40 right-0 bg-white border-b border-gray-200 shadow-lg transition-all duration-300 ease-in-out ${
                  isMobileMenuOpen 
                    ? 'opacity-100 visible translate-y-0' 
                    : 'opacity-0 invisible -translate-y-2'
                }`}
              >
                <div className="px-4 py-2  overflow-y-auto">
                  {/* Navigation Links */}
                  <div className="border-b border-gray-100 pb-4 mb-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 px-4">
                      Navigation
                    </h3>
                    {linkItems.map(item => renderNavItem(item, true))}
                  </div>

                  {/* Action Buttons */}
                  {buttonItems.length > 0 && (
                    <div className="pb-4">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 px-4">
                        Actions
                      </h3>
                      <div className="space-y-2 px-4">
                        {buttonItems.map(item => renderButtonItem(item, true))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tablet Navigation (md to lg) */}
            <div className="hidden md:flex lg:hidden justify-between items-center px-6 py-4">
              {/* Left side - Navigation Links (scrollable on tablet) */}
              <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide flex-1 mr-4">
                {linkItems.map(item => (
                  <div key={item._id} className="relative group flex-shrink-0">
                    {isExternalUrl(item.href) ? (
                      <div
                        onClick={() => handleClick(item.href)}
                        className="custom-font font-bold text-blue-500 hover:text-blue-600 transition-colors duration-200 cursor-pointer whitespace-nowrap"
                      >
                        {item.text}
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className="custom-font font-bold text-blue-500 hover:text-blue-600 transition-colors duration-200 whitespace-nowrap"
                      >
                        {item.text}
                      </Link>
                    )}
                    {isAdmin && pathname.startsWith('/admin') && (
                      <button
                        className="absolute -top-2 -right-2 text-xs text-gray-400 hover:text-blue-500 bg-white rounded-full w-5 h-5 flex items-center justify-center shadow-sm border"
                        onClick={() => openEdit(item)}
                      >
                        ✎
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Right side - Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {buttonItems.map(item => (
                  <div key={item._id} className="relative group">
                    {isExternalUrl(item.href) ? (
                      <div
                        onClick={() => handleClick(item.href)}
                        className="cursor-pointer inline-flex items-center gap-2 px-8 py-2 rounded-full font-medium text-sm transition-all duration-200 bg-blue-500 text-white hover:bg-blue-600 shadow-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        {item.text}
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl font-semibold text-white duration-300 bg-gradient-to-r from-blue-500 to-blue-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        {item.text}
                      </Link>
                    )}
                    {isAdmin && pathname.startsWith('/admin') && (
                      <button
                        className="absolute -top-2 -right-2 text-xs text-gray-400 hover:text-blue-500 bg-white rounded-full w-5 h-5 flex items-center justify-center shadow-sm border"
                        onClick={() => openEdit(item)}
                      >
                        ✎
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

    
      </nav>

      {/* Modal */}
      {editItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 md:p-8 rounded-2xl w-full max-w-md mx-4 shadow-2xl max-h-96 overflow-y-auto">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">Edit Navbar Item</h2>
            <form onSubmit={handleUpdate} className="flex flex-col gap-4 md:gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title / Text:</label>
                <input
                  type="text"
                  value={form.text}
                  onChange={e => setForm({ ...form, text: e.target.value })}
                  className="border border-gray-300 rounded-lg px-3 md:px-4 py-2 md:py-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm md:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Link (href):</label>
                <input
                  type="text"
                  value={form.href}
                  onChange={e => setForm({ ...form, href: e.target.value })}
                  className="border border-gray-300 rounded-lg px-3 md:px-4 py-2 md:py-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm md:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order:</label>
                <input
                  type="number"
                  value={form.order}
                  onChange={e => setForm({ ...form, order: Number(e.target.value) })}
                  className="border border-gray-300 rounded-lg px-3 md:px-4 py-2 md:py-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm md:text-base"
                  required
                  min={0}
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4 md:mt-6">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="px-4 md:px-6 py-2 md:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium text-sm md:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 md:px-6 py-2 md:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium text-sm md:text-base"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}