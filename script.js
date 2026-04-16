/*
console.log("Lets write java script");

let currentSong = new Audio();
let songs = [];
let currFolder;

// ---------------- TIME FORMAT ----------------
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

// ---------------- GET SONGS ----------------
async function getSongs(folder) {
    currFolder = folder;

    let a = await fetch(folder + "/");
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;

    let links = div.getElementsByTagName("a");

    songs = [];

    for (let link of links) {
        if (link.href.endsWith(".mp3")) {
            songs.push(link.href.split("/").pop());
        }
    }

    // UL SELECTOR FIX (HTML me ul inside songlist hai)
    let songUL = document.querySelector(".songlist ul");
    songUL.innerHTML = "";

    for (let song of songs) {
        songUL.innerHTML += `
        <li>
            <img class="invert" src="music.svg" width="30">
            <div class="info">
                <div>${song.replaceAll("%20", " ")}</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="play.svg" width="20">
            </div>
        </li>`;
    }

    // CLICK EVENT
    document.querySelectorAll(".songlist li").forEach(li => {
        li.addEventListener("click", () => {
            let track = li.querySelector(".info div").innerText.trim();
            playMusic(track);
        });
    });

    return songs;
}

// ---------------- PLAY MUSIC ----------------
function playMusic(track, pause = false) {
    currentSong.src = currFolder + "/" + track;

    if (!pause) {
        currentSong.play();
        document.getElementById("play").src = "pause.svg";
    }

    document.querySelector(".songinfo").innerText = decodeURI(track);
    document.querySelector(".songtime").innerText = "00:00 / 00:00";
}


/*async function displayAlbums() {
    let a = await fetch(`./songs/`); // Yahan se list milti hai
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer");
    cardContainer.innerHTML = "";

    let array = Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        // CHECK: Link mein '/songs/' hona chahiye aur wo folder hona chahiye (endsWith("/"))
        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            //let folder = e.href.split("/").slice(-2)[0]; // Folder ka sahi naam nikalne ke liye
           let url = new URL(e.href);
           let parts = url.pathname.split("/");
           let folder = parts[parts.length - 2];



            // Hum sirf tabhi fetch karenge jab folder ka naam valid ho
            // Agar folder naam "songs" hi aa raha hai toh skip karein
            if (folder === "songs") continue;

            try {
                let response = await fetch(`./songs/${folder}/info.json`);
                if (response.ok) {
                    let data = await response.json();
                    cardContainer.innerHTML += `
                    <div data-folder="${folder}" class="card">
                        <div class="play">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 20V4L19 12L5 20Z" fill="#000" stroke="#141B34" stroke-width="1.5" stroke-linejoin="round" />
                            </svg>
                        </div>
                        <img src="./songs/${folder}/cover.jpg" alt="">
                        <h2>${data.title}</h2>
                        <p>${data.description}</p>
                    </div>`;
                }
            } catch (error) {
                console.log("Error fetching info.json for:", folder);
            }
        }
    }

    // Card click event yahan rahega...
    document.querySelectorAll(".card").forEach(card => {
        card.addEventListener("click", async (e) => {
            let folder = e.currentTarget.dataset.folder;
            songs = await getSongs(`songs/${folder}`);
            if (songs.length > 0) {
                playMusic(songs[0]);
            }
        });
    });
}
async function displayAlbums() {
    let response = await fetch("./songs/albums.json");
    let folders = await response.json();
    let cardContainer = document.querySelector(".cardContainer");
    cardContainer.innerHTML = "";

    for (let folder of folders) {
        try {
            let info = await fetch(`./songs/${folder}/info.json`);
            let data = await info.json();

            cardContainer.innerHTML += `
                <div data-folder="${folder}" class="card">
                    <div class="play">▶</div>
                    <img src="./songs/${folder}/cover.jpg" alt="">
                    <h2>${data.title}</h2>
                    <p>${data.description}</p>
                </div>`;
        } catch (err) {
            console.log("Album load error:", folder);
        }
    }

    document.querySelectorAll(".card").forEach(card => {
        card.addEventListener("click", async () => {
            let folder = card.dataset.folder;
            songs = await getSongs(`songs/${folder}`);
            if (songs.length > 0) playMusic(songs[0]);
        });
    });
}

/*async function displayAlbums() {

    // LINE 1
    let folders = await fetch("/songs/albums.json");
    let albums = await folders.json();

    // LINE 4
    let cardContainer = document.querySelector(".cardContainer");
    cardContainer.innerHTML = "";

    // LINE 7
    for (let folder of albums) {

        try {
            // LINE 10
            let response = await fetch(`/songs/${folder}/info.json`);
            let data = await response.json();

            // LINE 14
            cardContainer.innerHTML += `
                <cdiv data-folder="${folder}" class="card">
                    <div class="play">▶</div>
                    <img src="/songs/${folder}/cover.jpg">
                    <h2>${data.title}</h2>
                    <p>${data.description}</p>
                </div>
            `;
        } catch (err) {
            console.log("Album load error:", folder);
        }
    }

    // LINE 26
    document.querySelectorAll(".card").forEach(card => {
        card.addEventListener("click", async () => {
            let folder = card.dataset.folder;
            songs = await getSongs(`songs/${folder}`);
            playMusic(songs[0]);
        });
    });
}

// ---------------- MAIN ----------------
async function main() {

    await getSongs("songs/ncs");
    if (songs.length > 0) playMusic(songs[0], true);

    await displayAlbums();

    // PLAY/PAUSE BUTTON
    document.getElementById("play").addEventListener("click", () => {

        if (currentSong.paused) {
            currentSong.play();
            document.getElementById("play").src = "pause.svg";
        } else {
            currentSong.pause();
            document.getElementById("play").src = "play.svg";
        }
    });

    // NEXT
    document.getElementById("next").addEventListener("click", () => {

        let index = songs.indexOf(currentSong.src.split("/").pop());

        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1]);
        }
    });

    // PREVIOUS
    document.getElementById("previous").addEventListener("click", () => {

        let index = songs.indexOf(currentSong.src.split("/").pop());

        if ((index - 1) >= 0) {
            playMusic(songs[index - 1]);
        }
    });

    // TIME UPDATE
    currentSong.addEventListener("timeupdate", () => {

        document.querySelector(".songtime").innerText =
            `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;

        document.querySelector(".circle").style.left =
            (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    // SEEKBAR
    document.querySelector(".seekbar").addEventListener("click", e => {

        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;

        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    });

    // VOLUME
    document.querySelector(".range input").addEventListener("input", e => {
        currentSong.volume = e.target.value / 100;
    });

    // HAMBURGER
    document.querySelector(".hamburgerContainer").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-130%";
    });
}

main();*/
console.log("Lets write java script");

let currentSong = new Audio();
let songs = [];
let currFolder;

// ---------------- TIME FORMAT ----------------
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

// ---------------- GET SONGS ----------------
async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`${folder}/`);
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;

    let links = div.getElementsByTagName("a");
    songs = [];

    for (let link of links) {
        if (link.href.endsWith(".mp3")) {
            // Netlify par URL se sirf filename nikalne ke liye
            let songName = link.href.split("/").pop();
            songs.push(songName);
        }
    }

    let songUL = document.querySelector(".songlist ul");
    songUL.innerHTML = "";

    for (let song of songs) {
        // Display ke liye %20 ko space mein badlo
        let displayName = decodeURI(song);
        songUL.innerHTML += `
        <li>
            <img class="invert" src="music.svg" width="30">
            <div class="info">
                <div>${displayName}</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="play.svg" width="20">
            </div>
        </li>`;
    }

    // CLICK EVENT ON LIST
    document.querySelectorAll(".songlist li").forEach(li => {
        li.addEventListener("click", () => {
            let trackName = li.querySelector(".info div").innerText.trim();
            playMusic(trackName);
        });
    });

    return songs;
}

// ---------------- PLAY MUSIC ----------------
function playMusic(track, pause = false) {
    // Agar track mein space hai toh use URL friendly banao
    currentSong.src = `${currFolder}/` + track;

    if (!pause) {
        currentSong.play();
        document.getElementById("play").src = "pause.svg";
    }

    document.querySelector(".songinfo").innerText = decodeURI(track);
    document.querySelector(".songtime").innerText = "00:00 / 00:00";
}

// ---------------- DISPLAY ALBUMS ----------------
async function displayAlbums() {
    try {
        let response = await fetch("./songs/albums.json");
        let folders = await response.json();
        let cardContainer = document.querySelector(".cardContainer");
        cardContainer.innerHTML = "";

        for (let folder of folders) {
            try {
                let info = await fetch(`./songs/${folder}/info.json`);
                let data = await info.json();

                cardContainer.innerHTML += `
                    <div data-folder="${folder}" class="card">
                        <div class="play">
                             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 20V4L19 12L5 20Z" fill="#000" stroke="#141B34" stroke-width="1.5" stroke-linejoin="round" />
                            </svg>
                        </div>
                        <img src="./songs/${folder}/cover.jpg" alt="">
                        <h2>${data.title}</h2>
                        <p>${data.description}</p>
                    </div>`;
            } catch (err) {
                console.log("Album info error:", folder);
            }
        }

        // Card click event
        document.querySelectorAll(".card").forEach(card => {
            card.addEventListener("click", async () => {
                let folder = card.dataset.folder;
                songs = await getSongs(`songs/${folder}`);
                if (songs.length > 0) playMusic(songs[0]);
            });
        });
    } catch (error) {
        console.log("Albums list not found");
    }
}

// ---------------- MAIN FUNCTION ----------------
async function main() {
    // Initial Load
    await getSongs("songs/ncs");
    if (songs.length > 0) playMusic(songs[0], true);

    await displayAlbums();

    // PLAY/PAUSE
    document.getElementById("play").addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            document.getElementById("play").src = "pause.svg";
        } else {
            currentSong.pause();
            document.getElementById("play").src = "play.svg";
        }
    });

    // NEXT SONG
    document.getElementById("next").addEventListener("click", () => {
        let currentTrack = currentSong.src.split("/").pop();
        let index = songs.indexOf(currentTrack);

        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1]);
        }
    });

    // PREVIOUS SONG
    document.getElementById("previous").addEventListener("click", () => {
        let currentTrack = currentSong.src.split("/").pop();
        let index = songs.indexOf(currentTrack);

        if ((index - 1) >= 0) {
            playMusic(songs[index - 1]);
        }
    });

    // SEEKBAR UPDATE
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerText =
            `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left =
            (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    });

    // VOLUME CONTROL
    document.querySelector(".range input").addEventListener("input", e => {
        currentSong.volume = e.target.value / 100;
    });

    // RESPONSIVE MENU
    document.querySelector(".hamburgerContainer").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-130%";
    });
}

main();
     

    
    










    


