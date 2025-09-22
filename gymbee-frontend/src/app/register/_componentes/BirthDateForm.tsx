'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowLeft } from 'lucide-react';

interface BirthDateFormProps {
  onBack: () => void;
  onComplete: (birthDate: string) => void;
}

export function BirthDateForm({ onBack, onComplete }: BirthDateFormProps) {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const years = Array.from({ length: 100 }, (_, i) => (2024 - i).toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedMonth && selectedDay && selectedYear) {
      const monthIndex = months.indexOf(selectedMonth) + 1;
      const formattedDate = `${selectedYear}-${monthIndex.toString().padStart(2, '0')}-${selectedDay.padStart(2, '0')}`;
      onComplete(formattedDate);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-accent/10 to-yellow-300/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-accent/10 to-yellow-300/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center p-4 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-card-bg to-card-bg/90 backdrop-blur-sm rounded-2xl p-8 w-full max-w-lg border border-border/50 shadow-xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent/3 to-transparent rounded-2xl"></div>
          
          <div className="relative z-10">
            {/* Back Button */}
            <button
              onClick={onBack}
              className="mb-6 flex items-center gap-2 text-text-muted hover:text-foreground transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Voltar
            </button>

            {/* Calendar Icon */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-accent" />
              </div>
            </div>

            {/* Title and Description */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Adicione sua data de nascimento
              </h1>
              <p className="text-text-muted">
                Isso não fará parte do seu perfil público.
              </p>
            </div>

            {/* Date Selection Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date Dropdowns */}
              <div className="grid grid-cols-3 gap-4">
                {/* Month */}
                <div>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full px-4 py-3 bg-input-bg border border-input-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 hover:border-accent/50 text-center"
                    required
                  >
                    <option value="">Mês</option>
                    {months.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Day */}
                <div>
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className="w-full px-4 py-3 bg-input-bg border border-input-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 hover:border-accent/50 text-center"
                    required
                  >
                    <option value="">Dia</option>
                    {days.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Year */}
                <div>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-4 py-3 bg-input-bg border border-input-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 hover:border-accent/50 text-center"
                    required
                  >
                    <option value="">Ano</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Explanation Text */}
              <div className="text-center text-text-muted text-sm leading-relaxed">
                <p className="mb-2">
                  <strong>Você precisa inserir sua data de nascimento</strong>
                </p>
                <p>
                  Precisamos da sua data de nascimento real para segurança e experiência adequada. 
                  Ela é confidencial e não será exibida a outros usuários.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-accent hover:bg-accent/90 text-background font-semibold py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Próximo
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
