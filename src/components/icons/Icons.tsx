export const CubeIcon = ({fill}: {fill: string}) => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2 3 7v10l9 5 9-5V7l-9-5z" stroke={fill} strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M3 7l9 5 9-5M12 12v10" stroke={fill} strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);

export const BatteryIcon = ({fill}: {fill: string}) => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="7" width="16" height="11" rx="2" stroke={fill} strokeWidth="1.8" />
    <rect x="20" y="10.5" width="2" height="4" rx="0.5" fill={fill} />
    <path d="M8 12h2l1.5-3L13 15l1.5-3H16" stroke={fill} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ShieldIcon = ({fill}: {fill: string}) => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3 4 6v6c0 4.8 3.4 8.5 8 9.9 4.6-1.4 8-5.1 8-9.9V6l-8-3z" stroke={fill} strokeWidth="1.7" strokeLinejoin="round" />
    <path d="m9 12 2 2 4-4.5" stroke={fill} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const BoltIcon = ({fill}: {fill: string}) => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" fill={fill} />
  </svg>
);

export const ChipIcon = ({fill}: {fill: string}) => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="7" y="7" width="10" height="10" rx="1.5" stroke={fill} strokeWidth="1.8" />
    <circle cx="12" cy="12" r="2" stroke={fill} strokeWidth="1.6" />
    <path d="M9 3v3M12 3v3M15 3v3M9 18v3M12 18v3M15 18v3M3 9h3M3 12h3M3 15h3M18 9h3M18 12h3M18 15h3" stroke={fill} strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const GaugeIcon = ({fill}: {fill: string}) => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 15a8 8 0 1 1 16 0" stroke={fill} strokeWidth="1.7" strokeLinecap="round" />
    <path d="M12 15 16 9" stroke={fill} strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="12" cy="15" r="1.4" fill={fill} />
  </svg>
);

export const HatchIcon = ({fill}: {fill: string}) => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="10" width="16" height="10" rx="2" stroke={fill} strokeWidth="1.7" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke={fill} strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

export const WrenchIcon = ({fill}: {fill: string}) => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M14.7 6.3a4 4 0 0 0-5.4 4.9L3 17.5 5.5 20l6.3-6.3a4 4 0 0 0 4.9-5.4l-2.6 2.6-2-2 2.6-2.6z"
      stroke={fill}
      strokeWidth="1.6"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </svg>
);

export const LockIcon = ({fill}: {fill: string}) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="11" width="14" height="9" rx="2" stroke={fill} strokeWidth="1.8" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke={fill} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const PlatesIcon = ({fill}: {fill: string}) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="3" width="14" height="9" rx="1.6" stroke={fill} strokeWidth="1.8" />
    <rect x="2" y="12" width="14" height="9" rx="1.6" fill="#EFF2F4" stroke={fill} strokeWidth="1.8" />
  </svg>
);