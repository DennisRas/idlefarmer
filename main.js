let balance = 100;
let expireTime = 5;

const $seeds = document.querySelectorAll(".seed");
const $cells = document.querySelectorAll(".cell");

$seeds.forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    $seeds.forEach((s) => {
      s.classList.remove("selected");
    });
    el.classList.add("selected");
  });
});

$cells.forEach((cell) => {
  cell.dataset["state"] = "empty";
  cell.dataset["name"] = "";
  cell.dataset["time"] = 0;
  cell.dataset["cost"] = 0;
  cell.dataset["reward"] = 0;

  cell.addEventListener("click", (e) => {
    e.preventDefault();
    let selectedSeed = getSelectedSeed();
    let seed = {
      name: selectedSeed.querySelector(".name").innerHTML,
      time: parseInt(selectedSeed.querySelector(".time").dataset["time"], 10),
      cost: parseInt(selectedSeed.querySelector(".cost").dataset["cost"], 10),
      reward: parseInt(
        selectedSeed.querySelector(".reward").dataset["reward"],
        10
      ),
    };

    switch (cell.dataset["state"]) {
      case "empty":
        if (balance >= seed.cost) {
          cell.dataset["state"] = "growing";
          cell.dataset["name"] = seed.name;
          cell.dataset["time"] = seed.time;
          cell.dataset["cost"] = seed.cost;
          cell.dataset["reward"] = seed.reward;
          balance -= seed.cost;
        }
        break;
      case "grown":
        balance += parseInt(cell.dataset["reward"], 10);
        cell.dataset["state"] = "empty";
        break;
      case "expired":
        cell.dataset["state"] = "empty";
        break;
    }
    update();
  });
  cell.timer = setInterval(() => {
    cell.dataset["time"] -= 1;
  }, 1000);
});

const getSelectedSeed = () => {
  return document.querySelector(".seed.selected");
};

const init = () => {
  balance = 100;
  update();
  setInterval(update, 1000);
};

const update = () => {
  document.querySelector(".balance").innerHTML = balance;
  $cells.forEach((cell) => {
    cell.querySelector(".name").innerHTML = "";
    cell.querySelector(".time").innerHTML = "";
    if (cell.dataset["state"] == "empty") {
    } else {
      if (cell.dataset["time"] <= 0) {
        cell.dataset["state"] = "grown";
      }
      if (cell.dataset["time"] <= -expireTime) {
        cell.dataset["state"] = "expired";
      }
      if (cell.dataset["time"] > 0) {
        cell.querySelector(".time").innerHTML = cell.dataset["time"];
      } else {
        cell.querySelector(".time").innerHTML = cell.dataset["state"];
      }
      if (cell.dataset["name"]) {
        cell.querySelector(".name").innerHTML = cell.dataset["name"];
      }
    }
    cell.className = "cell " + cell.dataset["state"];
  });
  $seeds.forEach((seed) => {
    console.log(parseInt(seed.dataset["cost"], 10));
    seed.classList.toggle(
      "disabled",
      parseInt(seed.querySelector(".cost").dataset["cost"], 10) > balance
    );
  });
};

init();
