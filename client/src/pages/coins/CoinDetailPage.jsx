import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import PageWrapper from '../../components/common/PageWrapper';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Tabs from '../../components/common/Tabs';
import StatCard from '../../components/common/StatCard';
import CombinedChart from '../../components/charts/CombinedChart';
import PriceLineChart from '../../components/charts/PriceLineChart';
import { SkeletonStatCard, SkeletonChart } from '../../components/common/Skeleton';
import {
  fetchCoinDetails,
  fetchKlines,
  setInterval as setReduxInterval,
  clearSelectedCoin
} from '../../redux/coins/coinsSlice';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, BarChart3, Activity } from 'lucide-react';

const INTERVAL_TABS = [
  { label: '1H', value: '1h' },
  { label: '4H', value: '4h' },
  { label: '1D', value: '1d' },
  { label: '1W', value: '1w' }
];

const CoinDetailPage = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    selectedCoin,
    klines,
    selectedInterval,
    isLoadingCoinDetails,
    isLoadingKlines,
    isError,
    message
  } = useSelector((state) => state.coins);

  useEffect(() => {
    if (symbol) {
      dispatch(fetchCoinDetails(symbol));
    }
    return () => {
      dispatch(clearSelectedCoin());
    };
  }, [dispatch, symbol]);

  useEffect(() => {
    if (symbol) {
      dispatch(fetchKlines({ symbol, interval: selectedInterval, limit: 100 }));
    }
  }, [dispatch, symbol, selectedInterval]);

  const handleIntervalChange = (interval) => {
    dispatch(setReduxInterval(interval));
  };

  const handleBack = () => {
    navigate('/coins');
  };

  const formatPrice = (price) => {
    if (price >= 1000) {
      return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 });
  };

  const formatVolume = (volume) => {
    if (volume >= 1e9) {
      return `${(volume / 1e9).toFixed(2)}B`;
    }
    if (volume >= 1e6) {
      return `${(volume / 1e6).toFixed(2)}M`;
    }
    if (volume >= 1e3) {
      return `${(volume / 1e3).toFixed(2)}K`;
    }
    return volume.toFixed(2);
  };

  if (isLoadingCoinDetails && !selectedCoin) {
    return (
      <PageWrapper title="Loading...">
        <div className="mb-6">
          <div className="w-32 h-8 rounded animate-pulse bg-(--border-subtle)" />
        </div>
        <div className="p-6 rounded-xl border border-(--border-subtle) bg-(--surface-elevated) mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-(--border-subtle) animate-pulse" />
              <div className="space-y-2">
                <div className="h-8 w-32 rounded animate-pulse bg-(--border-subtle)" />
                <div className="h-4 w-20 rounded animate-pulse bg-(--border-subtle)" />
              </div>
            </div>
            <div className="space-y-2 text-right">
              <div className="h-8 w-28 rounded animate-pulse bg-(--border-subtle)" />
              <div className="h-5 w-16 rounded-full animate-pulse bg-(--border-subtle)" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonStatCard key={i} />
          ))}
        </div>
        <SkeletonChart />
      </PageWrapper>
    );
  }

  if (isError && !selectedCoin) {
    return (
      <PageWrapper title="Error">
        <Card className="p-8 text-center">
          <div className="text-(--error) mb-4">
            <Activity className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-(--text-primary) mb-2">
            Failed to load coin data
          </h3>
          <p className="text-(--text-secondary) mb-6">{message}</p>
          <Button onClick={handleBack} variant="primary">
            Back to Markets
          </Button>
        </Card>
      </PageWrapper>
    );
  }

  if (!selectedCoin && !isLoadingCoinDetails) {
    return (
      <PageWrapper title="Not Found">
        <Card className="p-8 text-center">
          <h3 className="text-xl font-semibold text-(--text-primary) mb-2">
            Coin not found
          </h3>
          <Button onClick={handleBack} variant="primary" className="mt-4">
            Back to Markets
          </Button>
        </Card>
      </PageWrapper>
    );
  }

  const coinName = selectedCoin.symbol.replace('USDT', '');

  return (
    <PageWrapper
      title={`${coinName}/USDT`}
      description={`Real-time price data and charts for ${coinName}`}
    >
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="flex items-center gap-2 text-(--text-secondary) hover:text-(--text-primary)"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Markets
        </Button>
      </div>

      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-(--accent-500)/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-(--accent-400)">
                {coinName.slice(0, 2)}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-(--text-primary)">
                {coinName}
                <span className="text-(--text-muted) text-xl font-normal">/USDT</span>
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-(--text-secondary)">Binance</span>
                <span className="w-1 h-1 rounded-full bg-(--text-muted)" />
                <span className="text-sm text-(--text-secondary)">Spot</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <p className="text-3xl font-bold font-mono text-(--text-primary)">
              ${formatPrice(selectedCoin.lastPrice)}
            </p>
            <Badge value={selectedCoin.priceChangePercent} />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Last Price"
          value={`$${formatPrice(selectedCoin.lastPrice)}`}
          icon={DollarSign}
          trend={selectedCoin.priceChangePercent}
        />
        <StatCard
          label="24h High"
          value={`$${formatPrice(selectedCoin.highPrice)}`}
          icon={TrendingUp}
          trend={selectedCoin.highPrice > selectedCoin.lastPrice ? selectedCoin.priceChangePercent : 0}
        />
        <StatCard
          label="24h Low"
          value={`$${formatPrice(selectedCoin.lowPrice)}`}
          icon={TrendingDown}
          trend={selectedCoin.lowPrice < selectedCoin.lastPrice ? selectedCoin.priceChangePercent : 0}
        />
        <StatCard
          label="24h Volume"
          value={formatVolume(selectedCoin.volume)}
          subValue={`$${formatVolume(selectedCoin.quoteVolume)} USDT`}
          icon={BarChart3}
        />
      </div>

      <Card className="mb-6 overflow-hidden">
        <div className="border-b border-(--border-subtle)">
          <Tabs
            tabs={INTERVAL_TABS}
            activeTab={selectedInterval}
            onChange={handleIntervalChange}
          />
        </div>

        <div className="p-4">
          {isLoadingKlines ? (
            <SkeletonChart />
          ) : (
            <>
              <div className="h-96 mb-8">
                <h3 className="text-sm font-medium text-(--text-secondary) mb-2">
                  Price Chart ({selectedInterval})
                </h3>
                <CombinedChart data={klines} symbol={symbol} />
              </div>

              <div className="h-64">
                <h3 className="text-sm font-medium text-(--text-secondary) mb-2">
                  Price Trend
                </h3>
                <PriceLineChart data={klines} />
              </div>
            </>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-(--text-primary) mb-4">
            Market Stats
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-(--border-subtle)">
              <span className="text-(--text-secondary)">Weighted Avg Price</span>
              <span className="font-mono text-(--text-primary)">
                ${formatPrice(selectedCoin.weightedAvgPrice)}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-(--border-subtle)">
              <span className="text-(--text-secondary)">Price Change</span>
              <span className={`font-mono ${selectedCoin.priceChange >= 0 ? 'text-(--success)' : 'text-(--error)'}`}>
                {selectedCoin.priceChange >= 0 ? '+' : ''}{formatPrice(selectedCoin.priceChange)}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-(--border-subtle)">
              <span className="text-(--text-secondary)">Trades (24h)</span>
              <span className="font-mono text-(--text-primary)">
                {selectedCoin.count?.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-(--text-secondary)">Symbol</span>
              <span className="font-mono text-(--text-primary)">{selectedCoin.symbol}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-(--text-primary) mb-4">
            Price Range (24h)
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-(--text-secondary)">Low</span>
                <span className="text-sm text-(--text-secondary)">High</span>
              </div>
              <div className="h-2 bg-(--surface-elevated) rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-(--error) via-(--accent-500) to-(--success)"
                  style={{
                    width: `${((selectedCoin.lastPrice - selectedCoin.lowPrice) / (selectedCoin.highPrice - selectedCoin.lowPrice)) * 100}%`
                  }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="font-mono text-(--error)">${formatPrice(selectedCoin.lowPrice)}</span>
                <span className="font-mono text-(--success)">${formatPrice(selectedCoin.highPrice)}</span>
              </div>
            </div>
            <div className="pt-4 border-t border-(--border-subtle)">
              <div className="flex justify-between">
                <span className="text-(--text-secondary)">Current Position</span>
                <span className="font-mono text-(--accent-400)">
                  {((selectedCoin.lastPrice - selectedCoin.lowPrice) / (selectedCoin.highPrice - selectedCoin.lowPrice) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
};

export default CoinDetailPage;
