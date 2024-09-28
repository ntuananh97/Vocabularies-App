'use client';
import clsx from 'clsx';
import Link from 'next/link';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

 const NavLink: React.FC<NavLinkProps> = ({ href, children, className }) => {
  return <Link href={href} className={clsx('next-link text-sm text-indigo-400 hover:text-blue-700 hover:underline', {
    [className as string] : !!className,
  })}>{children}</Link>;
}

export default NavLink
