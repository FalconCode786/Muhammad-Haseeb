import React from 'react';

const statusStyles = {
  new: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'in-progress': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  responded: 'bg-green-500/10 text-green-400 border-green-500/20',
  closed: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
};

const StatusBadge = ({ status }) => {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[status] || statusStyles.new}`}>
      {status.replace('-', ' ').toUpperCase()}
    </span>
  );
};

export default StatusBadge;