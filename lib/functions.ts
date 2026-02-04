import crypto from 'crypto';

export const generatePaymentCode = (length = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const bytes = crypto.randomBytes(length);

  return Array.from(bytes, (b) => chars[b % chars.length]).join('');
};
