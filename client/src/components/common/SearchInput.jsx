import { forwardRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';

const SearchInput = forwardRef(({
  value,
  onChange,
  onKeyDown,
  onClear,
  placeholder = 'Search...',
  loading = false,
  className = ''
}, ref) => {
  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChange) {
      onChange({ target: { value: '' } });
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)">
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Search className="w-5 h-5" />
        )}
      </div>

      <input
        ref={ref}
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="w-full bg-(--bg-primary) border border-(--border-subtle) rounded-lg pl-10 pr-10 py-2.5
          text-(--text-primary) placeholder-(--text-muted)
          focus:outline-none focus:border-(--accent-500) focus:ring-1 focus:ring-(--accent-500)
          transition-all duration-200"
      />

      {value && !loading && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text-muted) hover:text-(--text-primary) transition-colors"
          type="button"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
});

SearchInput.displayName = 'SearchInput';

export default SearchInput;
