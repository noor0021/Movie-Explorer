// just a small scroll reveal effect for the project notes section
window.addEventListener('DOMContentLoaded', function() {

    var notes = document.querySelectorAll('.note-item');
    for (var i = 0; i < notes.length; i++) {
        notes[i].style.opacity = '0';
        notes[i].style.transform = 'translateY(20px)';
        notes[i].style.transition = 'all 0.6s ease-out';
    }

    var observer = new IntersectionObserver(function(entries) {
        for (var j = 0; j < entries.length; j++) {
            if (entries[j].isIntersecting) {
                entries[j].target.style.opacity = '1';
                entries[j].target.style.transform = 'translateY(0)';
            }
        }
    }, { threshold: 0.1 });

    for (var k = 0; k < notes.length; k++) {
        observer.observe(notes[k]);
    }
});
