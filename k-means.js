function KMeans(arrayToProcess, Clusters) {
    var Groups = [];
    var Centroids = [];
    var oldCentroids = [];
    var changed = false;
    var i, j;

    // pick initial centroids
    var initialCentroids = Math.floor(arrayToProcess.length / (Clusters + 1));

    for (i = 0; i < Clusters; i++) {
        Centroids[i] = arrayToProcess[(initialCentroids * (i + 1))];
    }

    do
    {
        for (j = 0; j < Clusters; j++) {
            Groups[j] = [];
        }

        changed = false;

        for (i = 0; i < arrayToProcess.length; i++) {

            var distance = -1;
            var oldDistance = -1;
            var newGroup;

            for (j = 0; j < Clusters; j++) {
                distance = Math.sqrt((Centroids[j].x - arrayToProcess[i].x) * (Centroids[j].x - arrayToProcess[i].x) + (Centroids[j].y - arrayToProcess[i].y) * (Centroids[j].y - arrayToProcess[i].y));
                if (oldDistance == -1) {
                    oldDistance = distance;
                    newGroup = j;
                }
                else if (distance <= oldDistance) {
                    newGroup = j;
                    oldDistance = distance;
                }
            }
            Groups[newGroup].push(arrayToProcess[i]);
        }

        oldCentroids = Centroids;

        for (j = 0; j < Clusters; j++) {
            var total = {
                x: 0,
                y: 0
            };
            var newCentroid = {
                x: 0,
                y: 0
            };
            for (i = 0; i < Groups[j].length; i++) {
                total.x += Groups[j][i].x;
                total.y += Groups[j][i].y;
            }
            newCentroid.x = total.x / Groups[newGroup].length;
            newCentroid.y = total.y / Groups[newGroup].length;
            Centroids[j] = newCentroid;

        }

        for (j = 0; j < Clusters; j++) {
            if (Centroids[j] != oldCentroids[j]) {
                changed = true;
                break;
            }

        }
    }
    while (changed);

    return Groups;
}


var inputArray = [{x: 0, y: 0}, {x: 8, y: 0}, {x: 16, y: 0}, {x: 0, y: 6}, {x: 8, y: 6}, {x: 16, y: 6}];
var clusters = 3;

console.log(KMeans(inputArray, clusters));