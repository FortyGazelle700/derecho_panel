let reviewBackButton = document.getElementById("review-back-btn");
let reviewContinueButton = document.getElementById("review-continue-btn");

reviewBackButton.addEventListener("click", () => {
  document.getElementById("serverReview").classList.add("collapsed");
  document.getElementById("serverMemory").classList.remove("collapsed");
});

reviewContinueButton.addEventListener("click", () => {
  document.getElementById("serverReview").classList.add("collapsed");
});
