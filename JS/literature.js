const novels = document.querySelectorAll('[id^="segment1_grid_"]');
const contents = document.querySelectorAll('[id^="segment1_grid_content_"]');
let reserve = 0;
novels.forEach((novel, index) => {
    reserve = index;
    novel.addEventListener('mouseover', () => {
        novel.style.width = '100vh';
        novel.style.height = '50vh';
        contents.forEach((content, reserve) => {
            content.style.width = '54vh';
            content.style.height = '40vh';
        });
    });
    novel.addEventListener('mouseout', () => {
        novel.style.width = '30vh';
        novel.style.height = '4vh';
        
        contents.forEach((content, reserve) => {
            content.style.width = '0vh';
        });
    
    });
});

