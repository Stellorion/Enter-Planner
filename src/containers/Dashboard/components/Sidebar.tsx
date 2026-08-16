'use client';

import Link from 'next/link';
import { Dialog } from '@headlessui/react';
import {
  FaUser,
  FaRegQuestionCircle,
  FaLink,
  FaThLarge,
  FaBars,
  FaTimes,
} from 'react-icons/fa';
import { useMediaQuery } from 'react-responsive';
import { useState } from 'react';
import ModalContainer from '@/src/components/ui/modal/ModalContainer';

export default function Sidebar() {
  const isLargeScreen = useMediaQuery({ minWidth: 1024 });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showConnectionsModal, setShowConnectionsModal] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const isSidebarExpanded = isLargeScreen || sidebarOpen;

  return (
    <>
      <aside
        className={`flex flex-col space-y-2 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 transition-all duration-300
          ${isSidebarExpanded ? 'w-48' : 'w-16'}
          lg:w-64
        `}
      >
        {!isLargeScreen && (
          <button
            className="p-2 transition-all text-gray-900 dark:text-gray-100 hover:text-black dark:hover:text-white"
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
          >
            {sidebarOpen ? <FaTimes className="h-5 w-5" /> : <FaBars className="h-5 w-5" />}
          </button>
        )}

        <nav className="space-y-2">
          <SidebarItem
            href="/dashboard"
            label="Dashboard"
            icon={<FaThLarge className="h-5 w-5" />}
            isOpen={isSidebarExpanded}
          />
          <SidebarItem
            href="/dashboard/profile"
            label="Profile"
            icon={<FaUser className="h-5 w-5" />}
            isOpen={isSidebarExpanded}
          />
          <SidebarItem
            label="Connections"
            icon={<FaLink className="h-5 w-5" />}
            isOpen={isSidebarExpanded}
            onClick={() => setShowConnectionsModal(true)}
          />
          <SidebarItem
            href="https://gethelpisrael.com/psychiatric-facilities/"
            label="Help"
            icon={<FaRegQuestionCircle className="h-5 w-5" />}
            isOpen={isSidebarExpanded}
          />
        </nav>
      </aside>

      <ModalContainer show={showConnectionsModal} onClose={setShowConnectionsModal}>
        <Dialog.Panel className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl dark:bg-gray-900">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300">
              <FaLink className="h-5 w-5" />
            </div>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Connections disabled
            </h3>

            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              This feature is disabled for now.
            </p>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setShowConnectionsModal(false)}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              Close
            </button>
          </div>
        </Dialog.Panel>
      </ModalContainer>
    </>
  );
}

function SidebarItem({
  href,
  label,
  icon,
  isOpen,
  onClick,
}: {
  href?: string;
  label: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onClick?: () => void;
}) {
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center gap-3 rounded-lg p-2 text-left text-sm text-gray-900 transition hover:bg-gray-200 dark:text-gray-100 dark:hover:bg-gray-800"
      >
        <span className="text-lg">{icon}</span>
        <span className={`transition-all duration-300 ${!isOpen ? 'hidden' : 'block'}`}>
          {label}
        </span>
      </button>
    );
  }

  return (
    <Link
      href={href ?? '#'}
      className="flex items-center gap-3 rounded-lg p-2 text-sm transition hover:bg-gray-200 dark:hover:bg-gray-800"
    >
      <span className="text-lg">{icon}</span>
      <span className={`transition-all duration-300 ${!isOpen ? 'hidden' : 'block'}`}>
        {label}
      </span>
    </Link>
  );
}