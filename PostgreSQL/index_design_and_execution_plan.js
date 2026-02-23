const hamburgerBtn = document.getElementById('hamburger-btn');
const closeBtn = document.getElementById('close-btn');
const commandMenu = document.getElementById('command-menu');
const menuLinks = document.querySelectorAll('.command-menu a');

const toggleMenu = () => {
    commandMenu.classList.toggle('active');
    hamburgerBtn.classList.toggle('active');
};

hamburgerBtn.addEventListener('click', toggleMenu);
closeBtn.addEventListener('click', toggleMenu);

menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        commandMenu.classList.remove('active');
        hamburgerBtn.classList.remove('active');
    });
});

// Close on ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && commandMenu.classList.contains('active')) {
        toggleMenu();
    }
});
