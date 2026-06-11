const state = {
    recipe: {},
    search: {
        query: '',
        results: []
    }
};

const API_URL = 'https://forkify-api.herokuapp.com/api/v2/recipes';

const loadSearchResults = async function(query) {
    try {
        state.search.query = query;
        const res = await fetch(`${API_URL}?search=${query}`);
        const data = await res.json();
        
        if (!res.ok) throw new Error(`${data.message} (${res.status})`);

        state.search.results = data.data.recipes.map(rec => {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,
            };
        });
    } catch (err) {
        console.error("Error loading search results:", err);
        throw err;
    }
};

const loadRecipe = async function(id) {
    try {
        const res = await fetch(`${API_URL}/${id}`);
        const data = await res.json();
        
        if (!res.ok) throw new Error(`${data.message} (${res.status})`);

        const { recipe } = data.data;
        state.recipe = {
            id: recipe.id,
            title: recipe.title,
            publisher: recipe.publisher,
            image: recipe.image_url,
            cookingTime: recipe.cooking_time,
            servings: recipe.servings,
            ingredients: recipe.ingredients
        };
    } catch (err) {
        console.error("Error loading recipe:", err);
        throw err;
    }
};

const renderSearchResults = function(recipes) {
    const resultsContainer = document.querySelector('.results');
    resultsContainer.innerHTML = '';
    if(recipes.length === 0) {
        resultsContainer.innerHTML = '<li>No recipes found!</li>';
        return;
    }

    const markup = recipes.map(rec => `
        <li class="preview">
            <a class="preview__link" href="#${rec.id}">
                <figure class="preview__fig">
                    <img src="${rec.image}" alt="${rec.title}" style="width:50px; height:50px; border-radius:50%;">
                </figure>
                <div class="preview__data">
                    <h4 class="preview__title">${rec.title}</h4>
                    <p class="preview__publisher">${rec.publisher}</p>
                </div>
            </a>
        </li>
    `).join('');

    resultsContainer.insertAdjacentHTML('afterbegin', markup);
};

const renderRecipe = function(recipe) {
    const recipeContainer = document.querySelector('.recipe-display');
    recipeContainer.innerHTML = ''; 

    const markup = `
        <figure class="recipe__fig">
            <img src="${recipe.image}" alt="${recipe.title}" class="recipe__img" style="max-width: 100%; height: auto;">
        </figure>
        <div class="recipe__details">
            <h1 class="recipe__title">Title: ${recipe.title}</h1>
            <div class="recipe__info">
                <span class="recipe__info-text">Serving: ${recipe.servings || 'undefined'}</span>
            </div>
            <div class="recipe__info">
                <span class="recipe__info-text">Cooking Time: ${recipe.cookingTime} mins</span>
            </div>
        </div>
    `;
    recipeContainer.insertAdjacentHTML('afterbegin', markup);
};


document.querySelector('.search').addEventListener('submit', async function(e) {
    e.preventDefault();
    const query = document.querySelector('.search__field').value;
    if (!query) return;

    await loadSearchResults(query);
    renderSearchResults(state.search.results);
});

window.addEventListener('hashchange', async function() {
    const id = window.location.hash.slice(1); 

    await loadRecipe(id);
    renderRecipe(state.recipe);
});