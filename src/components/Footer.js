import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-app-primary-700 text-white mt-auto">
      <div className="container mx-auto py-6 px-4 max-w-7xl">
        <div className="flex justify-between items-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} Business Tracker. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="text-sm hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm hover:text-gray-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
