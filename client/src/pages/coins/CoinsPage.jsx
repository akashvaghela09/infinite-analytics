import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../components/common/PageWrapper';
import Card from '../../components/common/Card';
import SearchInput from '../../components/common/SearchInput';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import { SkeletonTable, SkeletonStatCard } from '../../components/common/Skeleton';
import {
  fetchCoins,
  setSearchTerm,
  clearSearch,
  setPage,
  setSortBy,
  setSortOrder,
} from '../../redux/coins/coinsSlice';
import { TrendingUp, TrendingDown, Search, ArrowRight, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';

const SortHeader = ({ field, children, align = 'right', isActive, onSort }) => (
  <th
    className={`py-4 px-6 text-sm font-medium text-(--text-secondary) cursor-pointer hover:text-(--text-primary) transition-colors ${align === 'left' ? 'text-left' : 'text-right'}`}
    onClick={() => onSort(field)}
  >
    <span className="inline-flex items-center gap-1">
      {children}
      <ArrowUpDown
        className={`w-3 h-3 transition-opacity ${isActive ? 'opacity-100 text-(--accent-400)' : 'opacity-40'}`}
      />
    </span>
  </th>
);

const CoinsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    filteredCoins,
    searchTerm,
    isLoadingCoins,
    isError,
    message,
    page,
    limit,
    totalCoins,
    totalPages,
    sortBy,
    sortOrder,
  } = useSelector((state) => state.coins);

  useEffect(() => {
    dispatch(fetchCoins());
  }, [dispatch, page, sortBy, sortOrder]);

  const handleSearchChange = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handleClearSearch = () => {
    dispatch(clearSearch());
  };

  const handleRowClick = (symbol) => {
    navigate(`/coins/${symbol}`);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(setPage(newPage));
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      dispatch(setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'));
    } else {
      dispatch(setSortBy(field));
      dispatch(setSortOrder('desc'));
    }
  };

  const formatPrice = useCallback((price) => {
    if (price >= 1000) {
      return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 });
  }, []);

  const formatVolume = useCallback((volume) => {
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
  }, []);

  const stats = {
    totalPairs: totalCoins,
    currentPage: page,
    totalPages: totalPages,
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <PageWrapper
      title="Markets"
      description="Track real-time cryptocurrency prices and market trends"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {isLoadingCoins ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)
        ) : (
          <>
            <Card className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-lg bg-(--accent-500)/10">
                  <TrendingUp className="w-5 h-5 text-(--accent-400)" strokeWidth={1.5} />
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-(--success)/10 text-(--success)">
                  USDT
                </span>
              </div>
              <p className="text-2xl font-bold text-(--text-primary) font-mono">{stats.totalPairs}</p>
              <p className="text-sm text-(--text-muted) mt-1">Total Trading Pairs</p>
            </Card>

            <Card className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-lg bg-(--accent-500)/10">
                  <TrendingUp className="w-5 h-5 text-(--accent-400)" strokeWidth={1.5} />
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-(--accent-500)/10 text-(--accent-400)">
                  {limit}/page
                </span>
              </div>
              <p className="text-2xl font-bold text-(--text-primary) font-mono">Page {page}</p>
              <p className="text-sm text-(--text-muted) mt-1">of {stats.totalPages} pages</p>
            </Card>

            <Card className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-lg bg-(--accent-500)/10">
                  <TrendingUp className="w-5 h-5 text-(--accent-400)" strokeWidth={1.5} />
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-(--success)/10 text-(--success)">
                  {sortOrder === 'desc' ? '↓' : '↑'}
                </span>
              </div>
              <p className="text-2xl font-bold text-(--text-primary) font-mono capitalize">{sortBy === 'quoteVolume' ? 'Volume' : sortBy}</p>
              <p className="text-sm text-(--text-muted) mt-1">Sorted By</p>
            </Card>

            <Card className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-lg bg-(--accent-500)/10">
                  <TrendingDown className="w-5 h-5 text-(--accent-400)" strokeWidth={1.5} />
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-(--success)/10 text-(--success)">
                  Live
                </span>
              </div>
              <p className="text-2xl font-bold text-(--text-primary) font-mono">Binance</p>
              <p className="text-sm text-(--text-muted) mt-1">Data Source</p>
            </Card>
          </>
        )}
      </div>

      <Card className="mb-6 p-4">
        <SearchInput
          value={searchTerm}
          onChange={handleSearchChange}
          onClear={handleClearSearch}
          placeholder="Search by symbol (e.g., BTC, ETH)..."
          loading={isLoadingCoins}
          className="max-w-md"
        />
      </Card>

      <Card className="overflow-hidden">
        {isLoadingCoins ? (
          <SkeletonTable rows={limit > 50 ? 10 : limit} columns={7} />
        ) : isError ? (
          <div className="text-center py-12 text-(--error)">
            <p>Error loading coins: {message}</p>
          </div>
        ) : filteredCoins.length === 0 ? (
          <EmptyState
            icon={<Search className="w-8 h-8 text-(--accent-400)" />}
            title="No coins found"
            description={searchTerm ? `No coins match "${searchTerm}"` : "No coins available"}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-(--border-subtle)">
                    <SortHeader field="symbol" align="left" isActive={sortBy === 'symbol'} onSort={handleSort}>Symbol</SortHeader>
                    <SortHeader field="lastPrice" isActive={sortBy === 'lastPrice'} onSort={handleSort}>Last Price</SortHeader>
                    <SortHeader field="priceChangePercent" isActive={sortBy === 'priceChangePercent'} onSort={handleSort}>24h Change</SortHeader>
                    <SortHeader field="highPrice" isActive={sortBy === 'highPrice'} onSort={handleSort}>24h High</SortHeader>
                    <SortHeader field="lowPrice" isActive={sortBy === 'lowPrice'} onSort={handleSort}>24h Low</SortHeader>
                    <SortHeader field="quoteVolume" isActive={sortBy === 'quoteVolume'} onSort={handleSort}>Volume</SortHeader>
                    <th className="text-center py-4 px-6 text-sm font-medium text-(--text-secondary)">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCoins.map((coin) => (
                    <tr
                      key={coin.symbol}
                      onClick={() => handleRowClick(coin.symbol)}
                      className="border-b border-(--border-subtle) last:border-b-0 hover:bg-(--accent-500)/5 cursor-pointer transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-(--accent-500)/10 flex items-center justify-center">
                            <span className="text-xs font-bold text-(--accent-400)">
                              {coin.symbol.slice(0, 2)}
                            </span>
                          </div>
                          <span className="font-semibold text-(--text-primary)">
                            {coin.symbol.replace('USDT', '')}
                          </span>
                          <span className="text-xs text-(--text-muted)">/USDT</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right font-mono text-(--text-primary)">
                        ${formatPrice(coin.lastPrice)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Badge value={coin.priceChangePercent} />
                      </td>
                      <td className="py-4 px-6 text-right font-mono text-(--success)">
                        ${formatPrice(coin.highPrice)}
                      </td>
                      <td className="py-4 px-6 text-right font-mono text-(--error)">
                        ${formatPrice(coin.lowPrice)}
                      </td>
                      <td className="py-4 px-6 text-right font-mono text-(--text-secondary)">
                        {formatVolume(coin.quoteVolume)}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button className="p-2 rounded-lg hover:bg-(--accent-500)/10 text-(--accent-400) transition-colors">
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-(--border-subtle)">
                <p className="text-sm text-(--text-muted)">
                  Showing {(page - 1) * limit + 1}–{Math.min(page * limit, totalCoins)} of {totalCoins} pairs
                </p>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                    className="p-2 rounded-lg border border-(--border-subtle) text-(--text-secondary) hover:text-(--text-primary) hover:border-(--accent-500)/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {getPageNumbers().map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`min-w-[36px] h-9 rounded-lg text-sm font-medium transition-colors ${
                        pageNum === page
                          ? 'bg-(--accent-500) text-white'
                          : 'border border-(--border-subtle) text-(--text-secondary) hover:text-(--text-primary) hover:border-(--accent-500)/50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages}
                    className="p-2 rounded-lg border border-(--border-subtle) text-(--text-secondary) hover:text-(--text-primary) hover:border-(--accent-500)/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </PageWrapper>
  );
};

export default CoinsPage;
