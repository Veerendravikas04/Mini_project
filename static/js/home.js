document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        link.classList.add('active');
    });
});

document.getElementById('playNowBtn').addEventListener('click', () => {
    window.location.href = '/game';
});

const sections = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.3 });

sections.forEach(section => {
    observer.observe(section);
});
