"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface LogoProps {
  variant?: 'horizontal' | 'vertical' | 'icon';
  color?: 'color' | 'white' | 'black';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  href?: string;
  className?: string;
  animated?: boolean;
}

const sizeClasses = {
  horizontal: {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10',
    xl: 'h-12',
  },
  vertical: {
    sm: 'h-16',
    md: 'h-20',
    lg: 'h-24',
    xl: 'h-32',
  },
  icon: {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  },
};

export default function Logo({
  variant = 'horizontal',
  color = 'color',
  size = 'md',
  href = '/dashboard',
  className = '',
  animated = false,
}: LogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = mounted && resolvedTheme === 'light';
  const logoSrc = variant === 'icon' ? '/brand/brand-mark.svg' : '/brand/Logo.png';
  const sizeClass = sizeClasses[variant][size];

  // Invert the white text to black and hue-rotate the inverted yellow back to yellow
  const filterClass = (isLight && variant !== 'icon')
    ? 'invert hue-rotate-180 brightness-110 saturate-[1.2]' 
    : '';

  const logoElement = (
    <div className={`${sizeClass} ${animated ? 'logo-animated' : ''} ${className} flex items-center justify-center`}>
      <Image
        src={logoSrc}
        alt="AnserTech Logo"
        width={variant === 'icon' ? 40 : 320}
        height={variant === 'icon' ? 40 : 92}
        style={{ height: '100%', width: 'auto' }}
        className={`object-contain transition-all duration-300 ${filterClass}`}
        priority
      />
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {logoElement}
      </Link>
    );
  }

  return logoElement;
}

export function LogoIcon({
  size = 'md',
  className = '',
  animated = false
}: Omit<LogoProps, 'variant' | 'href'>) {
  return <Logo variant="icon" size={size} className={className} animated={animated} href="" />;
}

export function LogoVertical({
  size = 'md',
  color = 'color',
  className = ''
}: Omit<LogoProps, 'variant' | 'href'>) {
  return <Logo variant="vertical" size={size} color={color} className={className} href="" />;
}
