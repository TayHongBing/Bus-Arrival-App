const busStopIdInput = document.getElementById("busStopId");
const arrivalInfo = document.getElementById("arrivalInfo");

async function fetchBusArrival(busStopId) {
  const response = await fetch(`https://sg-bus-arrivals.sigma-schoolsc1.repl.co/?id=${busStopId}`);
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new Error("Error fetching bus arrival data.");
  }
}

function formatArrivalData(arrivalData) {
  const buses = arrivalData.services;
  const formattedData = [];
  for (const bus of buses) {
    const arrivalTimeString = `${bus.next_bus_mins} min(s)`;
    if (bus.next_bus_mins > 0) {
      formattedData.push(`
        <div>
          <strong>Bus ${bus.bus_no}</strong>: ${arrivalTimeString}
        </div>
    `)
    } else {
      formattedData.push(`
          <div>
            <strong>Bus ${bus.bus_no}</strong>: <strong>Arriving</strong>
          </div>
      `)
    }
  }
  formattedData.push(`
      <br>
      <div>
        <strong>${buses.length} buses</strong>
      </div>
  `)
  return formattedData.join("");
}

let intervalId;
  
function displayBusArrival(busStopId) {
  arrivalInfo.innerHTML = "Loading...";
  if (!intervalId) {
    intervalId = setInterval(() => {
      fetchBusArrival(busStopId)
        .then(data => {
          const formattedData = formatArrivalData(data);
          arrivalInfo.innerHTML = formattedData;
        })
        .catch(error => {
          console.error(error);
          arrivalInfo.innerHTML = "Error fetching bus arrival data.";
        });
    }, 5000);
  } else {
    clearInterval(intervalId);
    intervalId = null;
    displayBusArrival(busStopId);
  }
}

function getBusTiming() {
  const busStopId = busStopIdInput.value;
  displayBusArrival(busStopId);
}