const novels = document.querySelectorAll('[id^="segment1_grid_"]');
const contents = document.querySelectorAll('[id^="segment1_grid_content_"]');
let reserve = 0;

novels.forEach((novel, index) => {
    reserve = index;
    novel.addEventListener('mouseover', () => {
        novel.style.width = '100vh';
        novel.style.height = '55vh';
        contents.forEach((content, reserve) => {
            content.style.width = '90%';
            content.style.height = '70%';
            content.style.opacity = '100%'
            content.style.transition = "opacity 1.8s ease";
        });
    });
    novel.addEventListener('mouseout', () => {
        novel.style.width = '33vh';
        novel.style.height = '4vh';        
        contents.forEach((content, reserve) => {
            content.style.opacity = '0%';
        });
    
    });
});
function testIn() {
    console.log("hovering in sidebar");
}
  
function testOut() {
    console.log("hovering outside sidebar");
}


