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
    
    // Elementos para músicas
    const openingsList = document.getElementById('openingsList');
    const endingsList = document.getElementById('endingsList');
    const ostsList = document.getElementById('ostsList');
    const addOpeningBtn = document.getElementById('addOpeningBtn');
    const addEndingBtn = document.getElementById('addEndingBtn');
    const addOstBtn = document.getElementById('addOstBtn');
    
    // Elementos do modal de música
    const musicModal = document.getElementById('musicModal');
    const musicModalTitle = document.getElementById('musicModalTitle');
    const musicForm = document.getElementById('musicForm');
    const musicType = document.getElementById('musicType');
    const musicIndex = document.getElementById('musicIndex');
    const musicTitle = document.getElementById('musicTitle');
    const musicArtist = document.getElementById('musicArtist');
    const musicAudio = document.getElementById('musicAudio');
    const musicCover = document.getElementById('musicCover');
    const musicSeason = document.getElementById('musicSeason');
    const saveMusicBtn = document.getElementById('saveMusicBtn');
    const cancelMusicBtn = document.getElementById('cancelMusicBtn');
    const closeModal = document.querySelector('.close');
    
    // Elementos do modal de faixa
    const trackModal = document.getElementById('trackModal');
    const trackForm = document.getElementById('trackForm');
    const trackIndex = document.getElementById('trackIndex');
    const trackTitle = document.getElementById('trackTitle');
    const trackArtist = document.getElementById('trackArtist');
    const trackAudio = document.getElementById('trackAudio');
    const trackDuration = document.getElementById('trackDuration');
    const saveTrackBtn = document.getElementById('saveTrackBtn');
    const cancelTrackBtn = document.getElementById('cancelTrackBtn');
    const closeTrackModal = trackModal.querySelector('.close');
    
    // Elementos específicos de OST
    const ostYearField = document.getElementById('ostYearField');
    const ostYear = document.getElementById('ostYear');
    const ostTracksField = document.getElementById('ostTracksField');
    const tracksList = document.getElementById('tracksList');
    const addTrackBtn = document.getElementById('addTrackBtn');
    
    // Dados do aplicativo
    let animeData = [];
    let currentAnimeIndex = -1;
    let currentSeasonIndex = -1;
    let currentEpisodeIndex = -1;
    let categories = [];
    let tempSeasons = null;
    let currentTracks = [];
    
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
    
    // Adicionar opening
    addOpeningBtn.addEventListener('click', function() {
        if (currentAnimeIndex < 0) return;
        
        musicType.value = 'opening';
        musicIndex.value = '';
        musicModalTitle.textContent = 'Adicionar Opening';
        
        // Mostrar campos relevantes
        document.getElementById('seasonField').style.display = 'block';
        document.getElementById('ostYearField').style.display = 'none';
        document.getElementById('ostTracksField').style.display = 'none';
        
        // Resetar formulário
        musicForm.reset();
        
        // Abrir modal
        musicModal.style.display = 'block';
    });
    
    // Adicionar ending
    addEndingBtn.addEventListener('click', function() {
        if (currentAnimeIndex < 0) return;
        
        musicType.value = 'ending';
        musicIndex.value = '';
        musicModalTitle.textContent = 'Adicionar Ending';
        
        // Mostrar campos relevantes
        document.getElementById('seasonField').style.display = 'block';
        document.getElementById('ostYearField').style.display = 'none';
        document.getElementById('ostTracksField').style.display = 'none';
        
        // Resetar formulário
        musicForm.reset();
        
        // Abrir modal
        musicModal.style.display = 'block';
    });
    
    // Adicionar OST
    addOstBtn.addEventListener('click', function() {
        if (currentAnimeIndex < 0) return;
        
        musicType.value = 'ost';
        musicIndex.value = '';
        musicModalTitle.textContent = 'Adicionar OST';
        
        // Mostrar campos relevantes
        document.getElementById('seasonField').style.display = 'none';
        document.getElementById('ostYearField').style.display = 'block';
        document.getElementById('ostTracksField').style.display = 'block';
        
        // Resetar formulário e limpar faixas
        musicForm.reset();
        currentTracks = [];
        updateTracksList();
        
        // Abrir modal
        musicModal.style.display = 'block';
    });
    
    // Adicionar faixa à OST
    addTrackBtn.addEventListener('click', function() {
        trackIndex.value = '';
        trackForm.reset();
        trackModal.style.display = 'block';
    });
    
    // Salvar música
    saveMusicBtn.addEventListener('click', function() {
        const type = musicType.value;
        const index = musicIndex.value;
        
        if (!musicTitle.value || !musicArtist.value || !musicAudio.value) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        
        const anime = animeData[currentAnimeIndex];
        
        if (type === 'ost') {
            if (!ostYear.value) {
                alert('Por favor, informe o ano da OST.');
                return;
            }
            
            const ostData = {
                title: musicTitle.value,
                year: parseInt(ostYear.value),
                cover: musicCover.value || '',
                tracks: [...currentTracks]
            };
            
            if (index === '') {
                // Adicionar nova OST
                if (!anime.osts) anime.osts = {};
                const ostKey = musicTitle.value;
                anime.osts[ostKey] = ostData;
            } else {
                // Editar OST existente
                const ostKeys = Object.keys(anime.osts || {});
                const oldKey = ostKeys[index];
                delete anime.osts[oldKey];
                anime.osts[musicTitle.value] = ostData;
            }
        } else {
            const musicData = {
                title: musicTitle.value,
                artist: musicArtist.value,
                audio: musicAudio.value,
                cover: musicCover.value || '',
                type: type,
                season: parseInt(musicSeason.value) || 1
            };
            
            if (index === '') {
                // Adicionar nova música
                if (!anime[type + 's']) anime[type + 's'] = [];
                anime[type + 's'].push(musicData);
            } else {
                // Editar música existente
                anime[type + 's'][index] = musicData;
            }
        }
        
        updateMusicLists();
        updateJsonOutput();
        musicModal.style.display = 'none';
    });
    
    // Salvar faixa
    saveTrackBtn.addEventListener('click', function() {
        if (!trackTitle.value || !trackAudio.value || !trackDuration.value) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        
        const trackData = {
            title: trackTitle.value,
            artist: trackArtist.value || '',
            audio: trackAudio.value,
            duration: parseInt(trackDuration.value)
        };
        
        const index = trackIndex.value;
        if (index === '') {
            // Adicionar nova faixa
            currentTracks.push(trackData);
        } else {
            // Editar faixa existente
            currentTracks[index] = trackData;
        }
        
        updateTracksList();
        trackModal.style.display = 'none';
    });
    
    // Fechar modais
    closeModal.addEventListener('click', function() {
        musicModal.style.display = 'none';
    });
    
    closeTrackModal.addEventListener('click', function() {
        trackModal.style.display = 'none';
    });
    
    cancelMusicBtn.addEventListener('click', function() {
        musicModal.style.display = 'none';
    });
    
    cancelTrackBtn.addEventListener('click', function() {
        trackModal.style.display = 'none';
    });
    
    // Fechar modais ao clicar fora
    window.addEventListener('click', function(event) {
        if (event.target === musicModal) {
            musicModal.style.display = 'none';
        }
        if (event.target === trackModal) {
            trackModal.style.display = 'none';
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
            rating: parseFloat(animeRating.value)
        };
        
        // Preservar openings, endings e osts se estiver editando
        if (currentAnimeIndex >= 0) {
            const existingAnime = animeData[currentAnimeIndex];
            anime.openings = existingAnime.openings || [];
            anime.endings = existingAnime.endings || [];
            anime.osts = existingAnime.osts || {};
        } else {
            anime.openings = [];
            anime.endings = [];
            anime.osts = {};
        }
        
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
        
        categories = [...anime.categories || []];
        updateCategoriesList();
        
        // Atualizar listas de temporadas e episódios
        updateSeasonList();
        updateEpisodeList();
        
        // Atualizar listas de músicas
        updateMusicLists();
        
        // Resetar campos de episódio
        episodeTitle.value = '';
        episodeVideoUrl.value = '';
        episodeHours.value = '';
        episodeMinutes.value = '';
        episodeSeconds.value = '';
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
    
    function updateMusicLists() {
        if (currentAnimeIndex < 0) return;
        
        const anime = animeData[currentAnimeIndex];
        
        // Openings
        openingsList.innerHTML = '';
        (anime.openings || []).forEach((opening, index) => {
            const item = document.createElement('div');
            item.className = 'music-item';
            item.innerHTML = `
                <h6>${opening.title}</h6>
                <p>Artista: ${opening.artist} | Temporada: ${opening.season}</p>
                <div class="music-actions">
                    <button class="edit" data-type="opening" data-index="${index}">Editar</button>
                    <button class="delete" data-type="opening" data-index="${index}">Remover</button>
                </div>
            `;
            openingsList.appendChild(item);
        });
        
        // Endings
        endingsList.innerHTML = '';
        (anime.endings || []).forEach((ending, index) => {
            const item = document.createElement('div');
            item.className = 'music-item';
            item.innerHTML = `
                <h6>${ending.title}</h6>
                <p>Artista: ${ending.artist} | Temporada: ${ending.season}</p>
                <div class="music-actions">
                    <button class="edit" data-type="ending" data-index="${index}">Editar</button>
                    <button class="delete" data-type="ending" data-index="${index}">Remover</button>
                </div>
            `;
            endingsList.appendChild(item);
        });
        
        // OSTs
        ostsList.innerHTML = '';
        Object.entries(anime.osts || {}).forEach(([ostTitle, ostData], index) => {
            const item = document.createElement('div');
            item.className = 'music-item';
            item.innerHTML = `
                <h6>${ostTitle}</h6>
                <p>Ano: ${ostData.year} | Faixas: ${ostData.tracks?.length || 0}</p>
                <div class="music-actions">
                    <button class="edit" data-type="ost" data-index="${index}">Editar</button>
                    <button class="delete" data-type="ost" data-index="${index}">Remover</button>
                </div>
            `;
            ostsList.appendChild(item);
        });
        
        // Adicionar eventos para editar/remover músicas
        document.querySelectorAll('.music-actions .edit').forEach(btn => {
            btn.addEventListener('click', function() {
                const type = this.getAttribute('data-type');
                const index = parseInt(this.getAttribute('data-index'));
                editMusic(type, index);
            });
        });
        
        document.querySelectorAll('.music-actions .delete').forEach(btn => {
            btn.addEventListener('click', function() {
                const type = this.getAttribute('data-type');
                const index = parseInt(this.getAttribute('data-index'));
                deleteMusic(type, index);
            });
        });
    }
    
    function updateTracksList() {
        tracksList.innerHTML = '';
        currentTracks.forEach((track, index) => {
            const item = document.createElement('div');
            item.className = 'track-item';
            item.innerHTML = `
                <h6>${track.title}</h6>
                <p>Artista: ${track.artist || 'N/A'} | Duração: ${track.duration}s</p>
                <div class="track-actions">
                    <button class="edit" data-index="${index}">Editar</button>
                    <button class="delete" data-index="${index}">Remover</button>
                </div>
            `;
            tracksList.appendChild(item);
        });
        
        // Adicionar eventos para editar/remover faixas
        document.querySelectorAll('.track-actions .edit').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                editTrack(index);
            });
        });
        
        document.querySelectorAll('.track-actions .delete').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                currentTracks.splice(index, 1);
                updateTracksList();
            });
        });
    }
    
    function editMusic(type, index) {
        const anime = animeData[currentAnimeIndex];
        
        musicType.value = type;
        musicIndex.value = index;
        musicModalTitle.textContent = `Editar ${type === 'opening' ? 'Opening' : type === 'ending' ? 'Ending' : 'OST'}`;
        
        if (type === 'ost') {
            // Mostrar campos relevantes para OST
            document.getElementById('seasonField').style.display = 'none';
            document.getElementById('ostYearField').style.display = 'block';
            document.getElementById('ostTracksField').style.display = 'block';
            
            const ostKeys = Object.keys(anime.osts || {});
            const ostKey = ostKeys[index];
            const ostData = anime.osts[ostKey];
            
            musicTitle.value = ostKey;
            musicArtist.value = '';
            musicAudio.value = '';
            musicCover.value = ostData.cover || '';
            ostYear.value = ostData.year || '';
            
            // Carregar faixas
            currentTracks = [...(ostData.tracks || [])];
            updateTracksList();
        } else {
            // Mostrar campos relevantes para opening/ending
            document.getElementById('seasonField').style.display = 'block';
            document.getElementById('ostYearField').style.display = 'none';
            document.getElementById('ostTracksField').style.display = 'none';
            
            const musicData = anime[type + 's'][index];
            
            musicTitle.value = musicData.title;
            musicArtist.value = musicData.artist;
            musicAudio.value = musicData.audio;
            musicCover.value = musicData.cover || '';
            musicSeason.value = musicData.season || 1;
        }
        
        musicModal.style.display = 'block';
    }
    
    function editTrack(index) {
        const track = currentTracks[index];
        trackIndex.value = index;
        trackTitle.value = track.title;
        trackArtist.value = track.artist || '';
        trackAudio.value = track.audio;
        trackDuration.value = track.duration;
        trackModal.style.display = 'block';
    }
    
    function deleteMusic(type, index) {
        if (!confirm('Tem certeza que deseja remover este item?')) return;
        
        const anime = animeData[currentAnimeIndex];
        
        if (type === 'ost') {
            const ostKeys = Object.keys(anime.osts || {});
            const ostKey = ostKeys[index];
            delete anime.osts[ostKey];
        } else {
            anime[type + 's'].splice(index, 1);
        }
        
        updateMusicLists();
        updateJsonOutput();
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
        openingsList.innerHTML = '';
        endingsList.innerHTML = '';
        ostsList.innerHTML = '';
        currentAnimeIndex = -1;
        currentSeasonIndex = -1;
        currentEpisodeIndex = -1;
        tempSeasons = null;
        durationPreview.textContent = '';
        
        // Remover destacados de erro
        document.querySelectorAll('input, textarea, select').forEach(el => {
            el.style.borderColor = '';
        });
    }
    
    // Inicialização
    resetForm();
    updateJsonOutput();
});
