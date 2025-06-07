import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

type SearchType = 'track' | 'album' | 'artist' | 'playlist';

const SearchView = () => {
  const [searchTypes, setSearchTypes] = useState<SearchType[]>([
    'track', 'album', 'artist', 'playlist'
  ]);

  const toggleSearchType = (type: SearchType) => {
    setSearchTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    );
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-2 flex-wrap">
        {['track', 'album', 'artist', 'playlist'].map((type) => (
          <Button
            key={type}
            variant={searchTypes.includes(type as SearchType) ? 'default' : 'outline'}
            onClick={() => toggleSearchType(type as SearchType)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        ))}
      </div>
      
      {/* Componente di ricerca esistente */}
    </div>
  );
};

export default SearchView; 