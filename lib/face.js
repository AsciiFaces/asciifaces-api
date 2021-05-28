function renderSvg(text) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="350" height="350" version="1.1">
        <style>
            text {
                font-family: monospace;
                font-size: 52px;
                font-weight: 800;
            }
        </style>
        <rect width="350" height="350" fill="black"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white">${text}</text>
    </svg>
    `;
}

module.exports = {
  renderSvg,
};
