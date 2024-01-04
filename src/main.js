const a = {
  a: 1,
  b: {
    c: 2,
  },
};

const button = document.getElementById("button");
button.addEventListener("click", clickAction);

function clickAction() {
  a.b.c += 2;
  console.log(a);
}
