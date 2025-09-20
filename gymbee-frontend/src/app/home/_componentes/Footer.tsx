'use client';

import Link from 'next/link';
import { Heart, Mail, Phone, MapPin, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card-bg border-t border-border">
      <div className="max-w-[1600px] mx-auto px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo e Descrição */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-accent to-yellow-400 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <span className="text-2xl font-bold text-foreground">GymBee</span>
            </div>
            <p className="text-text-muted mb-6 max-w-md leading-relaxed">
              A comunidade fitness que conecta pessoas para treinar juntas. 
              Organize seus treinos, encontre duplas e descubra academias próximas em nossa plataforma.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-input-bg border border-border rounded-xl flex items-center justify-center hover:bg-accent hover:border-accent hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-6">Links Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#home" className="text-text-muted hover:text-accent transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="#features" className="text-text-muted hover:text-accent transition-colors">
                  Funcionalidades
                </Link>
              </li>
              <li>
                <Link href="#problems" className="text-text-muted hover:text-accent transition-colors">
                  Como Funciona
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-text-muted hover:text-accent transition-colors">
                  Entrar
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-6">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent" />
                <span className="text-text-muted">contato@gymbee.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent" />
                <span className="text-text-muted">(51) 99999-9999</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-accent" />
                <span className="text-text-muted">Porto Alegre, RS</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Linha de Separação */}
        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-text-muted text-sm">
              © 2024 GymBee. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-6">
              <Link href="#" className="text-text-muted hover:text-accent text-sm transition-colors">
                Política de Privacidade
              </Link>
              <Link href="#" className="text-text-muted hover:text-accent text-sm transition-colors">
                Termos de Uso
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="text-text-muted text-sm">Feito com</span>
            <Heart className="w-4 h-4 text-red-500" />
            <span className="text-text-muted text-sm">para nossa comunidade fitness</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
