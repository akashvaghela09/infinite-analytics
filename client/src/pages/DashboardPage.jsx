import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Cloud, ArrowRight } from 'lucide-react';
import PageWrapper from '../components/common/PageWrapper';
import Card from '../components/common/Card';

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const featureCards = [
    {
      title: 'Crypto Coins',
      description: 'Track real-time cryptocurrency prices and market trends.',
      icon: TrendingUp,
      path: '/coins',
      color: 'from-(--accent-500) to-(--accent-600)'
    },
    {
      title: 'Weather Analytics',
      description: 'Monitor weather conditions with detailed forecasts.',
      icon: Cloud,
      path: '/weather',
      color: 'from-(--info) to-(--accent-500)'
    }
  ];

  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-(--text-primary)">
            Welcome
          </h1>
          <p className="text-5xl md:text-6xl lg:text-7xl font-bold text-(--accent-400) mt-2">
            {user?.name || 'User'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-2xl">
          {featureCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card
                key={card.title}
                hoverable
                onClick={() => navigate(card.path)}
                className="group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={`
                    w-12 h-12 rounded-xl bg-linear-to-br ${card.color}
                    flex items-center justify-center shrink-0
                  `}>
                    <Icon className="w-6 h-6 text-white" strokeWidth={1.5} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-(--text-primary) mb-1">
                      {card.title}
                    </h3>
                    <p className="text-(--text-secondary) text-xs line-clamp-2">
                      {card.description}
                    </p>
                  </div>

                  <ArrowRight className="w-5 h-5 text-(--accent-400) shrink-0" strokeWidth={2} />
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </PageWrapper>
  );
};

export default DashboardPage;
