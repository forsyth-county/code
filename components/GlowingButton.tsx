import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface GlowingButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: LucideIcon;
  variant?: 'cyan' | 'purple' | 'pink' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const GlowingButton: React.FC<GlowingButtonProps> = ({
  children,
  onClick,
  icon: Icon,
  variant = 'gradient',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantClasses = {
    cyan: 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:shadow-neon-cyan',
    purple: 'bg-gradient-to-r from-purple-500 to-purple-600 hover:shadow-neon-purple',
    pink: 'bg-gradient-to-r from-pink-500 to-pink-600 hover:shadow-neon-pink',
    gradient: 'bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:shadow-neon-purple',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded-full font-bold
        transition-all duration-300
        flex items-center gap-2 justify-center
        border border-white/20
        ${className}
      `}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </motion.button>
  );
};

export default GlowingButton;
