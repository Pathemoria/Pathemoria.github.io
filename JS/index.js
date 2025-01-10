function testIn() {
    console.log("hovering in sidebar");
}
  
function testOut() {
    console.log("hovering outside sidebar");
}

var mini = true;

function toggleSidebar() {
  if (mini) {
    console.log("opening sidebar");
    document.getElementById("mySidebar").style.width = "18%";
    document.getElementById("not_sidebar").style.marginLeft = "12%";

    this.mini = false;
  } else {
    console.log("closing sidebar");
    document.getElementById("mySidebar").style.width = "5%";
    document.getElementById("not_sidebar").style.marginLeft = "0";

    this.mini = true;
  }
}

/* Constant variables for links & images in left sidebar */
const link1 = document.getElementById('hoverLink1');
const link2 = document.getElementById('hoverLink2');
const link3 = document.getElementById('hoverLink3');
const link4 = document.getElementById('hoverLink4');

const image1 = document.getElementById('image1');
const image2 = document.getElementById('image2');
const image3 = document.getElementById('image3');
const image4 = document.getElementById('image4');

/* Opacity effect for sidebar hover effect */
link1.addEventListener('mouseover', () => {
  image1.style.opacity = 1;
});
link1.addEventListener('mouseout', () => {
  image1.style.opacity = 0.3;
});
link2.addEventListener('mouseover', () => {
  image2.style.opacity = 1;
});
link2.addEventListener('mouseout', () => {
  image2.style.opacity = 0.3;
});
link3.addEventListener('mouseover', () => {
  image3.style.opacity = 1;
});
link3.addEventListener('mouseout', () => {
  image3.style.opacity = 0.3;
});
link4.addEventListener('mouseover', () => {
  image4.style.opacity = 1;
});
link4.addEventListener('mouseout', () => {
  image4.style.opacity = 0.3;
});