(() => { (new EventSource("/esbuild")).addEventListener('change', () => location.reload()); })();
function areBoxesInCollision(firstBox,secondBox){const isNotIntersectingHorizontally=firstBox.x>secondBox.width+secondBox.x||secondBox.x>firstBox.width+firstBox.x;const isNotIntersectingVertically=firstBox.y>secondBox.height+secondBox.y||secondBox.y>firstBox.height+firstBox.y;return!isNotIntersectingHorizontally&&!isNotIntersectingVertically}export{areBoxesInCollision};
