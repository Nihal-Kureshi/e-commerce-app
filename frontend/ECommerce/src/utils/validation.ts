import { ValidationResult } from '../types';

export const validateEmail = (email: string): ValidationResult => {
  if (!email) return 'Email is required';
  if (!email.includes('@')) return 'Please enter a valid email address';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address';
  return null;
};

export const validatePassword = (password: string): ValidationResult => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters long';
  return null;
};

export const validateName = (name: string): ValidationResult => {
  if (!name) return 'Name is required';
  if (name.trim().length < 2) return 'Name must be at least 2 characters long';
  return null;
};

export const validateRequired = (value: string, fieldName: string): ValidationResult => {
  if (!value || value.trim().length === 0) return `${fieldName} is required`;
  return null;
};