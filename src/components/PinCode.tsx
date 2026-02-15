'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface PinCodeProps {
  mode: 'set' | 'verify';
  onSuccess: (pin: string) => void;
  onCancel: () => void;
  correctPin?: string | null;
}

export default function PinCode({ mode, onSuccess, onCancel, correctPin }: PinCodeProps) {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState<'enter' | 'confirm'>('enter');
  const [error, setError] = useState('');

  const handleDigit = (digit: string) => {
    setError('');
    if (step === 'enter' && pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) {
        if (mode === 'verify') {
          if (newPin === correctPin) {
            onSuccess(newPin);
          } else {
            setError('Verkeerde pincode');
            setTimeout(() => setPin(''), 500);
          }
        } else {
          setTimeout(() => setStep('confirm'), 300);
        }
      }
    } else if (step === 'confirm' && confirmPin.length < 4) {
      const newConfirm = confirmPin + digit;
      setConfirmPin(newConfirm);
      if (newConfirm.length === 4) {
        if (newConfirm === pin) {
          onSuccess(pin);
        } else {
          setError('Pincodes komen niet overeen');
          setConfirmPin('');
          setTimeout(() => {
            setPin('');
            setStep('enter');
            setError('');
          }, 1500);
        }
      }
    }
  };

  const handleBackspace = () => {
    if (step === 'confirm') {
      setConfirmPin(confirmPin.slice(0, -1));
    } else {
      setPin(pin.slice(0, -1));
    }
    setError('');
  };

  const currentPin = step === 'confirm' ? confirmPin : pin;
  const title = mode === 'set'
    ? step === 'enter' ? 'Kies een pincode' : 'Bevestig je pincode'
    : 'Voer pincode in';

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          {title}
        </h2>
        <p className="text-gray-500 text-center text-sm mb-6">
          {mode === 'set' ? 'Kies 4 cijfers die alleen jij weet' : 'Alleen voor ouders/verzorgers'}
        </p>

        {/* Pin dots */}
        <div className="flex justify-center gap-4 mb-6">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className={`w-5 h-5 rounded-full border-2 ${
                i < currentPin.length
                  ? error ? 'bg-red-400 border-red-400' : 'bg-[#6c63ff] border-[#6c63ff]'
                  : 'border-gray-300'
              }`}
              animate={error && i < currentPin.length ? { x: [0, -5, 5, -5, 0] } : {}}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>

        {error && (
          <motion.p
            className="text-red-500 text-center text-sm mb-4 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.p>
        )}

        {/* Number pad */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <motion.button
              key={digit}
              onClick={() => handleDigit(digit)}
              className="h-16 rounded-2xl bg-gray-100 text-2xl font-bold text-gray-700 hover:bg-gray-200 active:bg-gray-300 transition-colors"
              whileTap={{ scale: 0.9 }}
            >
              {digit}
            </motion.button>
          ))}
          <motion.button
            onClick={onCancel}
            className="h-16 rounded-2xl bg-gray-50 text-sm font-bold text-gray-400 hover:bg-gray-100 transition-colors"
            whileTap={{ scale: 0.9 }}
          >
            Terug
          </motion.button>
          <motion.button
            onClick={() => handleDigit('0')}
            className="h-16 rounded-2xl bg-gray-100 text-2xl font-bold text-gray-700 hover:bg-gray-200 active:bg-gray-300 transition-colors"
            whileTap={{ scale: 0.9 }}
          >
            0
          </motion.button>
          <motion.button
            onClick={handleBackspace}
            className="h-16 rounded-2xl bg-gray-50 text-2xl font-bold text-gray-400 hover:bg-gray-100 transition-colors"
            whileTap={{ scale: 0.9 }}
          >
            ←
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
