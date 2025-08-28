// hooks/use-phone-number.ts
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

interface UsePhoneNumberReturn {
  phone: string;
  formattedPhone: string;
  error: string;
  isValid: boolean;
  isComplete: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handlePaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  clear: () => void;
  setPhone: (value: string) => void;
}

export function usePhoneNumber(initialValue: string = ''): UsePhoneNumberReturn {
  const [phone, setPhone] = useState(initialValue);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null!);

  // Valid Iranian mobile prefixes
  const validPrefixes = [
    '912', '913', '914', '915', '916', '917', '918', '919', // MCI
    '930', '933', '935', '936', '937', '938', '939', // Irancell
    '901', '902', '903', '904', '905', '941', // Rightel
    '920', '921', '922', '923', // RighTel
    '931', '932', '934' // Taliya
  ];

  // Normalize phone number to standard format (09xxxxxxxxx)
  const normalizePhoneNumber = useCallback((value: string): string => {
    // Remove all non-digit characters except + (for international format)
    const cleaned = value.replace(/[^\d+]/g, '');

    // Handle different formats - ORDER MATTERS!
    if (cleaned.startsWith('00989')) {
      // 00989xxxxxxxxx → 09xxxxxxxxx (FIRST check this before +989)
      return '0' + cleaned.slice(4);
    } else if (cleaned.startsWith('+989')) {
      // +989xxxxxxxxx → 09xxxxxxxxx
      return '0' + cleaned.slice(3);
    } else if (cleaned.startsWith('989')) {
      // 989xxxxxxxxx → 09xxxxxxxxx
      return '0' + cleaned.slice(2);
    } else if (cleaned.startsWith('0098') && cleaned.length > 4) {
      // 0098xxxxxxxxxx → 0xxxxxxxxxx (for other 0098 formats)
      return '0' + cleaned.slice(4);
    } else if (cleaned.startsWith('+98') && cleaned.length > 3) {
      // +98xxxxxxxxxx → 0xxxxxxxxxx
      return '0' + cleaned.slice(3);
    } else if (cleaned.startsWith('98') && cleaned.length > 2) {
      // 98xxxxxxxxxx → 0xxxxxxxxxx
      return '0' + cleaned.slice(2);
    } else if (cleaned.startsWith('9') && cleaned.length === 9) {
      // 9xxxxxxxx → 09xxxxxxxx
      return '0' + cleaned;
    }

    return cleaned;
  }, []);

  // Get formatted phone number for display
  const formattedPhone = useCallback((): string => {
    if (!phone) return '';

    // Keep original format during typing
    if (phone.startsWith('+') || phone.startsWith('00')) {
      return phone;
    }

    return phone;
  }, [phone]);

  // Validate phone number
  const validatePhoneNumber = useCallback((value: string): string => {
    // Allow empty input during typing
    if (value === '') {
      return '';
    }

    // Check if it's an international format that we can handle
    if (value.startsWith('+')) {
      if (!value.startsWith('+98') && value !== '+') {
        return 'فقط شماره موبایل ایران (+98) پشتیبانی میشود';
      }

      if (value.startsWith('+98') && value.length > 3) {
        const rest = value.slice(3);
        if (!/^\d*$/.test(rest)) {
          return 'فقط اعداد مجاز هستند';
        }
      }
    }

    // Check for 00 format
    if (value.startsWith('00')) {
      if (!value.startsWith('0098') && value !== '00') {
        return 'فقط شماره موبایل ایران (0098) پشتیبانی میشود';
      }
    }

    const normalized = normalizePhoneNumber(value);

    // Check if we have a normalized version to validate
    if (normalized) {
      // Check if starts with 0 (for Iranian numbers)
      if (!normalized.startsWith('0')) {
        return 'شماره موبایل باید با ۰۹، ۰۰۹۸۹ یا +۹۸۹ شروع شود';
      }

      // Check length for complete validation
      if (normalized.length === 11) {
        const prefix = normalized.slice(1, 4);
        if (!validPrefixes.includes(prefix)) {
          return 'پیش شماره موبایل معتبر نیست';
        }
      }

      // Check if length is appropriate
      if (normalized.length > 11) {
        return 'شماره موبایل نباید بیشتر از ۱۱ رقم باشد';
      }
    }

    return '';
  }, [normalizePhoneNumber, validPrefixes]);

  // Calculate validation states CORRECTLY
  const isValid = useCallback(() => {
    if (error) return false;

    const normalized = normalizePhoneNumber(phone);
    return normalized.length === 11 && normalized.startsWith('0');
  }, [phone, error, normalizePhoneNumber]);

  const isComplete = useCallback(() => {
    // 09 format: 11 digits (09123456789)
    if (phone.startsWith('09') && phone.length === 11) return true;

    // +989 format: 12 digits (+989123456789)
    if (phone.startsWith('+989') && phone.length === 12) return true;

    // 00989 format: 13 digits (00989123456789)
    if (phone.startsWith('00989') && phone.length === 13) return true;

    // 989 format: 11 digits (989123456789)
    if (phone.startsWith('989') && phone.length === 11) return true;

    return false;
  }, [phone]);

  useEffect(() => {
    // Focus input on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow + and 00 at the beginning for international format
    if ((value.startsWith('+') || value.startsWith('00')) && !/^[\d+]*$/.test(value)) {
      return;
    }

    // Allow only numbers and +/00 at the beginning
    if (!value.startsWith('+') && !value.startsWith('00') && !/^\d*$/.test(value)) {
      return;
    }

    // Validate
    const validationError = validatePhoneNumber(value);
    setError(validationError);
    setPhone(value);
  }, [validatePhoneNumber]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    const { selectionStart, value } = e.currentTarget;

    // Prevent deleting the + or 00 in international format
    if (e.key === 'Backspace') {
      if (value.startsWith('+') && selectionStart === 1) {
        e.preventDefault();
      }
      if (value.startsWith('00') && selectionStart === 2) {
        e.preventDefault();
      }
    }

    // Allow only numbers, +, and control keys
    if (!/[\d+]|Backspace|Delete|ArrowLeft|ArrowRight|Tab|Enter/.test(e.key)) {
      e.preventDefault();
    }

    // Prevent typing + anywhere except the beginning
    if (e.key === '+' && selectionStart !== 0) {
      e.preventDefault();
    }
  }, []);

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedData = e.clipboardData.getData('text');

    const validationError = validatePhoneNumber(pastedData);
    if (validationError) {
      e.preventDefault();
      setError(validationError);
    }
  }, [validatePhoneNumber]);

  const clear = useCallback(() => {
    setPhone('');
    setError('');
  }, []);

  return {
    phone,
    formattedPhone: formattedPhone(),
    error,
    isValid: isValid(),
    isComplete: isComplete(),
    inputRef,
    handleChange,
    handleKeyDown,
    handlePaste,
    clear,
    setPhone
  };
}
