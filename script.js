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
    const episodeHours = document.getElementById('episodeHours');
    const episodeMinutes = document.getElementById('episodeMinutes');
    const episodeSeconds = document.getElementById('episodeSeconds');
    const durationPreview = document.getElementById('durationPreview');
    const saveEpisodeBtn = document.getElementById('saveEpisodeBtn');
    const saveAnimeBtn = document.getElementById('saveAnimeBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const jsonOutput = document.getElementById('jsonOutput');
    const downloadBtn = document.getElementById('downloadBtn');
    const copyBtn = document.getElementById('copyBtn');
    const animeOpenings = document.getElementById('animeOpenings');
    const animeEndings = document.getElementById('animeEndings');
    const animeOsts = document.getElementById('animeOsts');

    //Adicione essas variáveis no início
    const musicTabs = document.querySelectorAll('.music-tab');
    const musicLists = document.querySelectorAll('.music-list');
    const addMusicBtns = document.querySelectorAll('.add-music-btn');
    const musicModal = document.getElementById('musicModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const musicForm = document.getElementById('musicForm');
    const modalTitle = document.getElementById('modalTitle');
    const musicTypeInput = document.getElementById('musicType');
    const musicIndexInput = document.getElementById('musicIndex');
    const musicTitleInput = document.getElementById('musicTitle');
    const musicArtistInput = document.getElementById('musicArtist');
    const musicAudioInput = document.getElementById('musicAudio');
    const musicCoverInput = document.getElementById('musicCover');
    const openingsList = document.getElementById('openingsList');
    const endingsList = document.getElementById('endingsList');
    const ostsList = document.getElementById('ostsList');
    
    // Dados do aplicativo
    let animeData = [];
    let currentAnimeIndex = -1;
    let currentSeasonIndex = -1;
    let currentEpisodeIndex = -1;
    let categories = [];
    let tempSeasons = null;

    // Adicione esses event listeners
    musicTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const type = tab.dataset.type;
            
            // Ativar tab
            musicTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Mostrar conteúdo correspondente
            musicLists.forEach(list => {
                list.classList.remove('active');
                if (list.dataset.type === type) {
                    list.classList.add('active');
                }
            });
        });
    });

    addMusicBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.type;
            openMusicModal(type);
        });
    });

    closeModalBtn.addEventListener('click', closeModal);
    musicForm.addEventListener('submit', saveMusic);
    
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
                const parsedData = JSON.parse(e.target.result);
                if (!Array.isArray(parsedData)) {
                    throw new Error("O arquivo JSON deve conter um array de animes");
                }
                
                animeData = parsedData;
                updateAnimeList();
                updateJsonOutput();
                alert('Arquivo carregado com sucesso!');
            } catch (error) {
                alert('Erro ao analisar o arquivo JSON: ' + error.message);
                console.error(error);
            }
        };
        reader.onerror = function() {
            alert('Erro ao ler o arquivo.');
        };
        reader.readAsText(file);
    });

    // Adicione essas funções
    function openMusicModal(type, index = -1) {
        musicTypeInput.value = type;
        musicIndexInput.value = index;
        
        // Definir título do modal
        const typeNames = {
            openings: 'Opening',
            endings: 'Ending',
            osts: 'OST'
        };
        modalTitle.textContent = index === -1 ? `Adicionar ${typeNames[type]}` : `Editar ${typeNames[type]}`;
        
        // Preencher formulário se estiver editando
        if (index !== -1 && currentAnimeIndex !== -1) {
            const musicItem = animeData[currentAnimeIndex][type][index];
            musicTitleInput.value = musicItem.title || '';
            musicArtistInput.value = musicItem.artist || '';
            musicAudioInput.value = musicItem.audio || '';
            musicCoverInput.value = musicItem.cover || '';
        } else {
            musicForm.reset();
        }
        
        musicModal.style.display = 'block';
    }

    function closeModal() {
        musicModal.style.display = 'none';
    }

    function saveMusic(e) {
        e.preventDefault();
        
        const type = musicTypeInput.value;
        const index = parseInt(musicIndexInput.value);
        const musicData = {
            title: musicTitleInput.value.trim(),
            artist: musicArtistInput.value.trim(),
            audio: musicAudioInput.value.trim(),
            cover: musicCoverInput.value.trim()
        };
        
        if (currentAnimeIndex !== -1) {
            if (!animeData[currentAnimeIndex][type]) {
                animeData[currentAnimeIndex][type] = [];
            }
            
            if (index === -1) {
                // Adicionar novo
                animeData[currentAnimeIndex][type].push(musicData);
            } else {
                // Editar existente
                animeData[currentAnimeIndex][type][index] = musicData;
            }
            
            updateMusicLists();
            updateJsonOutput();
            closeModal();
        }
    }

    function updateMusicLists() {
        if (currentAnimeIndex === -1) return;
        
        const anime = animeData[currentAnimeIndex];
        
        // Openings
        openingsList.innerHTML = '';
        if (anime.openings && anime.openings.length > 0) {
            anime.openings.forEach((opening, index) => {
                openingsList.appendChild(createMusicItem('openings', opening, index));
            });
        } else {
            openingsList.innerHTML = '<p class="no-music">Nenhum opening adicionado</p>';
        }
        
        // Endings
        endingsList.innerHTML = '';
        if (anime.endings && anime.endings.length > 0) {
            anime.endings.forEach((ending, index) => {
                endingsList.appendChild(createMusicItem('endings', ending, index));
            });
        } else {
            endingsList.innerHTML = '<p class="no-music">Nenhum ending adicionado</p>';
        }
        
        // OSTs
        ostsList.innerHTML = '';
        if (anime.osts && anime.osts.length > 0) {
            anime.osts.forEach((ost, index) => {
                ostsList.appendChild(createMusicItem('osts', ost, index));
            });
        } else {
            ostsList.innerHTML = '<p class="no-music">Nenhuma OST adicionada</p>';
        }
    }

    function createMusicItem(type, music, index) {
        const item = document.createElement('div');
        item.className = 'music-item';
        
        item.innerHTML = `
            <div class="music-item-info">
                <div class="music-item-title">${music.title}</div>
                <div class="music-item-artist">${music.artist}</div>
            </div>
            <div class="music-item-actions">
                <button type="button" class="edit-music" data-type="${type}" data-index="${index}">Editar</button>
                <button type="button" class="remove-music" data-type="${type}" data-index="${index}">Remover</button>
            </div>
        `;
        
        return item;
    }
    
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
        
        // Adicionar uma temporada e episódio padrão ao novo anime
        tempSeasons = [{
            number: 1,
            episodes: [{
                title: "Episódio 1",
                videoUrl: "",
                duration: 0
            }]
        }];
        
        // Atualizar a lista de temporadas
        updateSeasonList();
        seasonSelect.selectedIndex = 0;
        seasonSelect.dispatchEvent(new Event('change'));
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
        if (currentAnimeIndex < 0 && !tempSeasons) return;
        
        const seasons = currentAnimeIndex >= 0 ? 
            animeData[currentAnimeIndex].seasons : 
            tempSeasons;
        
        const newSeasonNumber = seasons.length > 0 ? 
            Math.max(...seasons.map(s => s.number)) + 1 : 1;
        
        seasons.push({
            number: newSeasonNumber,
            episodes: [{
                title: `Episódio 1`,
                videoUrl: "",
                duration: 0
            }]
        });
        
        updateSeasonList();
        seasonSelect.selectedIndex = seasons.length - 1;
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
        if ((currentAnimeIndex >= 0 || tempSeasons) && currentSeasonIndex >= 0 && 
            confirm('Tem certeza que deseja remover esta temporada?')) {
            
            if (currentAnimeIndex >= 0) {
                animeData[currentAnimeIndex].seasons.splice(currentSeasonIndex, 1);
            } else {
                tempSeasons.splice(currentSeasonIndex, 1);
            }
            
            updateSeasonList();
            updateEpisodeList();
            updateJsonOutput();
            currentSeasonIndex = -1;
        }
    });
    
    // Adicionar episódio
    addEpisodeBtn.addEventListener('click', function() {
        if ((currentAnimeIndex < 0 && !tempSeasons) || currentSeasonIndex < 0) return;
        
        const seasons = currentAnimeIndex >= 0 ? 
            animeData[currentAnimeIndex].seasons : 
            tempSeasons;
        
        const episodes = seasons[currentSeasonIndex].episodes;
        const newEpisodeNumber = episodes.length + 1;
        
        episodes.push({
            title: `Episódio ${newEpisodeNumber}`,
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
        if (((currentAnimeIndex >= 0 || tempSeasons) && currentSeasonIndex >= 0 && currentEpisodeIndex >= 0)) {
            const seasons = currentAnimeIndex >= 0 ? 
                animeData[currentAnimeIndex].seasons : 
                tempSeasons;
            const episode = seasons[currentSeasonIndex].episodes[currentEpisodeIndex];
            episodeTitle.value = episode.title;
            episodeVideoUrl.value = episode.videoUrl;
            
            // Converter segundos para H:M:S
            const totalSeconds = episode.duration || 0;
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            
            episodeHours.value = hours;
            episodeMinutes.value = minutes;
            episodeSeconds.value = seconds;
            
            // Atualizar preview
            updateDurationPreview(totalSeconds);
        } else {
            episodeTitle.value = '';
            episodeVideoUrl.value = '';
            episodeHours.value = '';
            episodeMinutes.value = '';
            episodeSeconds.value = '';
            durationPreview.textContent = '';
        }
    });
    
    // Remover episódio
    removeEpisodeBtn.addEventListener('click', function() {
        if ((currentAnimeIndex >= 0 || tempSeasons) && currentSeasonIndex >= 0 && currentEpisodeIndex >= 0 && 
            confirm('Tem certeza que deseja remover este episódio?')) {
            
            const seasons = currentAnimeIndex >= 0 ? 
                animeData[currentAnimeIndex].seasons : 
                tempSeasons;
            
            seasons[currentSeasonIndex].episodes.splice(currentEpisodeIndex, 1);
            updateEpisodeList();
            updateJsonOutput();
            currentEpisodeIndex = -1;
        }
    });
    
    // Salvar episódio
    saveEpisodeBtn.addEventListener('click', function() {
        if ((currentAnimeIndex >= 0 || tempSeasons) && currentSeasonIndex >= 0 && currentEpisodeIndex >= 0) {
            const seasons = currentAnimeIndex >= 0 ? 
                animeData[currentAnimeIndex].seasons : 
                tempSeasons;
                
            const episode = seasons[currentSeasonIndex].episodes[currentEpisodeIndex];
            episode.title = episodeTitle.value;
            episode.videoUrl = episodeVideoUrl.value;
            
            // Converter H:M:S para segundos
            const hours = parseInt(episodeHours.value) || 0;
            const minutes = parseInt(episodeMinutes.value) || 0;
            const seconds = parseInt(episodeSeconds.value) || 0;
            episode.duration = (hours * 3600) + (minutes * 60) + seconds;
            
            // Atualizar preview
            updateDurationPreview(episode.duration);
            
            updateEpisodeList();
            updateJsonOutput();
        }
    });
    
    // Salvar anime
    saveAnimeBtn.addEventListener('click', function() {
        // Validar campos obrigatórios
        const requiredFields = [
            animeId, animeTitle, animeDescription, 
            animeThumbnail, animeTrailer, animeType,
            animeDateAdded, animeYear, animeRating
        ];
        
        let isValid = true;
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = 'red';
                isValid = false;
            } else {
                field.style.borderColor = '';
            }
        });
        
        if (!isValid) {
            alert('Por favor, preencha todos os campos obrigatórios destacados em vermelho.');
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
            seasons: currentAnimeIndex >= 0 ? 
                animeData[currentAnimeIndex].seasons || [] : 
                tempSeasons || [],
            year: parseInt(animeYear.value),
            rating: parseFloat(animeRating.value),
            openings: currentAnimeIndex >= 0 && animeData[currentAnimeIndex].openings ? 
                animeData[currentAnimeIndex].openings : [],
            endings: currentAnimeIndex >= 0 && animeData[currentAnimeIndex].endings ? 
                animeData[currentAnimeIndex].endings : [],
            osts: currentAnimeIndex >= 0 && animeData[currentAnimeIndex].osts ? 
                animeData[currentAnimeIndex].osts : [],
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
        tempSeasons = null;
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
        // Resetar índices
        currentSeasonIndex = -1;
        currentEpisodeIndex = -1;
        
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
        
        // Carregar os novos campos de música
        animeOpenings.value = anime.openings ? anime.openings.join(', ') : '';
        animeEndings.value = anime.endings ? anime.endings.join(', ') : '';
        animeOsts.value = anime.osts ? anime.osts.join(', ') : '';
        
        categories = [...anime.categories];
        updateCategoriesList();
        
        // Atualizar listas de temporadas e episódios
        updateSeasonList();
        updateEpisodeList();
        
        // Resetar campos de episódio
        episodeTitle.value = '';
        episodeVideoUrl.value = '';
        episodeHours.value = '';
        episodeMinutes.value = '';
        episodeSeconds.value = '';

        // Atualizar listas de música
        updateMusicLists();
        durationPreview.textContent = '';
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
        const seasons = currentAnimeIndex >= 0 ? 
            (animeData[currentAnimeIndex].seasons || []) : 
            (tempSeasons || []);
            
        seasons.forEach(season => {
            const option = document.createElement('option');
            option.textContent = `Temporada ${season.number} (${season.episodes.length} episódios)`;
            seasonSelect.appendChild(option);
        });
        
        // Selecionar primeira temporada se houver
        if (seasons.length > 0) {
            currentSeasonIndex = 0;
            seasonSelect.selectedIndex = 0;
            seasonSelect.dispatchEvent(new Event('change'));
        } else {
            currentSeasonIndex = -1;
            updateEpisodeList(); // Atualizar lista de episódios vazia
        }
    }
    
    function updateEpisodeList() {
        episodeSelect.innerHTML = '';
        if ((currentAnimeIndex >= 0 || tempSeasons) && currentSeasonIndex >= 0) {
            const seasons = currentAnimeIndex >= 0 ? 
                animeData[currentAnimeIndex].seasons : 
                tempSeasons;
            const episodes = seasons[currentSeasonIndex].episodes || [];
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
    
    function updateDurationPreview(totalSeconds) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        durationPreview.textContent = `Duração total: ${totalSeconds} segundos (${hours}h ${minutes}m ${seconds}s)`;
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
        tempSeasons = null;
        durationPreview.textContent = '';
        animeOpenings.value = '';
        animeEndings.value = '';
        animeOsts.value = '';

        // Limpar listas de música
        openingsList.innerHTML = '<p class="no-music">Nenhum opening adicionado</p>';
        endingsList.innerHTML = '<p class="no-music">Nenhum ending adicionado</p>';
        ostsList.innerHTML = '<p class="no-music">Nenhuma OST adicionada</p>';
        // Remover destacados de erro
        document.querySelectorAll('input, textarea, select').forEach(el => {
            el.style.borderColor = '';
        });
    }
    
    // Inicialização
    resetForm();
    updateJsonOutput();
});

// Adicione este event listener para delegar eventos de edição/remoção
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('edit-music')) {
        const type = e.target.dataset.type;
        const index = parseInt(e.target.dataset.index);
        openMusicModal(type, index);
    }

    if (e.target.classList.contains('remove-music')) {
        if (confirm('Tem certeza que deseja remover esta música?')) {
            const type = e.target.dataset.type;
            const index = parseInt(e.target.dataset.index);
            
            if (currentAnimeIndex !== -1) {
                animeData[currentAnimeIndex][type].splice(index, 1);
                updateMusicLists();
                updateJsonOutput();
            }
        }
    }
});
