import * as Icons from 'lucide-react';

export default function getIcon(iconName) {
  return Icons[iconName] || Icons[iconName.replace(/(\w)(\w*)/g, (g0,g1,g2) => g1.toUpperCase() + g2.toLowerCase())] || Icons.Smile;
};