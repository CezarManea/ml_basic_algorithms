var HierarchicalClustering = function (threshold) {
    this.threshold = threshold == undefined ? Infinity : threshold;
    this.cluster = function (items, snapshotPeriod, snapshotCb) {
        this.clusters = [];
        this.dists = [];  // distances between each pair of clusters
        this.mins = []; // closest cluster for each cluster
        this.index = []; // keep a hash of all clusters by key

        for (var i = 0; i < items.length; i++) {
            var cluster = {
                value: items[i],
                key: i,
                index: i,
                size: 1
            };
            this.clusters[i] = cluster;
            this.index[i] = cluster;
            this.dists[i] = [];
            this.mins[i] = 0;
        }

        for (i = 0; i < this.clusters.length; i++) {
            for (var j = 0; j <= i; j++) {
                var dist = (i == j) ? Infinity :
                    distances(this.clusters[i].value, this.clusters[j].value);
                this.dists[i][j] = dist;
                this.dists[j][i] = dist;

                if (dist < this.dists[i][this.mins[i]]) {
                    this.mins[i] = j;
                }
            }
        }

        var merged = this.mergeClosest();
        i = 0;
        while (merged) {
            if (snapshotCb && (i++ % snapshotPeriod) == 0) {
                snapshotCb(this.clusters);
            }
            merged = this.mergeClosest();
        }

        this.clusters.forEach(function (cluster) {
            // clean up metadata used for clustering
            delete cluster.key;
            delete cluster.index;
        });

        return this.clusters;
    };

    this.mergeClosest = function () {
        // find two closest clusters from cached mins
        var minKey = 0, min = Infinity, i;
        for (i = 0; i < this.clusters.length; i++) {
            var key = this.clusters[i].key,
                dist = this.dists[key][this.mins[key]];
            if (dist < min) {
                minKey = key;
                min = dist;
            }
        }
        if (min >= this.threshold) {
            return false;
        }

        var c1 = this.index[minKey],
            c2 = this.index[this.mins[minKey]];

        // merge two closest clusters
        var merged = {
            left: c1,
            right: c2,
            key: c1.key,
            size: c1.size + c2.size
        };

        this.clusters[c1.index] = merged;
        this.clusters.splice(c2.index, 1);
        this.index[c1.key] = merged;

        // update distances with new merged cluster
        for (i = 0; i < this.clusters.length; i++) {
            var ci = this.clusters[i];
            if (c1.key == ci.key) {
                dist = Infinity;
            }
            else {
                dist = this.dists[c1.key][ci.key];
                if (this.dists[c1.key][ci.key] > this.dists[c2.key][ci.key]) {
                    dist = this.dists[c2.key][ci.key];
                }
            }

            this.dists[c1.key][ci.key] = this.dists[ci.key][c1.key] = dist;
        }

        // update cached mins
        for (i = 0; i < this.clusters.length; i++) {
            var key1 = this.clusters[i].key;
            if (this.mins[key1] == c1.key || this.mins[key1] == c2.key) {
                min = key1;
                for (var j = 0; j < this.clusters.length; j++) {
                    var key2 = this.clusters[j].key;
                    if (this.dists[key1][key2] < this.dists[key1][min]) {
                        min = key2;
                    }
                }
                this.mins[key1] = min;
            }
            this.clusters[i].index = i;
        }

        // clean up metadata used for clustering
        delete c1.key;
        delete c2.key;
        delete c1.index;
        delete c2.index;

        return true;
    }
};

var distances = function () {
    return function (v1, v2) {
        var total = 0;
        for (var i = 0; i < v1.length; i++) {
            total += Math.pow(v2[i] - v1[i], 2);
        }
        return Math.sqrt(total);
    };
};

var hcluster = function (items, threshold, snapshot, snapshotCallback) {
    var clusters = (new HierarchicalClustering(threshold))
        .cluster(items, snapshot, snapshotCallback);

    if (threshold === undefined) {
        return clusters[0]; // all clustered into one
    }
    return clusters;
};

var colors = [
    [20, 20, 80],
    [22, 22, 90],
    [250, 255, 253],
    [100, 54, 255]
];

console.log(hcluster(colors));