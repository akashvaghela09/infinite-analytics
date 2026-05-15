import React from 'react';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 h-(--header-height) bg-(--bg-secondary)/80 backdrop-blur-xl border-b border-(--border-subtle) z-30">
      <div className="h-full flex items-center px-6 ml-0 md:ml-(--sidebar-width)">
      </div>
    </header>
  );
};

export default Header;
