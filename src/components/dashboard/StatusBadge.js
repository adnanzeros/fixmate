

const LABEL = {
  requested: 'Requested',
  accepted: 'Accepted',
  'in-progress': 'In Progress',
  completed: 'Completed',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
  pending: 'Pending',
  approved: 'Approved',
  paid: 'Paid',
  unpaid: 'Unpaid',
};

export function StatusBadge({ status }) {
  return <span className={`sb sb-${status}`}>{LABEL[status] ?? status}</span>;
}

export function PaymentBadge({ status }) {
  return <StatusBadge status={status === 'paid' ? 'paid' : 'unpaid'} />;
}
