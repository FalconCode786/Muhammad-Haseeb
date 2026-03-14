import React from 'react';

const statusStyles = {
  new: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
  'in-progress': 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  responded: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  closed: 'bg-slate-500/10 text-slate-400 border-slate-500/20'
};

const StatusBadge = ({ status }) => {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[status] || statusStyles.new}`}>
      {status.replace('-', ' ').toUpperCase()}
    </span>
  );
};

export default StatusBadge;
