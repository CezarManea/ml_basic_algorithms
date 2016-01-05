var _ = require('underscore');

var classifyFn = function (input) {

    var sorted_dataset = sort(input, dataset);
    var top_k = topK(sorted_dataset, 3);
    var counts = classCount(top_k);
    return classify(counts);
};

var distance = function (item1, item2) {
    var a = item1[0] - item2[0];
    var b = item1[1] - item2[1];

    return Math.sqrt((Math.pow(a, 2) + Math.pow(b, 2)));
};

var sort = function (unknown_item, dataset) {
    return _.sortBy(dataset, function (item) {
        return distance(item, unknown_item);
    });
};

var topK = function (dataset, k) {
    return _.first(dataset, k);
};

var classCount = function (dataset) {
    return _.countBy(dataset, function (item) {
        return item[2];
    });
};

var classify = function (dataset) {
    return _.max(_.pairs(dataset), function (item) {
        return item[1];
    })[0];
};

var dataset = [
    [303, 3, "banana"],
    [370, 1, "apple"],
    [298, 3, "banana"],
    [277, 3, "banana"],
    [377, 4, "apple"],
    [299, 3, "banana"],
    [382, 1, "apple"],
    [374, 4, "apple"],
    [303, 4, "banana"],
    [309, 3, "banana"],
    [359, 1, "apple"],
    [366, 1, "apple"],
    [311, 3, "banana"],
    [302, 3, "banana"],
    [373, 4, "apple"],
    [305, 3, "banana"],
    [371, 3, "apple"]
];

console.log(classifyFn([303, 4]));