const grid1 = document.getElementById('segment1_grid1');
const grid2 = document.getElementById('segment1_grid2');
const grid3 = document.getElementById('segment1_grid3');

const header1 = document.getElementById('segment1_grid_header1');
const header2 = document.getElementById('segment1_grid_header2');
const header3 = document.getElementById('segment1_grid_header3');

const fields = document.querySelectorAll('[id^="segment1_grid_desc_individual"]');

grid1.addEventListener('mouseover', () => {
    header1.style.paddingBottom = '4%';
});
grid1.addEventListener('mouseout', () => {
    header1.style.paddingBottom = '1%';
});
grid2.addEventListener('mouseover', () => {
    header2.style.paddingBottom = '4%';
});
grid2.addEventListener('mouseout', () => {
    header2.style.paddingBottom = '1%';
});
grid3.addEventListener('mouseover', () => {
    header3.style.paddingBottom = '4%';
});
grid3.addEventListener('mouseout', () => {
    header3.style.paddingBottom = '1%';
});

fields.forEach((field, index) => {
    field.addEventListener('mouseover', () => {
        field.style.height = 'calc(100% + 6vh)'; // Increase height
        field.style.transform = 'translateY(-6vh)'; // Move upwards to compensate
    });
    field.addEventListener('mouseout', () => {
        field.style.height = '100%'; // Reset height
        field.style.transform = 'translateY(0)'; // Reset position
    });
});
