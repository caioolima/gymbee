'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Eye, Calendar, User, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { useArticles } from '@/hooks/useArticlesQuery';

interface ArticlesCarouselProps {
  user: any;
}

export function ArticlesCarousel({ user }: ArticlesCarouselProps) {
  const { articles, isLoading, error, viewArticle } = useArticles();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleViewArticle = async (articleId: string) => {
    try {
      await viewArticle(articleId);
    } catch (error) {
      console.error('Erro ao registrar visualização:', error);
    }
  };

  const nextSlide = () => {
    if (articles && articles.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }
  };

  const prevSlide = () => {
    if (articles && articles.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-card-bg to-card-bg/90 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-yellow-300/5"></div>
        <div className="relative z-10 flex items-center justify-center h-48">
          <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-yellow-300/20 border border-accent/30 rounded-2xl flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !articles || articles.length === 0) {
    return (
      <div className="bg-gradient-to-br from-card-bg to-card-bg/90 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg relative overflow-hidden h-full flex flex-col">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-yellow-300/5"></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-center h-full">
          <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-yellow-300/20 border border-accent/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-accent" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Artigos em Destaque</h3>
          <p className="text-text-muted">Nenhum artigo disponível no momento</p>
        </div>
      </div>
    );
  }

  const currentArticle = articles[currentIndex];

  return (
    <div className="group bg-gradient-to-br from-card-bg to-card-bg/90 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg hover:shadow-xl hover:shadow-accent/10 transition-all duration-500 transform hover:scale-[1.01] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-yellow-300/5"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-accent/20 via-yellow-400/10 to-amber-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Artigos em Destaque</h3>
                <p className="text-sm text-text-muted">Assuntos mais falados do mundo fitness</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                className="p-2 rounded-xl bg-card-bg/50 hover:bg-card-bg/80 border border-border/30 hover:border-accent/30 transition-all duration-300"
              >
                <ChevronLeft className="w-4 h-4 text-foreground" />
              </button>
              <span className="text-sm text-text-muted px-3 py-1 bg-card-bg/50 rounded-lg border border-border/30">
                {currentIndex + 1} / {articles.length}
              </span>
              <button
                onClick={nextSlide}
                className="p-2 rounded-xl bg-card-bg/50 hover:bg-card-bg/80 border border-border/30 hover:border-accent/30 transition-all duration-300"
              >
                <ChevronRight className="w-4 h-4 text-foreground" />
              </button>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="px-6 pb-6"
        >
          <div className="bg-gradient-to-br from-card-bg/50 to-card-bg/30 backdrop-blur-sm rounded-2xl p-6 border border-border/30 hover:border-accent/30 transition-all duration-300">
            <div className="flex items-start gap-4">
              {/* Article Image/Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-accent/20 via-yellow-400/10 to-amber-500/20 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-8 h-8 text-accent" />
              </div>

              {/* Article Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-semibold border border-accent/20">
                    {currentArticle.category}
                  </span>
                  <div className="flex items-center text-text-muted text-xs">
                    <Eye className="w-3 h-3 mr-1" />
                    {currentArticle.views}
                  </div>
                </div>

                <h4 className="text-lg font-bold text-foreground mb-3 line-clamp-2">
                  {currentArticle.title}
                </h4>

                <p className="text-text-muted text-sm mb-4 line-clamp-3 leading-relaxed">
                  {currentArticle.content.substring(0, 120)}...
                </p>

                <div className="flex items-center justify-between text-xs text-text-muted mb-4">
                  <div className="flex items-center">
                    <User className="w-3 h-3 mr-1" />
                    {currentArticle.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(currentArticle.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                </div>

                {/* Tags */}
                {currentArticle.tags && currentArticle.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {currentArticle.tags.slice(0, 3).map((tag: string) => (
                      <span
                        key={tag}
                        className="bg-card-bg/50 text-text-muted px-2 py-1 rounded-lg text-xs border border-border/30"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Read More Button */}
                <button
                  onClick={() => handleViewArticle(currentArticle.id)}
                  className="w-full bg-gradient-to-r from-accent to-yellow-400 hover:from-accent/90 hover:to-yellow-400/90 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-accent/25"
                >
                  Ler Artigo
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dots Indicator */}
        {articles.length > 1 && (
          <div className="flex justify-center gap-2 pb-6">
            {articles.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-accent scale-125 shadow-lg shadow-accent/50' 
                    : 'bg-border/50 hover:bg-border/80'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
