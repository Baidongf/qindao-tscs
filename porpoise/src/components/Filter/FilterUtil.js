export const FilterUtil = {
    isEdgeVisible: function(edges, name, visible) {
        let edge = this.findEdgeByClass(edges, name, visible);
        return edge ? edge.visible : false;
    },

    setEdgeVisibility: function(edges, name, visible) {
        let edge = this.findEdgeByClass(edges, name);
        edge && (edge.visible = visible);
    },

    setEdgeTraceDepth: function(edges, name, traceDepth) {
        let edge = this.findEdgeByClass(edges, name);
        edge.trace_depth = parseInt(traceDepth);
    },

    getEdgeTraceDepth: function(edges, name) {
        let edge = this.findEdgeByClass(edges, name);
        return edge && edge.trace_depth;
    },

    configOptionArr: function(arr, name, isChecked) {
        if (isChecked) {
            arr.push(name);
        } else {
            let idx = arr.indexOf(name);
            arr.splice(idx, 1);
        }
    },

    findEdgeByClass: (edges, name, visible) => {
        if(!edges.find(e => e.class == name)){
            edges.push({
                class:name,
                trace_depth:1,
                visible:visible||false
            })
        }
        return edges.find(e => e.class == name);
    }
}