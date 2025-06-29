document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const jsonFileInput = document.getElementById('jsonFile');
    const loadBtn = document.getElementById('loadBtn');
    const animeSelect = document.getElementById('animeSelect');
    const addAnimeBtn = document.getElementById('addAnimeBtn');
    const removeAnimeBtn = document.getElementById('removeAnimeBtn');
    const animeForm = document.getElementById('animeForm');
    const animeId = document.getElementById('animeId');
    const animeTitle = document.getElementById('animeTitle');
    const animeDescription = document.getElementById('animeDescription');
    const animeThumbnail = document.getElementById('animeThumbnail');
    const animeTrailer = document.getElementById('animeTrailer');
    const animeType = document.getElementById('animeType');
    const animeDateAdded = document.getElementById('animeDateAdded');
    const categorySelect = document.getElementById('categorySelect');
    const newCategory = document.getElementById('newCategory');
    const addCategoryBtn = document.getElementById('addCategoryBtn');
    const categoriesList = document.getElementById('categoriesList');
    const animeYear = document.getElementById('animeYear');
    const animeRating = document.getElementById('animeRating');
    const seasonSelect = document.getElementById('seasonSelect');
    const addSeasonBtn = document.getElementById('addSeasonBtn');
    const removeSeasonBtn = document.getElementById('removeSeasonBtn');
    const episodeSelect = document.getElementById('episodeSelect');
    const addEpisodeBtn = document.getElementById('addEpisodeBtn');
    const removeEpisodeBtn = document.getElementById('removeEpisodeBtn');
    const episodeTitle = document.getElementById('episodeTitle');
    const episodeVideoUrl = document.getElementById('episodeVideoUrl');
    const episodeDuration = document.getElementById('episodeDuration');
    const saveEpisodeBtn = document.getElementById('saveEpisodeBtn');
    const saveAnimeBtn = document.getElementById('saveAnimeBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const jsonOutput = document.getElementById('jsonOutput');
    const downloadBtn = document.getElementById('downloadBtn');
    const copyBtn = document.getElementById('copyBtn');
    
    // Dados do aplicativo
    let animeData = [];
    let currentAnimeIndex = -1;
    let currentSeasonIndex = -1;
    let currentEpisodeIndex = -1;
    let categories = [];
    
    // Carregar arquivo JSON
    loadBtn.addEventListener('click', function() {
        const file = jsonFileInput.files[0];
        if (!file) {
            alert('Por favor, selecione um arquivo JSON.');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                animeData = JSON.parse(e.target.result);
                updateAnimeList();
                updateJsonOutput();
                alert('Arquivo carregado com sucesso!');
            } catch (error) {
                alert('Erro ao analisar o arquivo JSON: ' + error.message);
            }
        };
        reader.readAsText(file);
    });
    
    // Adicionar novo anime
    addAnimeBtn.addEventListener('click', function() {
        resetForm();
        currentAnimeIndex = -1;
        
        // Gerar novo ID
        const newId = animeData.length > 0 ? Math.max(...animeData.map(a => a.id)) + 1 : 1;
        animeId.value = newId;
        
        // Definir data atual como padrão
        const today = new Date().toISOString().split('T')[0];
        animeDateAdded.value = today;
    });
    
    // Selecionar anime
    animeSelect.addEventListener('change', function() {
        currentAnimeIndex = animeSelect.selectedIndex;
        if (currentAnimeIndex >= 0) {
            loadAnimeData(currentAnimeIndex);
        }
    });
    
    // Remover anime
    removeAnimeBtn.addEventListener('click', function() {
        if (currentAnimeIndex >= 0 && confirm('Tem certeza que deseja remover este anime?')) {
            animeData.splice(currentAnimeIndex, 1);
            updateAnimeList();
            updateJsonOutput();
            resetForm();
            currentAnimeIndex = -1;
        }
    });
    
    // Adicionar categoria
    addCategoryBtn.addEventListener('click', function() {
        let category = newCategory.value.trim();
        if (!category) {
            category = categorySelect.value;
        }
        
        if (category && !categories.includes(category)) {
            categories.push(category);
            updateCategoriesList();
            newCategory.value = '';
        }
    });
    
    // Adicionar temporada
    addSeasonBtn.addEventListener('click', function() {
        if (currentAnimeIndex < 0) return;
        
        const anime = animeData[currentAnimeIndex];
        if (!anime.seasons) {
            anime.seasons = [];
        }
        
        const newSeasonNumber = anime.seasons.length > 0 ? 
            Math.max(...anime.seasons.map(s => s.number)) + 1 : 1;
        
        anime.seasons.push({
            number: newSeasonNumber,
            episodes: []
        });
        
        updateSeasonList();
        seasonSelect.selectedIndex = anime.seasons.length - 1;
        seasonSelect.dispatchEvent(new Event('change'));
        updateJsonOutput();
    });
    
    // Selecionar temporada
    seasonSelect.addEventListener('change', function() {
        currentSeasonIndex = seasonSelect.selectedIndex;
        updateEpisodeList();
    });
    
    // Remover temporada
    removeSeasonBtn.addEventListener('click', function() {
        if (currentAnimeIndex >= 0 && currentSeasonIndex >= 0 && 
            confirm('Tem certeza que deseja remover esta temporada?')) {
            
            animeData[currentAnimeIndex].seasons.splice(currentSeasonIndex, 1);
            updateSeasonList();
            updateEpisodeList();
            updateJsonOutput();
            currentSeasonIndex = -1;
        }
    });
    
    // Adicionar episódio
    addEpisodeBtn.addEventListener('click', function() {
        if (currentAnimeIndex < 0 || currentSeasonIndex < 0) return;
        
        const episodes = animeData[currentAnimeIndex].seasons[currentSeasonIndex].episodes;
        episodes.push({
            title: 'Novo Episódio',
            videoUrl: '',
            duration: 0
        });
        
        updateEpisodeList();
        episodeSelect.selectedIndex = episodes.length - 1;
        episodeSelect.dispatchEvent(new Event('change'));
        updateJsonOutput();
    });
    
    // Selecionar episódio
    episodeSelect.addEventListener('change', function() {
        currentEpisodeIndex = episodeSelect.selectedIndex;
        if (currentAnimeIndex >= 0 && currentSeasonIndex >= 0 && currentEpisodeIndex >= 0) {
            const episode = animeData[currentAnimeIndex].seasons[currentSeasonIndex].episodes[currentEpisodeIndex];
            episodeTitle.value = episode.title;
            episodeVideoUrl.value = episode.videoUrl;
            episodeDuration.value = episode.duration;
        } else {
            episodeTitle.value = '';
            episodeVideoUrl.value = '';
            episodeDuration.value = '';
        }
    });
    
    // Remover episódio
    removeEpisodeBtn.addEventListener('click', function() {
        if (currentAnimeIndex >= 0 && currentSeasonIndex >= 0 && currentEpisodeIndex >= 0 && 
            confirm('Tem certeza que deseja remover este episódio?')) {
            
            animeData[currentAnimeIndex].seasons[currentSeasonIndex].episodes.splice(currentEpisodeIndex, 1);
            updateEpisodeList();
            updateJsonOutput();
            currentEpisodeIndex = -1;
        }
    });
    
    // Salvar episódio
    saveEpisodeBtn.addEventListener('click', function() {
        if (currentAnimeIndex >= 0 && currentSeasonIndex >= 0 && currentEpisodeIndex >= 0) {
            const episode = animeData[currentAnimeIndex].seasons[currentSeasonIndex].episodes[currentEpisodeIndex];
            episode.title = episodeTitle.value;
            episode.videoUrl = episodeVideoUrl.value;
            episode.duration = parseInt(episodeDuration.value);
            
            updateEpisodeList();
            updateJsonOutput();
        }
    });
    
    // Salvar anime
    saveAnimeBtn.addEventListener('click', function() {
        if (!animeForm.checkValidity()) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        
        const anime = {
            id: parseInt(animeId.value),
            title: animeTitle.value,
            description: animeDescription.value,
            thumbnail: animeThumbnail.value,
            trailer: animeTrailer.value,
            type: animeType.value,
            dateAdded: animeDateAdded.value,
            categories: [...categories],
            seasons: currentAnimeIndex >= 0 ? animeData[currentAnimeIndex].seasons || [] : [],
            year: parseInt(animeYear.value),
            rating: parseFloat(animeRating.value)
        };
        
        if (currentAnimeIndex >= 0) {
            // Atualizar anime existente
            animeData[currentAnimeIndex] = anime;
        } else {
            // Adicionar novo anime
            animeData.push(anime);
            currentAnimeIndex = animeData.length - 1;
        }
        
        updateAnimeList();
        updateJsonOutput();
    });
    
    // Cancelar edição
    cancelBtn.addEventListener('click', function() {
        resetForm();
    });
    
    // Download JSON
    downloadBtn.addEventListener('click', function() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(animeData, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "anime-data.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    });
    
    // Copiar JSON
    copyBtn.addEventListener('click', function() {
        navigator.clipboard.writeText(JSON.stringify(animeData, null, 2))
            .then(() => alert('JSON copiado para a área de transferência!'))
            .catch(err => alert('Erro ao copiar: ' + err));
    });
    
    // Funções auxiliares
    function updateAnimeList() {
        animeSelect.innerHTML = '';
        animeData.forEach(anime => {
            const option = document.createElement('option');
            option.textContent = `${anime.title} (${anime.year}) - ${anime.type.toUpperCase()}`;
            animeSelect.appendChild(option);
        });
        
        if (currentAnimeIndex >= 0 && currentAnimeIndex < animeSelect.options.length) {
            animeSelect.selectedIndex = currentAnimeIndex;
        }
    }
    
    function loadAnimeData(index) {
        const anime = animeData[index];
        animeId.value = anime.id;
        animeTitle.value = anime.title;
        animeDescription.value = anime.description;
        animeThumbnail.value = anime.thumbnail;
        animeTrailer.value = anime.trailer;
        animeType.value = anime.type;
        animeDateAdded.value = anime.dateAdded;
        animeYear.value = anime.year;
        animeRating.value = anime.rating;
        
        categories = [...anime.categories];
        updateCategoriesList();
        
        updateSeasonList();
    }
    
    function updateCategoriesList() {
        categoriesList.innerHTML = '';
        categories.forEach((category, index) => {
            const tag = document.createElement('div');
            tag.className = 'category-tag';
            tag.innerHTML = `
                ${category}
                <button type="button" class="remove-category" data-index="${index}">×</button>
            `;
            categoriesList.appendChild(tag);
        });
        
        // Adicionar eventos de clique para remover categorias
        document.querySelectorAll('.remove-category').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                categories.splice(index, 1);
                updateCategoriesList();
                updateJsonOutput();
            });
        });
    }
    
    function updateSeasonList() {
        seasonSelect.innerHTML = '';
        if (currentAnimeIndex >= 0) {
            const seasons = animeData[currentAnimeIndex].seasons || [];
            seasons.forEach(season => {
                const option = document.createElement('option');
                option.textContent = `Temporada ${season.number} (${season.episodes.length} episódios)`;
                seasonSelect.appendChild(option);
            });
            
            if (currentSeasonIndex >= 0 && currentSeasonIndex < seasonSelect.options.length) {
                seasonSelect.selectedIndex = currentSeasonIndex;
            }
        }
    }
    
    function updateEpisodeList() {
        episodeSelect.innerHTML = '';
        if (currentAnimeIndex >= 0 && currentSeasonIndex >= 0) {
            const episodes = animeData[currentAnimeIndex].seasons[currentSeasonIndex].episodes || [];
            episodes.forEach(episode => {
                const option = document.createElement('option');
                option.textContent = episode.title;
                episodeSelect.appendChild(option);
            });
            
            if (currentEpisodeIndex >= 0 && currentEpisodeIndex < episodeSelect.options.length) {
                episodeSelect.selectedIndex = currentEpisodeIndex;
            }
        }
    }
    
    function updateJsonOutput() {
        jsonOutput.textContent = JSON.stringify(animeData, null, 2);
    }
    
    function resetForm() {
        animeForm.reset();
        categories = [];
        updateCategoriesList();
        seasonSelect.innerHTML = '';
        episodeSelect.innerHTML = '';
        currentAnimeIndex = -1;
        currentSeasonIndex = -1;
        currentEpisodeIndex = -1;
    }
    
    // Inicialização
    resetForm();
    updateJsonOutput();
});
