export const getCars = () => {
  return fetch("https://carrestservice-carshop.rahtiapp.fi/cars").then(
    (response) => {
      if (!response.ok) {
        throw new Error("Error in fetch " + response.statusText);
      } else {
        return response.json();
      }
    }
  );
};
