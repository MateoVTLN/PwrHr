const imageList = [
    "IMG/504866395_17862903453424537_5707323360489069803_n.jpg",
    "IMG/510431307_17862903486424537_1265314599165967404_n.jpg",
    "IMG/510963800_17862903477424537_1843944005459151719_n.jpg",
    "IMG/Power Mash Up.mp4"
];

// --- Popup ---
window.onload = function() {
    document.getElementById("popup").style.display = "block";
    document.getElementById("overlay").style.display = "block";
};

function closePopup() {
    document.getElementById("popup").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

// --- Shuffle ---
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// --- Carousel population ---
function addMediaToCarousel(container, numItems = 50) {
    const shuffled = shuffleArray([...imageList]);
    const items = shuffled.slice(0, numItems);

    items.forEach(url => {
        let element;
        if (url.endsWith(".mp4") || url.endsWith(".webm")) {
            element = document.createElement("video");
            element.src = url;
            element.autoplay = false;   // autoplay handled by code
            element.loop = false;       // no loop, we want to move on
            element.muted = true;
            element.playsInline = true;
            element.classList.add("carousel-video");
        } else {
            element = document.createElement("img");
            element.src = url;
            element.classList.add("carousel-image");
        }
        container.querySelector(".carousel").appendChild(element);
    });
}

// --- Carousel behavior ---
document.querySelectorAll(".carousel-container").forEach((container) => {
    addMediaToCarousel(container);

    let mediaItems = container.querySelectorAll(".carousel img, .carousel video");
    let currentIndex = 0;
    let total = mediaItems.length;

    if (total === 0) {
        console.error("No media found for carousel.");
        return;
    }

    function showItem(index) {
        mediaItems.forEach((el, i) => {
            el.classList.remove("active");
            if (i === index) {
                el.classList.add("active");
                console.log(`Showing: ${el.tagName} - ${el.getAttribute("src")}`);

                if (el.tagName === "VIDEO") {
                    el.currentTime = 0;
                    el.play().catch(err => console.warn("Autoplay prevented:", err));
                    // when video ends → move to next
                    el.onended = () => {
                        nextItem();
                    };
                } else {
                    // for images → auto switch after 5s
                    setTimeout(() => {
                        nextItem();
                    }, 5000);
                }
            }
        });
    }

    function nextItem() {
        currentIndex = (currentIndex + 1) % total;
        showItem(currentIndex);
    }

    function prevItem() {
        currentIndex = (currentIndex - 1 + total) % total;
        showItem(currentIndex);
    }

    container.querySelector(".next").addEventListener("click", nextItem);
    container.querySelector(".prev").addEventListener("click", prevItem);

    // Start carousel
    showItem(currentIndex);
});