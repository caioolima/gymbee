'use client';

import { useState } from 'react';
import Image from 'next/image';
import { GoogleIcon } from '@/components/icons/GoogleIcon';

export function LoginCard() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar lógica de login
    console.log('Email:', email);
  };

  const handleGoogleLogin = () => {
    // TODO: Implementar login com Google
    console.log('Google login');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card-bg rounded-2xl p-8 w-full max-w-md border-border border-2">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex mb-2">
            <Image
              src="/images/logo-gymbee.svg"
              alt="GymBee Logo"
              width={200}
              height={42}
              priority
              className="h-auto"
            />
          </div>
        </div>

        {/* Login Title */}
        <h1 className="text-foreground text-2xl font-semibold mb-8">
          Login
        </h1>

        {/* Email Input Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-foreground text-sm font-medium mb-2">
              E-mail/Usuário
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail/Usuário"
              className="w-full px-4 py-3 bg-input-bg border border-input-border rounded-lg text-foreground placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              required
            />
          </div>

          {/* Next Button */}
          <button
            type="submit"
            className="w-full bg-accent hover:opacity-80 cursor-pointer text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
          >
            Próximo
          </button>
        </form>

        {/* Separator */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-border"></div>
          <span className="px-4 text-text-muted text-sm">ou</span>
          <div className="flex-1 border-t border-border"></div>
        </div>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-input-bg hover:opacity-80 cursor-pointer text-foreground border border-input-border font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-border focus:ring-offset-2 focus:ring-offset-background flex items-center justify-center gap-3"
        >
          <GoogleIcon className="w-5 h-5" />
          Fazer login com o google
        </button>

        {/* Join Link */}
        <div className="text-center mt-6">
          <a
            href="#"
            className="text-foreground hover:text-accent transition-colors duration-200 text-md"
          >
            Junte-se a comeia
          </a>
        </div>
      </div>
    </div>
  );
}
