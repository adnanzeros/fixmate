
import {
  AirVent,
  Laptop,
  Refrigerator,
  Smartphone,
  Tv,
  WashingMachine,
  Zap,
} from 'lucide-react';

export const CATEGORIES = [
  { name: 'Smartphone', icon: Smartphone, blurb: 'Screens, batteries, ports' },
  { name: 'Laptop & PC', icon: Laptop, blurb: 'Servicing, upgrades, data' },
  { name: 'AC', icon: AirVent, blurb: 'Gas refill, cleaning, repair' },
  {
    name: 'Refrigerator',
    icon: Refrigerator,
    blurb: 'Cooling and compressor faults',
  },
  { name: 'TV', icon: Tv, blurb: 'Panel, board and sound issues' },
  {
    name: 'Washing Machine',
    icon: WashingMachine,
    blurb: 'Drum, motor and drain fixes',
  },
  { name: 'Electrical', icon: Zap, blurb: 'Wiring, switches, fittings' },
];

export const SERVICE_MODES = ['Home Visit', 'Shop Drop-off'];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

export const ROLE_DASHBOARD = {
  customer: '/dashboard/customer',
  technician: '/dashboard/technician',
  admin: '/dashboard/admin',
};

export const ROLE_LABEL = {
  customer: 'Customer',
  technician: 'Technician',
  admin: 'Admin',
};
