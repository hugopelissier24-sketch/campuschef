document.addEventListener('DOMContentLoaded', () => {

  const CONFIG = {
    API: {
      MEAL_DB_BASE_URL: 'https://www.themealdb.com/api/json/v1/1',
      MY_MEMORY_BASE_URL: 'https://api.mymemory.translated.net/get',
      TIMEOUT_MS: 5000,
    },
    STORAGE_KEYS: {
      FAVORITES: 'campuschef_favorites_v1',
    },
    MAX_TRANSLATION_LENGTH: 450,
  };

  const LOCAL_RECIPES = [
    {
      id: 'local-1',
      title: 'Pâtes "Carbonara" étudiante',
      timeMinutes: 12,
      cost: 1.50,
      difficulty: 'Facile',
      category: 'quick',
      image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500',
      ingredients: ['Pâtes', 'Crème fraîche', 'Lardons', 'Jaune d\'œuf', 'Poivre'],
      instructions: '1. Faire cuire les pâtes dans de l\'eau bouillante salée.\n2. Faire revenir les lardons à la poêle.\n3. Mélanger le jaune d\'œuf avec la crème.\n4. Égoutter les pâtes, mélanger le tout hors du feu.',
      isLocal: true
    },
    {
      id: 'local-2',
      title: 'Bowl Avocat - Œuf - Thon',
      timeMinutes: 8,
      cost: 2.20,
      difficulty: 'Très facile',
      category: 'quick',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500',
      ingredients: ['1/2 Avocat', '1 œuf dur', '1 petite boîte de thon', 'Riz précuit', 'Vinaigrette'],
      instructions: '1. Faire réchauffer le riz.\n2. Couper l\'avocat en tranches.\n3. Disposer le riz, le thon égoutté, l\'avocat et l\'œuf coupé en deux.\n4. Arroser de vinaigrette.',
      isLocal: true
    },
    {
      id: 'local-3',
      title: 'Poêlée express de pois chiches',
      timeMinutes: 10,
      cost: 1.20,
      difficulty: 'Facile',
      category: 'healthy',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500',
      ingredients: ['Pois chiches en conserve', 'Épices (Curry/Cumin)', 'Sauce tomate', 'Oignon'],
      instructions: '1. Faire revenir l\'oignon émincé.\n2. Ajouter les pois chiches rincés et les épices.\n3. Verser la sauce tomate et laisser mijoter 5 min.',
      isLocal: true
    },
    {
      id: 'local-4',
      title: 'Wrap Poulet & Crudités',
      timeMinutes: 5,
      cost: 1.80,
      difficulty: 'Très facile',
      category: 'cheap',
      image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500',
      ingredients: ['Tortilla de blé', 'Restes de poulet ou dés de dinde', 'Salade', 'Tomate', 'Sauce yaourt'],
      instructions: '1. Tartiner la tortilla de sauce yaourt.\n2. Ajouter la salade, les dés de tomate et le poulet.\n3. Rouler serré et couper en deux.',
      isLocal: true
    }
  ];

  const StorageService = {
    getFavorites() {
      try {
        const data = localStorage.getItem(CONFIG.STORAGE_KEYS.FAVORITES);
        return data ? JSON.parse(data) : [];
      } catch (e) {
        console.error('Erreur localStorage:', e);
        return [];
      }
    },
    toggleFavorite(recipeId) {
      const favorites = new Set(this.getFavorites());
      if (favorites.has(recipeId)) favorites.delete(recipeId);
      else favorites.add(recipeId);
      const updated = Array.from(favorites);
      localStorage.setItem(CONFIG.STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
      return updated;
    }
  };

  const ApiService = {
    async fetchWithTimeout(url) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), CONFIG.API.TIMEOUT_MS);
      try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timer);
        if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);
        return await response.json();
      } catch (err) {
        clearTimeout(timer);
        throw err;
      }
    },
    async searchRecipes(query) {
      const cleanedQuery = query.trim().toLowerCase();
      try {
        let data = await this.fetchWithTimeout(`${CONFIG.API.MEAL_DB_BASE_URL}/search.php?s=${encodeURIComponent(cleanedQuery)}`);
        if (!data.meals) {
          data = await this.fetchWithTimeout(`${CONFIG.API.MEAL_DB_BASE_URL}/filter.php?i=${encodeURIComponent(cleanedQuery)}`);
        }
        if (!data.meals) return [];

        return data.meals.map(meal => ({
          id: meal.idMeal,
          title: meal.strMeal,
          image: meal.strMealThumb,
          category: meal.strCategory || 'Distante',
          area: meal.strArea || 'Internationale',
          instructions: meal.strInstructions || null,
          ingredients: this.extractIngredients(meal),
          isLocal: false
        }));
      } catch (error) {
        throw new Error('Impossible de contacter le service de recettes en ligne.');
      }
    },
    extractIngredients(meal) {
      const ingredients = [];
      for (let i = 1; i <= 20; i++) {
        const ing = meal[`strIngredient${i}`];
        if (ing && ing.trim()) ingredients.push(ing.trim());
      }
      return ingredients;
    }
  };

  const TranslationService = {
    async translateToFrench(text) {
      if (!text) return '';
      const chunk = text.slice(0, CONFIG.MAX_TRANSLATION_LENGTH);
      try {
        const url = `${CONFIG.API.MY_MEMORY_BASE_URL}?q=${encodeURIComponent(chunk)}&langpair=en|fr`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.responseData?.translatedText) {
          return data.responseData.translatedText + (text.length > CONFIG.MAX_TRANSLATION_LENGTH ? '...' : '');
        }
        return text;
      } catch (error) {
        return text;
      }
    }
  };

  const state = {
    recipes: [...LOCAL_RECIPES],
    activeFilter: 'all',
    searchQuery: '',
    isOnlineSearch: false,
    isLoading: false,
    error: null,
    favorites: StorageService.getFavorites(),
    listeners: [],

    subscribe(listener) { this.listeners.push(listener); },
    notify() { this.listeners.forEach(fn => fn(this)); },
    setRecipes(recipes, isOnline = false) { this.recipes = recipes; this.isOnlineSearch = isOnline; this.notify(); },
    setFilter(filter) { this.activeFilter = filter; this.notify(); },
    setLoading(loading) { this.isLoading = loading; this.notify(); },
    setError(msg) { this.error = msg; this.notify(); },
    toggleFavorite(id) { this.favorites = StorageService.toggleFavorite(id); this.notify(); },
    resetToLocal() { this.recipes = [...LOCAL_RECIPES]; this.isOnlineSearch = false; this.searchQuery = ''; this.error = null; this.notify(); },
    
    getFilteredRecipes() {
      if (this.isOnlineSearch) return this.recipes;
      return this.recipes.filter(recipe => {
        if (this.activeFilter === 'favorites') return this.favorites.includes(recipe.id);
        if (this.activeFilter === 'quick') return recipe.timeMinutes <= 10;
        if (this.activeFilter === 'cheap') return recipe.cost <= 1.50;
        if (this.activeFilter === 'healthy') return recipe.category === 'healthy';
        return true;
      });
    }
  };

  const grid = document.getElementById('recipe-grid');
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  const resetBtn = document.getElementById('reset-btn');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const modal = document.getElementById('recipe-modal');
  const modalBody = document.getElementById('modal-body');
  const closeModalBtn = document.getElementById('close-modal');

  function createRecipeCard(recipe) {
    const isFav = state.favorites.includes(recipe.id);
    const card = document.createElement('article');
    card.className = 'recipe-card';

    card.innerHTML = `
      <div class="card-header">
        <img src="${recipe.image}" alt="${recipe.title}" loading="lazy" />
        <button class="fav-btn ${isFav ? 'is-favorite' : ''}" data-id="${recipe.id}">
          ${isFav ? '★' : '☆'}
        </button>
      </div>
      <div class="card-body">
        <h3>${recipe.title}</h3>
        ${recipe.isLocal ? `
          <div class="tags">
            <span>⏱ ${recipe.timeMinutes} min</span>
            <span>💰 ~${recipe.cost.toFixed(2)} €</span>
            <span>📊 ${recipe.difficulty}</span>
          </div>
        ` : `
          <div class="tags">
            <span>🌍 ${recipe.area}</span>
            <span>🏷 ${recipe.category}</span>
          </div>
        `}
        <button class="btn btn-primary view-details-btn" data-id="${recipe.id}">Voir la recette</button>
      </div>
    `;

    card.querySelector('.fav-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      state.toggleFavorite(recipe.id);
    });

    return card;
  }

  function render(currentState) {
    grid.innerHTML = '';
    if (currentState.isLoading) {
      grid.innerHTML = '<div class="spinner">Chargement des recettes...</div>';
      return;
    }
    if (currentState.error) {
      grid.innerHTML = `<div class="error-banner">${currentState.error}</div>`;
      return;
    }

    const filtered = currentState.getFilteredRecipes();
    if (filtered.length === 0) {
      grid.innerHTML = '<p class="empty-msg">Aucune recette trouvée.</p>';
      return;
    }

    filtered.forEach(recipe => {
      const card = createRecipeCard(recipe);
      card.querySelector('.view-details-btn').addEventListener('click', () => openModal(recipe));
      grid.appendChild(card);
    });

    resetBtn.style.display = currentState.isOnlineSearch ? 'inline-block' : 'none';
  }

  state.subscribe(render);

  async function handleSearch() {
    const query = searchInput.value.trim();
    if (!query) return;
    state.setLoading(true);
    try {
      const results = await ApiService.searchRecipes(query);
      state.setRecipes(results, true);
    } catch (err) {
      state.setError(err.message);
    } finally {
      state.setLoading(false);
    }
  }

  async function openModal(recipe) {
    modalBody.innerHTML = `<h2>${recipe.title}</h2><p>Chargement...</p>`;
    modal.classList.add('active');

    let instructions = recipe.instructions;
    if (!recipe.isLocal && instructions) {
      instructions = await TranslationService.translateToFrench(instructions);
    }

    modalBody.innerHTML = `
      <h2>${recipe.title}</h2>
      <h3>Ingrédients :</h3>
      <ul>${recipe.ingredients.map(i => `<li>${i}</li>`).join('')}</ul>
      <h3>Préparation :</h3>
      <p>${instructions || 'Non disponible.'}</p>
    `;
  }

  searchBtn.addEventListener('click', handleSearch);
  searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSearch(); });
  resetBtn.addEventListener('click', () => { searchInput.value = ''; state.resetToLocal(); });
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.setFilter(btn.dataset.filter);
    });
  });

  closeModalBtn.addEventListener('click', () => modal.classList.remove('active'));

  state.notify();
});