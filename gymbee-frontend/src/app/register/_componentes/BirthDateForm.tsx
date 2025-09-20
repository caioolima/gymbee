'use client';

import { useState } from 'react';
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card-bg border border-border rounded-2xl p-8 w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-text-muted hover:text-foreground transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>

        {/* Birthday Cake Icon */}
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
                className="w-full px-4 py-3 bg-input-bg border border-input-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
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
                className="w-full px-4 py-3 bg-input-bg border border-input-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
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
                className="w-full px-4 py-3 bg-input-bg border border-input-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
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
            className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background cursor-pointer"
          >
            Próximo
          </button>
        </form>
      </div>
    </div>
  );
}
