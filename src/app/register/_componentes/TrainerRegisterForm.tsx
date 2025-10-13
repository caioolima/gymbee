'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface TrainerRegisterFormProps {
  onSuccess?: (data: any) => void;
}

export function TrainerRegisterForm({ onSuccess }: TrainerRegisterFormProps) {
  const { registerTrainer } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    username: '',
    password: '',
    confirmPassword: '',
    cref: '',
    cpf: '',
    gender: 'M',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Format CREF
    if (name === 'cref') {
      const formattedValue = value
        .replace(/[^0-9A-Za-z]/g, '') // Remove all non-alphanumeric characters
        .replace(/(\d{6})([A-Za-z])([A-Za-z]{2})/, '$1-$2/$3') // Format: 000000-G/UF
        .toUpperCase(); // Convert to uppercase
      
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else if (name === 'cpf') {
      // Format CPF
      const formattedValue = value
        .replace(/\D/g, '') // Remove all non-digits
        .replace(/(\d{3})(\d)/, '$1.$2') // Add first dot
        .replace(/(\d{3})(\d)/, '$1.$2') // Add second dot
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Add dash
      
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Nome completo é obrigatório';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Nome de usuário é obrigatório';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Nome de usuário deve ter pelo menos 3 caracteres';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    if (!formData.cref.trim()) {
      newErrors.cref = 'CREF é obrigatório';
    } else if (!/^\d{6}-[A-Z]\/[A-Z]{2}$/.test(formData.cref)) {
      newErrors.cref = 'CREF deve estar no formato 000000-G/UF (6 números, letra, barra, sigla do estado)';
    }

    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf)) {
      newErrors.cpf = 'CPF deve estar no formato 000.000.000-00';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Preparar dados para envio (remover confirmPassword e formatar CPF)
      const { confirmPassword, ...trainerData } = formData;
      const cpfNumbers = trainerData.cpf.replace(/\D/g, '');
      
      const registrationData = {
        ...trainerData,
        cpf: cpfNumbers,
        // birthDate será adicionada na próxima etapa
      };

      console.log('Dados preparados para cadastro:', registrationData);
      
      // Chamar função de sucesso para ir para próxima tela com os dados
      if (onSuccess) {
        onSuccess(registrationData);
      }
    } catch (error) {
      console.error('Erro no cadastro:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao realizar cadastro. Tente novamente.';
      setErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-foreground text-2xl font-semibold mb-8 text-center">
        Você é um personal trainer?
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* E-mail */}
        <div>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="E-mail"
            className={`w-full px-4 py-3 bg-input-bg border rounded-lg text-foreground placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent ${
              errors.email ? 'border-red-500' : 'border-input-border'
            }`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Nome Completo */}
        <div>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Nome Completo"
            className={`w-full px-4 py-3 bg-input-bg border rounded-lg text-foreground placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent ${
              errors.fullName ? 'border-red-500' : 'border-input-border'
            }`}
          />
          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
        </div>

        {/* Usuário */}
        <div>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Usuário"
            className={`w-full px-4 py-3 bg-input-bg border rounded-lg text-foreground placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent ${
              errors.username ? 'border-red-500' : 'border-input-border'
            }`}
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
        </div>

        {/* Senha */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Senha"
            className={`w-full px-4 py-3 pr-12 bg-input-bg border rounded-lg text-foreground placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent ${
              errors.password ? 'border-red-500' : 'border-input-border'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-foreground transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        {/* Confirmar Senha */}
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirme sua senha"
            className={`w-full px-4 py-3 pr-12 bg-input-bg border rounded-lg text-foreground placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent ${
              errors.confirmPassword ? 'border-red-500' : 'border-input-border'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-foreground transition-colors cursor-pointer"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>

        {/* CPF */}
        <div>
          <input
            type="text"
            id="cpf"
            name="cpf"
            value={formData.cpf}
            onChange={handleInputChange}
            placeholder="000.000.000-00"
            maxLength={14}
            className={`w-full px-4 py-3 bg-input-bg border rounded-lg text-foreground placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent ${
              errors.cpf ? 'border-red-500' : 'border-input-border'
            }`}
          />
          {errors.cpf && <p className="text-red-500 text-sm mt-1">{errors.cpf}</p>}
        </div>

        {/* CREF */}
        <div>
          <input
            type="text"
            id="cref"
            name="cref"
            value={formData.cref}
            onChange={handleInputChange}
            placeholder="000000-G/UF"
            maxLength={11}
            className={`w-full px-4 py-3 bg-input-bg border rounded-lg text-foreground placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent ${
              errors.cref ? 'border-red-500' : 'border-input-border'
            }`}
          />
          {errors.cref && <p className="text-red-500 text-sm mt-1">{errors.cref}</p>}
        </div>

        {/* Gênero */}
        <div>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 bg-input-bg border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent ${
              errors.gender ? 'border-red-500' : 'border-input-border'
            }`}
          >
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
            <option value="Outro">Outro</option>
          </select>
          {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
        </div>

        {/* Error Message */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {errors.submit}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-accent hover:bg-accent/90 disabled:bg-accent/50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background cursor-pointer"
        >
          {isSubmitting ? 'Criando conta...' : 'Próximo'}
        </button>
      </form>
    </div>
  );
}
