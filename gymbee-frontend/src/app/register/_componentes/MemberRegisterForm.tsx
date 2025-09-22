'use client';

import { useState } from 'react';
import { Eye, EyeOff, Users, Mail, User, Lock, CreditCard, UserCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface MemberRegisterFormProps {
  onSuccess?: (data: any) => void;
  initialData?: any;
}

export function MemberRegisterForm({ onSuccess, initialData }: MemberRegisterFormProps) {
  const { registerUser } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    email: initialData?.email || '',
    fullName: initialData?.fullName || '',
    username: initialData?.username || '',
    password: initialData?.password || '',
    confirmPassword: initialData?.confirmPassword || '',
    cpf: initialData?.cpf || '',
    gender: initialData?.gender || 'M',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateCPF = (cpf: string): boolean => {
    // Remove caracteres não numéricos
    const cleanCPF = cpf.replace(/\D/g, '');
    
    // Verifica se tem 11 dígitos
    if (cleanCPF.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cleanCPF)) return false;
    
    // Validação dos dígitos verificadores
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.charAt(10))) return false;
    
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Format CPF
    if (name === 'cpf') {
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

        if (!formData.cpf.trim()) {
          newErrors.cpf = 'CPF é obrigatório';
        } else if (!validateCPF(formData.cpf)) {
          newErrors.cpf = 'CPF inválido';
        }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Formulário submetido!');
    
    if (!validateForm()) {
      console.log('Validação falhou');
      return;
    }

    console.log('Iniciando cadastro...');
    setIsSubmitting(true);
    
    try {
      // Preparar dados para envio (remover confirmPassword e formatar CPF)
      const { confirmPassword, ...userData } = formData;
      const cpfNumbers = userData.cpf.replace(/\D/g, '');

      const registrationData = {
        ...userData,
        cpf: cpfNumbers,
        // birthDate será adicionada na próxima etapa
      };

      console.log('Dados preparados para cadastro:', registrationData);
      
      // Chamar função de sucesso para ir para próxima tela com os dados
      if (onSuccess) {
        onSuccess(registrationData);
      }
    } catch (error) {
      console.error('Erro ao preparar dados:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao preparar dados. Tente novamente.';
      setErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-yellow-300/20 border border-accent/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-accent" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Seja um Membro
        </h1>
        <p className="text-text-muted text-sm">
          Preencha seus dados para começar sua jornada fitness
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* E-mail */}
        <div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="E-mail"
              className={`w-full pl-12 pr-4 py-3 bg-input-bg border rounded-lg text-foreground placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 ${
                errors.email ? 'border-red-500' : 'border-input-border hover:border-accent/50'
              }`}
            />
          </div>
          {errors.email && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
            <span className="w-1 h-1 bg-red-500 rounded-full"></span>
            {errors.email}
          </p>}
        </div>

        {/* Nome Completo */}
        <div>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Nome Completo"
              className={`w-full pl-12 pr-4 py-3 bg-input-bg border rounded-lg text-foreground placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 ${
                errors.fullName ? 'border-red-500' : 'border-input-border hover:border-accent/50'
              }`}
            />
          </div>
          {errors.fullName && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
            <span className="w-1 h-1 bg-red-500 rounded-full"></span>
            {errors.fullName}
          </p>}
        </div>

        {/* Usuário */}
        <div>
          <div className="relative">
            <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Nome de usuário"
              className={`w-full pl-12 pr-4 py-3 bg-input-bg border rounded-lg text-foreground placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 ${
                errors.username ? 'border-red-500' : 'border-input-border hover:border-accent/50'
              }`}
            />
          </div>
          {errors.username && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
            <span className="w-1 h-1 bg-red-500 rounded-full"></span>
            {errors.username}
          </p>}
        </div>

        {/* Senha */}
        <div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Senha"
              className={`w-full pl-12 pr-12 py-3 bg-input-bg border rounded-lg text-foreground placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 ${
                errors.password ? 'border-red-500' : 'border-input-border hover:border-accent/50'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-foreground transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
            <span className="w-1 h-1 bg-red-500 rounded-full"></span>
            {errors.password}
          </p>}
        </div>

        {/* Confirmar Senha */}
        <div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirme sua senha"
              className={`w-full pl-12 pr-12 py-3 bg-input-bg border rounded-lg text-foreground placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 ${
                errors.confirmPassword ? 'border-red-500' : 'border-input-border hover:border-accent/50'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-foreground transition-colors cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
            <span className="w-1 h-1 bg-red-500 rounded-full"></span>
            {errors.confirmPassword}
          </p>}
        </div>

        {/* CPF */}
        <div>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              id="cpf"
              name="cpf"
              value={formData.cpf}
              onChange={handleInputChange}
              placeholder="000.000.000-00"
              maxLength={14}
              className={`w-full pl-12 pr-4 py-3 bg-input-bg border rounded-lg text-foreground placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 ${
                errors.cpf ? 'border-red-500' : 'border-input-border hover:border-accent/50'
              }`}
            />
          </div>
          {errors.cpf && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
            <span className="w-1 h-1 bg-red-500 rounded-full"></span>
            {errors.cpf}
          </p>}
        </div>

        {/* Gênero */}
        <div>
          <div className="relative">
            <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className={`w-full pl-12 pr-4 py-3 bg-input-bg border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 ${
                errors.gender ? 'border-red-500' : 'border-input-border hover:border-accent/50'
              }`}
            >
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
          {errors.gender && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
            <span className="w-1 h-1 bg-red-500 rounded-full"></span>
            {errors.gender}
          </p>}
        </div>

        {/* Error Message */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <span className="w-1 h-1 bg-red-500 rounded-full"></span>
            {errors.submit}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          onClick={(e) => {
            console.log('Botão Criar Conta clicado!');
            if (isSubmitting) {
              e.preventDefault();
              console.log('Botão desabilitado, ignorando clique');
            }
          }}
          className="w-full bg-accent hover:bg-accent/90 disabled:bg-accent/50 disabled:cursor-not-allowed text-black font-bold py-3 px-6 rounded-lg cursor-pointer flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
              Criando conta...
            </>
          ) : (
            <>
              <Users className="w-5 h-5" />
              Criar Conta
            </>
          )}
        </button>
      </form>
    </div>
  );
}
