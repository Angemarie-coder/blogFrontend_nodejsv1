import React from 'react';

interface EmailInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
}

const EmailInput: React.FC<EmailInputProps> = ({ value, onChange, name = 'email', placeholder = 'Enter your email', disabled = false }) => (
  <input
    type="email"
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    disabled={disabled}
    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
  />
);

export default EmailInput; 