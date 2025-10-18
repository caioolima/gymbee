'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card-bg border-t border-border">
      <div className="max-w-[1600px] mx-auto px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo e Descrição */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-6">
              <img 
                src="/images/logo-gymbee.svg" 
                alt="GymBee" 
                className="h-8 w-auto"
              />
            </div>
            <p className="text-text-muted mb-6 max-w-md leading-relaxed">
              A comunidade fitness que conecta pessoas para treinar juntas. 
              Organize seus treinos, encontre duplas e conecte-se com personal trainers em nosso app.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-input-bg border border-border rounded-xl flex items-center justify-center hover:bg-accent hover:border-accent hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          {/* Links Rápidos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-6">Links Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#home" className="text-text-muted hover:text-accent transition-colors">
                  Treine Melhor
                </Link>
              </li>
              <li>
                <Link href="#features" className="text-text-muted hover:text-accent transition-colors">
                  Soluções
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="text-text-muted hover:text-accent transition-colors">
                  Como Funciona
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-text-muted hover:text-accent transition-colors">
                  Entrar
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-text-muted hover:text-accent transition-colors">
                  Cadastrar
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contato */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-6">Contato</h3>
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
          </motion.div>
        </div>

        {/* Linha de Separação */}
        <motion.div 
          className="border-t border-border mt-12 pt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
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
        </motion.div>
      </div>
    </footer>
  );
}