"use strict";

//! Implementing Modal window
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");

const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener("click", openModal);
btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

//! implementing button smooth scrolling

btnScrollTo.addEventListener("click", function (e) {
  //kisi b point par viewport ki width r height nikalna ka liya
  console.log("height", document.documentElement.clientHeight);
  console.log("width", document.documentElement.clientWidth);
  // Viewport ka relative coordinates find karna ka liya
  const s1Coords = section1.getBoundingClientRect();
  // console.log(s1Coords);

  //jo element target hua ha jis par event occur hua a is ka coordinats nikalna ka liya
  // console.log(e.target.getBoundingClientRect());

  // OLD SCHOOL WAY of implementing smooth scrolling
  // s1Coords.left + window.pageXOffset,
  // s1Coords.top + window.pageYOffset

  //Modern Way of implementing smooth scrolling
  // window.scrollTo({
  //   left: s1Coords.left + window.pageXOffset,
  //   top: s1Coords.top + window.pageYOffset,
  //   behavior: "smooth",
  // });

  //MORE  Modern Way of implementing smooth scrolling
  section1.scrollIntoView({ behavior: "smooth" });
});

//! page Navigation smoothly
// Modern way of event delegation
// Two steps involved in event delegation see rigister
document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();

  //matching strategy
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    const scrollTosec = document.querySelector(id);
    scrollTosec.scrollIntoView({ behavior: "smooth" });
  } else {
    console.log("bhi link par to click karo");
  }
});

// OLD school way of performing smooth page navigation => event delegation

// document.querySelectorAll(".nav__link").forEach(function (el) {
//   el.addEventListener("click", function (e) {
//     e.preventDefault();
//     const id = el.getAttribute("href");
//     const scrollToSection = document.querySelector(id);
//     scrollToSection.scrollIntoView({ behavior: "smooth" });
//   });
// });

//! implementing Tabbed Button

const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");

tabsContainer.addEventListener("click", function (e) {
  e.preventDefault();
  const clicked = e.target.closest(".operations__tab");
  // console.log(clicked);
  // Guard clause
  if (!clicked) return;

  //Active tab
  tabs.forEach((t) => t.classList.remove("operations__tab--active"));
  clicked.classList.add("operations__tab--active");

  //Active Content Area
  tabsContent.forEach((tc) =>
    tc.classList.remove("operations__content--active")
  );
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

//! implementing fade animation on navigation
const nav = document.querySelector(".nav");

function handleHover(e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const sibling = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");
    sibling.forEach((s) => {
      if (link !== s) s.style.opacity = this;
    });
    logo.style.opacity = this;
  }
}
nav.addEventListener("mouseover", handleHover.bind(0.5));

nav.addEventListener("mouseout", handleHover.bind(1));

//! implementing sticky nav INTERSECTION OBSERVATON API
const section3 = document.querySelector("#section--3");
const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect().height;

// const obsCallback = function (entries, observer) {
//   entries.forEach((entry) => {
//     console.log(entry);
//   });
// };

// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };
// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const stckyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};

const headerObserver = new IntersectionObserver(stckyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

//! implementing  Reveal sections on scroll
const sections = document.querySelectorAll(".section");
const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

sections.forEach((section) => {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

// impmenting lazy loading images
const imgTargets = document.querySelectorAll("img[data-src]");

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "100px",
});
imgTargets.forEach((img) => imgObserver.observe(img));

//! building a slider componenet

const slider = function () {

  const slides = document.querySelectorAll(".slide");
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  const dotsContainer = document.querySelector(".dots");
  const numOfSlides = slides.length;
  let curSlide = 0;

  //functions
  const createDots = function () {
    slides.forEach((_, i) => {
      dotsContainer.insertAdjacentHTML("beforeend", `<button class="dots__dot" data-slide="${i}"></button>`);
    });
  };

  const activateDots = function (slide) {
    document.querySelectorAll(".dots__dot").forEach(function (dot) {
      dot.classList.remove("dots__dot--active");
    })
    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add("dots__dot--active");
  };

  const goToSlide = function (slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
    })
  }

  //Next Slide right button
  const nextSlide = function () {
    if (curSlide == numOfSlides - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateDots(curSlide);
  }

  const prevSlide = function () {
    if (curSlide == 0) {
      curSlide = numOfSlides - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDots(curSlide);
  }
  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  document.addEventListener("keydown", function (e) {
    console.log(e);
    if (e.key === "ArrowLeft") prevSlide();
    e.key === "ArrowRight" && nextSlide();
  })

  dotsContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      const slide = e.target.dataset.slide;
      goToSlide(slide);
      activateDots(curSlide);
    } else {
    }
  });

  //initialization function 
  const init = function () {
    goToSlide(0);
    createDots();
    activateDots(0);
  }
  init();
};
slider();
//! PRACTICE
// const message = document.createElement("div");
// message.classList.add("create-element");
// message.textContent = "Hello I am programaticly inserted";
// const header = document.querySelector(".header");
// // header.prepend(message);

// EVENTS HANDLING

// 1) mouseenter event
//modern way of adding event
// const h1 = document.querySelector("h1");
// h1.addEventListener("mouseenter", (e) => {
//   alert("Hello I am called on mouseeneter event");
// });

//old school way of adding event
// h1.onclick = function () {
//   alert("I am calling on OLD school way: click");
// };

// Remove an event
//pahla event fire ho ga aik dafa fire hona par jab callBack function chala ga to ham us function ma event remove kra data hain. Is scenario ma event aik bar chala ga.
// function alertfn() {
//   alert("Hello i am a seprate function");
//   h1.removeEventListener("click", alertfn);
// }
// h1.addEventListener("click", alertfn);

// Event propagation Bubbling and capturing.

// Generate Random number
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);

// //Use that  random number to generate the color
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)}, ${randomInt(0, 255)})`;

//Attaching an event listener on nav_link(single anchor element)
// document.querySelector(".nav__link").addEventListener("click", function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log("link", e.target, e.currentTarget);

//   // howt to stop propagation of Event
//   //so the event will not at any other element.But it is not a good idea to stop propagation.
//   e.stopPropagation();
// });

//attaching an event listner to the nav__links
// document.querySelector(".nav__links").addEventListener("click", function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log("nav__links", e.target, e.currentTarget);
// });
//attaching an event listner to the nav
// document.querySelector(".nav").addEventListener("click", function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log("nav", e.target, e.currentTarget);
// });

//!Dom traversing practice
//* going downwards in DOM
//?1) querySelector()=> gives us all child elements to any deep level
// const h1 = document.querySelector("h1");
// h1.querySelector(".highlight").style.padding = "50px";
// console.log(h1.querySelector(".highlight"));

//?2)  childNodes => gives us the  child nodes of every type related to the element
// console.log(h1.childNodes);

//?3)  childElement=>give us direct childs
// console.log(h1.children);
// Destructuring an HTML nodeList
// const [x, y, z] = [...h1.children];
// x.style.backgroundColor = "red";
// z.style.backgroundColor = "blue";
// console.log(y);

//?4) firstElementChild and lastElementChild => give us the vary  last and first element
// console.log(h1.firstElementChild);
// console.log(h1.lastElementChild);

//* Going upwards in DOM
//? 1)h1.parentNode h1.parentElement => Both selecting Direct parents
// console.log(h1.parentNode);
// console.log(h1.parentElement);
//? h1.closest("query String") selecting indirect parents no matter how far up they are => it will select the closest element with the .header class
// console.log(h1.closest(".header"));
//* going sideways in DOM :Siblings
// //In javascript we can only access the direct siblings only next   and previous ones.

//life cycle DOM events => event occur during a page lifecycle => the moment from where the page is first access until the user leaves it

//1) DOM content loaded => Is event ka load hona sa pahla tmam  HTMl parse(mtlb HTML download kar ka us ka DOM tree bna liya jata ha) r tmam scripts b download r execute ho chuka hota hain
// mtlb ya event tab chala ga jab html parse ho chuki ho r DOM built ho chuka ho 
//isi liya ham HTML ma script tag aakhir ma rakhta hain taka pahla sari html load ho jaya phir js execute ho.
document.addEventListener("DOMContentLoaded", function (e) {
  console.log("DOMContentLoaded",e);
});

//2)
//  the load event is fired when not only the HTML and JS is parsed but also the external resources and images are loaded
//basically when complete page finish loading this event fired. 
window.addEventListener("load",function(e){
    console.log("load",e); 
}); 

//3)
//beforeUnload event
// This event is created immediately before a user is about to leave the page
//basically we use this event if they are 100% sure that they want to leave the page 
// window.addEventListener("beforeunload",function(e){
//    e.preventDefault();
//    console.log("beforeUnload",e);
//    e.returnValue="";     
// });


//Different ways of loading scripts in HTML DEFFER AND ASYNC