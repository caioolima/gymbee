import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  views: number;
  createdAt: string;
}

export function useArticles() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: articles,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['articles'],
    queryFn: () => apiService.getTrendingArticles(token),
    enabled: !!token,
  });

  const viewMutation = useMutation({
    mutationFn: (articleId: string) => 
      apiService.viewArticle(articleId, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
    onError: (error: any) => {
      console.error('Erro ao registrar visualização:', error);
    },
  });

  const viewArticle = (articleId: string) => {
    return viewMutation.mutateAsync(articleId);
  };

  return {
    articles,
    isLoading,
    error,
    viewArticle,
    isViewing: viewMutation.isPending,
  };
}
