import React from 'react';
import { Mail, Phone, ExternalLink, MoreHorizontal } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { format } from 'date-fns';

const ContactTable = ({ contacts, onView, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-800">
            <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Name</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Contact</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Project</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Status</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Date</th>
            <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr
              key={contact._id}
              className="border-b border-slate-800 hover:bg-slate-900 transition-colors group"
            >
              <td className="py-3 px-4">
                <div>
                  <p className="text-white font-medium">{contact.fullName}</p>
                  <p className="text-sm text-slate-500">{contact.email || 'No email'}</p>
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{contact.contactNumber}</span>
                </div>
              </td>
              <td className="py-3 px-4">
                <div>
                  <p className="text-white text-sm">{contact.projectType || '-'}</p>
                  {contact.projectName && (
                    <p className="text-xs text-slate-500 truncate max-w-37.5">
                      {contact.projectName}
                    </p>
                  )}
                </div>
              </td>
              <td className="py-3 px-4">
                <StatusBadge status={contact.status} />
              </td>
              <td className="py-3 px-4">
                <span className="text-sm text-slate-400">
                  {format(new Date(contact.createdAt), 'MMM d, yyyy')}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onView(contact)}
                    className="p-2 rounded-lg bg-slate-900/60 text-slate-300 hover:bg-slate-900 hover:text-white transition-all"
                    title="View Details"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(contact)}
                    className="p-2 rounded-lg bg-slate-900/60 text-slate-300 hover:bg-sky-500/10 hover:text-sky-300 transition-all"
                    title="Edit Status"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(contact)}
                    className="p-2 rounded-lg bg-slate-900/60 text-slate-300 hover:bg-red-600/20 hover:text-red-400 transition-all"
                    title="Delete"
                  >
                    <span className="sr-only">Delete</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContactTable;
